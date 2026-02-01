export async function tesseractModule(
  image: string,
  onProgress?: (pct: number) => void,
) {
  const { createWorker } = await import('tesseract.js');

  const worker = await createWorker('kor+eng', 1, {
    workerPath:
      'https://cdn.jsdelivr.net/npm/tesseract.js@7/dist/worker.min.js',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@7/',
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',

    logger: (m) => {
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
    await worker.terminate();
  }
}
