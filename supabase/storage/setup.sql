-- Create storage buckets for media files

-- Create audio bucket for exercise audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);

-- Create images bucket for flashcard images and other visual content
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies for audio bucket
CREATE POLICY "Anyone can view audio files" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Authenticated users can upload audio files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update audio files" ON storage.objects FOR UPDATE USING (bucket_id = 'audio' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete audio files" ON storage.objects FOR DELETE USING (bucket_id = 'audio' AND auth.role() = 'authenticated');

-- Create storage policies for images bucket
CREATE POLICY "Anyone can view image files" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload image files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update image files" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete image files" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
