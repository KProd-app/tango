CREATE OR REPLACE FUNCTION public.validate_order()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  item jsonb;
  item_id uuid;
  item_qty numeric;
  item_unit numeric;
  item_size text;
  db_price numeric;
  db_sizes jsonb;
  size_entry jsonb;
  size_price numeric;
  computed_items_total numeric := 0;
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
    NEW.address_street := NULL;
    NEW.address_apartment := NULL;
    NEW.address_city := NULL;
    NEW.address_door_code := NULL;
    NEW.address_lat := NULL;
    NEW.address_lng := NULL;
    NEW.distance_km := NULL;
    NEW.delivery_fee := 0;
  END IF;

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

  -- SECURITY: verify each item's price against menu_items, recompute totals server-side
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    BEGIN
      item_id := (item->>'productId')::uuid;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid productId in items';
    END;

    item_qty := COALESCE((item->>'quantity')::numeric, 0);
    item_unit := COALESCE((item->>'unitPrice')::numeric, -1);
    item_size := item->>'size';

    IF item_qty <= 0 OR item_qty > 100 THEN
      RAISE EXCEPTION 'Invalid item quantity';
    END IF;
    IF item_unit < 0 THEN
      RAISE EXCEPTION 'Invalid item unitPrice';
    END IF;

    SELECT price, sizes INTO db_price, db_sizes
    FROM public.menu_items
    WHERE id = item_id AND is_visible = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Menu item % not found or unavailable', item_id;
    END IF;

    -- Resolve expected price: size-specific if size provided and present in sizes JSON
    size_price := NULL;
    IF item_size IS NOT NULL AND db_sizes IS NOT NULL AND jsonb_typeof(db_sizes) = 'array' THEN
      FOR size_entry IN SELECT * FROM jsonb_array_elements(db_sizes)
      LOOP
        IF (size_entry->>'label') = item_size OR (size_entry->>'name') = item_size THEN
          size_price := COALESCE((size_entry->>'price')::numeric, NULL);
          EXIT;
        END IF;
      END LOOP;
    END IF;

    IF size_price IS NOT NULL THEN
      IF abs(item_unit - size_price) > 0.01 THEN
        RAISE EXCEPTION 'Price mismatch for item %', item_id;
      END IF;
      computed_items_total := computed_items_total + size_price * item_qty;
    ELSE
      IF abs(item_unit - db_price) > 0.01 THEN
        RAISE EXCEPTION 'Price mismatch for item %', item_id;
      END IF;
      computed_items_total := computed_items_total + db_price * item_qty;
    END IF;
  END LOOP;

  IF abs(NEW.items_total - computed_items_total) > 0.05 THEN
    RAISE EXCEPTION 'items_total does not match item prices';
  END IF;

  IF abs(NEW.total - (NEW.items_total + NEW.delivery_fee)) > 0.05 THEN
    RAISE EXCEPTION 'total must equal items_total + delivery_fee';
  END IF;

  -- Force initial status to 'new' on insert
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'new';
  END IF;

  RETURN NEW;
END;
$function$;