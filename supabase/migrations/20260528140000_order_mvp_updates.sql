-- Add new order statuses
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'LAUKIA_PATVIRTINIMO';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'PATVIRTINTAS';

-- Add estimated delivery time column (in minutes)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_time INTEGER;

-- Update trigger function to default new orders to 'LAUKIA_PATVIRTINIMO'
CREATE OR REPLACE FUNCTION public.validate_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Required contact fields, length limits
  IF length(trim(NEW.customer_name)) < 1 OR length(NEW.customer_name) > 200 THEN
    RAISE EXCEPTION 'Invalid customer_name';
  END IF;
  IF length(trim(NEW.customer_phone)) < 4 OR length(NEW.customer_phone) > 50 THEN
    RAISE EXCEPTION 'Invalid customer_phone';
  END IF;
  IF length(NEW.customer_email) > 200 OR NEW.customer_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid customer_email';
  END IF;

  -- Delivery requirements
  IF NEW.delivery_method = 'delivery' THEN
    IF NEW.address_street IS NULL OR length(trim(NEW.address_street)) < 1 OR length(NEW.address_street) > 500 THEN
      RAISE EXCEPTION 'Invalid address_street';
    END IF;
    IF NEW.address_city IS NULL OR length(trim(NEW.address_city)) < 1 OR length(NEW.address_city) > 200 THEN
      RAISE EXCEPTION 'Invalid address_city';
    END IF;
    IF NEW.distance_km IS NULL OR NEW.distance_km < 0 OR NEW.distance_km > 10 THEN
      RAISE EXCEPTION 'Distance must be between 0 and 10 km';
    END IF;
    IF NEW.delivery_fee < 0 OR NEW.delivery_fee > 20 THEN
      RAISE EXCEPTION 'Invalid delivery_fee';
    END IF;
    IF NEW.items_total < 15 THEN
      RAISE EXCEPTION 'Minimum order amount for delivery is 15 EUR';
    END IF;
  ELSE
    -- Pickup: clear delivery-only fields server-side
    NEW.address_street := NULL;
    NEW.address_apartment := NULL;
    NEW.address_city := NULL;
    NEW.address_door_code := NULL;
    NEW.address_lat := NULL;
    NEW.address_lng := NULL;
    NEW.distance_km := NULL;
    NEW.delivery_fee := 0;
  END IF;

  -- Optional length limits
  IF NEW.address_apartment IS NOT NULL AND length(NEW.address_apartment) > 100 THEN
    RAISE EXCEPTION 'Invalid address_apartment';
  END IF;
  IF NEW.address_door_code IS NOT NULL AND length(NEW.address_door_code) > 50 THEN
    RAISE EXCEPTION 'Invalid address_door_code';
  END IF;
  IF NEW.comment IS NOT NULL AND length(NEW.comment) > 1000 THEN
    RAISE EXCEPTION 'Comment too long';
  END IF;

  -- Items + totals
  IF jsonb_typeof(NEW.items) <> 'array' THEN
    RAISE EXCEPTION 'Items must be an array';
  END IF;
  IF jsonb_array_length(NEW.items) < 1 OR jsonb_array_length(NEW.items) > 100 THEN
    RAISE EXCEPTION 'Order must contain between 1 and 100 items';
  END IF;
  IF NEW.items_total < 0 OR NEW.items_total > 10000 THEN
    RAISE EXCEPTION 'Invalid items_total';
  END IF;
  IF NEW.total < 0 OR NEW.total > 10000 THEN
    RAISE EXCEPTION 'Invalid total';
  END IF;

  -- Force initial status to 'LAUKIA_PATVIRTINIMO' on insert
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'LAUKIA_PATVIRTINIMO';
  END IF;

  RETURN NEW;
END;
$$;
 
-- Allow anyone to view order by its ID (unguessable UUID)
CREATE POLICY "Anyone can view order by ID"
  ON public.orders
  FOR SELECT
  TO anon, authenticated
  USING (true);
