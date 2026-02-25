export async function downscaleImage(
  file: File,
  maxWidth = 1000,
  quality = 0.82,
): Promise<File> {
  const img = document.createElement('img');
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;

  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = rej;
  });

  URL.revokeObjectURL(objectUrl);

  const scale = Math.min(1, maxWidth / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality),
  );

  return new File([blob], 'verification.jpg', { type: 'image/jpeg' });
}
