-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('tour-images', 'tour-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gem-images', 'gem-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true) ON CONFLICT (id) DO NOTHING;

-- RLS for tour-images (public read, admin write)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tour-images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tour-images' AND is_admin());
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'tour-images' AND is_admin());
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'tour-images' AND is_admin());

-- RLS for gem-images (public read, authenticated/admin write)
CREATE POLICY "Public Access Gem Images" ON storage.objects FOR SELECT USING (bucket_id = 'gem-images');
CREATE POLICY "Authenticated Upload Gem Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gem-images' AND auth.role() = 'authenticated');
CREATE POLICY "Owner/Admin Update Gem Images" ON storage.objects FOR UPDATE USING (bucket_id = 'gem-images' AND (auth.uid() = owner OR is_admin()));
CREATE POLICY "Owner/Admin Delete Gem Images" ON storage.objects FOR DELETE USING (bucket_id = 'gem-images' AND (auth.uid() = owner OR is_admin()));

-- RLS for user-avatars (public read, owner write)
CREATE POLICY "Public Access User Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Owner Upload User Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid() = owner);
CREATE POLICY "Owner Update User Avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid() = owner);
CREATE POLICY "Owner Delete User Avatars" ON storage.objects FOR DELETE USING (bucket_id = 'user-avatars' AND auth.uid() = owner);
