UPDATE public.menu_items
SET image_url = 'https://ehazxdicxzgdlyztyphm.supabase.co/storage/v1/object/public/menu-images/sauces/sauce-default.png'
WHERE category_id IN (
  SELECT id FROM public.menu_categories
  WHERE slug ILIKE '%padaz%' OR name ILIKE '%padaz%' OR slug ILIKE '%sauce%' OR name ILIKE '%sauce%'
);