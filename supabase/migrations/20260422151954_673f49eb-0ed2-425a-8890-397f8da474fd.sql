-- Order status enum
CREATE TYPE public.order_status AS ENUM ('new', 'preparing', 'delivering', 'completed', 'cancelled');
CREATE TYPE public.delivery_method AS ENUM ('delivery', 'pickup');
CREATE TYPE public.payment_method AS ENUM ('card_on_site', 'cash');

-- Sequence for human-readable order numbers
CREATE SEQUENCE public.order_number_seq START 1000;

CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number INTEGER NOT NULL DEFAULT nextval('public.order_number_seq') UNIQUE,

  -- Contact
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,

  -- Delivery
  delivery_method public.delivery_method NOT NULL,
  address_street TEXT,
  address_apartment TEXT,
  address_city TEXT,
  address_door_code TEXT,
  address_lat DOUBLE PRECISION,
  address_lng DOUBLE PRECISION,
  distance_km NUMERIC(5,2),
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,

  -- Order details
  needs_utensils BOOLEAN NOT NULL DEFAULT false,
  payment_method public.payment_method NOT NULL,
  items JSONB NOT NULL,
  items_total NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  comment TEXT,

  status public.order_status NOT NULL DEFAULT 'new',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER SEQUENCE public.order_number_seq OWNED BY public.orders.order_number;

-- Indexes
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create an order"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
  ON public.orders
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();