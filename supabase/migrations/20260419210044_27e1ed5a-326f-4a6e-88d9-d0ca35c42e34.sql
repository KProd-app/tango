-- Add translation fields for menu categories and items
ALTER TABLE public.menu_categories
ADD COLUMN IF NOT EXISTS name_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.menu_items
ADD COLUMN IF NOT EXISTS name_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS description_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.menu_categories.name_translations IS 'Translations: {"en": "...", "fr": "...", "pl": "...", "ru": "...", "es": "..."}. Lithuanian stays in name column.';
COMMENT ON COLUMN public.menu_items.name_translations IS 'Translations: {"en": "...", "fr": "...", "pl": "...", "ru": "...", "es": "..."}. Lithuanian stays in name column.';
COMMENT ON COLUMN public.menu_items.description_translations IS 'Translations: {"en": "...", "fr": "...", "pl": "...", "ru": "...", "es": "..."}. Lithuanian stays in description column.';