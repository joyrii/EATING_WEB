import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import parseStudentIdText from '@/lib/ocr/parseStudentId';
import parseAdmissionCertificateText from '@/lib/ocr/parseAdmissionCertificate';

const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { image, type } = await req.json();

    if (!image || !type) {
      return NextResponse.json(
        { error: 'Missing image or type' },
        { status: 400 },
      );
    }

    // Call Google Cloud Vision API
    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    const visionRes = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: image },
            features: [{ type: 'TEXT_DETECTION' }],
            imageContext: { languageHints: ['ko', 'en'] },
          },
        ],
      }),
    });

    if (!visionRes.ok) {
      const errText = await visionRes.text();
      console.error('[Vision API] error:', errText);
      return NextResponse.json({ error: 'OCR failed' }, { status: 502 });
    }

    const visionData = await visionRes.json();
    const rawText =
      visionData.responses?.[0]?.fullTextAnnotation?.text ?? '';

    // Parse based on type
    let studentId = '';
    let department = '';

    if (type === 'enrolled') {
      const parsed = parseStudentIdText(rawText);
      studentId = parsed.studentId ?? '';
      department = parsed.department ?? '';
    } else {
      const parsed = parseAdmissionCertificateText(rawText);
      department = parsed?.department ?? '';
    }

    // Upload image to Supabase Storage (server-side)
    let imagePath: string | null = null;
    let imageUrl: string | null = null;

    const userId = session.user.id;
    const fileName = `${userId}_${Date.now()}.jpg`;
    const storagePath = `verification/${fileName}`;
    const buffer = Buffer.from(image, 'base64');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (!uploadError && uploadData) {
      imagePath = uploadData.path;
      const { data: pub } = supabase.storage
        .from('images')
        .getPublicUrl(uploadData.path);
      imageUrl = pub.publicUrl;
    } else if (uploadError) {
      console.warn('[upload] failed:', uploadError);
    }

    return NextResponse.json({
      studentId,
      department,
      raw: rawText.slice(0, 2000),
      imagePath,
      imageUrl,
    });
  } catch (error) {
    console.error('[api/verification/ocr] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
