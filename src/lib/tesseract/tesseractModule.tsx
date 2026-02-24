export async function tesseractModule(
  image: string | File | Blob,
  onProgress?: (pct: number) => void,
) {
  const { createWorker } = await import('tesseract.js');

  const langPath =
    typeof window !== 'undefined'
      ? new URL('/tesseract/lang', window.location.origin).toString()
      : '/tesseract/lang';

  const worker = await createWorker('kor+eng', 1, {
    workerPath: '/tesseract/worker.min.js',
    corePath: '/tesseract/tesseract-core.wasm.js',
    langPath,
    logger: (m: any) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        onProgress?.(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const {
      data: { text },
    } = await worker.recognize(image);
    return (text ?? '').trim();
  } finally {
    worker.terminate().catch(() => {});
  }
}
