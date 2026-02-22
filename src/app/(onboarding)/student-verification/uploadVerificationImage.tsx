import { supabase } from '@/lib/supabase/client';

function extFromFile(file: File) {
  const m = file.type.match(/image\/(png|jpeg|jpg|webp)/);
  if (!m) return 'jpg';
  return m[1] === 'jpeg' ? 'jpg' : m[1];
}

export async function uploadVerificationImage({
  file,
  userId,
}: {
  file: File;
  userId: string;
}) {
  const ext = extFromFile(file);
  const fileName = `${userId}_${Date.now()}.${ext}`;
  const path = `verification/${fileName}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.log('upload error:', error);
    throw error;
  }

  const { data: pub } = supabase.storage.from('images').getPublicUrl(data.path);

  return { path: data.path, imageUrl: pub.publicUrl };
}
