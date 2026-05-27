-- Replace the broad public SELECT policy with one that requires knowing the file path
DROP POLICY IF EXISTS "Menu images are publicly viewable" ON storage.objects;

-- Files are still served publicly (CDN URLs work) because bucket is public,
-- but RLS prevents listing all objects. Only admins can list.
CREATE POLICY "Admins can list menu images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));