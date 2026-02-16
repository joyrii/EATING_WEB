import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/terms';

  console.log('--- Auth Callback Start ---');
  console.log('Code:', code);

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('code_missing_from_url')}`,
    );
  }

  // 1) code -> session 교환
  const supabase = await createServerSupabaseClient();
  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('Supabase Exchange Error:', exchangeError);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('exchange:' + exchangeError.message)}`,
    );
  }

  if (!data?.session) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('no_session_data')}`,
    );
  }

  const jwtToken = data.session.access_token;

  // 2) 백엔드 호출
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log('API URL:', apiUrl);

  if (!apiUrl) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('API_URL is missing')}`,
    );
  }

  try {
    const res = await axios.post(
      `${apiUrl}/auth/callback`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        timeout: 10000,
      },
    );
    // 성공
    console.log('Backend API Response:', res.data);
    return NextResponse.redirect(`${origin}${next}`);
  } catch (e: any) {
    console.error('Backend API Error raw:', {
      message: e?.message,
      code: e?.code,
      status: e?.response?.status,
      data: e?.response?.data,
      configUrl: e?.config?.url,
    });

    const apiMsg =
      e?.response?.data?.message ??
      (typeof e?.response?.data === 'string' ? e.response.data : null) ??
      e?.message ??
      'unknown_backend_error';

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('backend:' + apiMsg)}`,
    );
  }
}
