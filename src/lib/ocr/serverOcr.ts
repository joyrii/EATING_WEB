export type OcrResult = {
  studentId: string;
  department: string;
  raw: string;
  imagePath: string | null;
  imageUrl: string | null;
};

export async function serverOcr(
  file: File | Blob,
  type: 'enrolled' | 'freshman',
): Promise<OcrResult> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const res = await fetch('/api/verification/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, type }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `OCR request failed: HTTP ${res.status}`);
  }

  return res.json();
}
