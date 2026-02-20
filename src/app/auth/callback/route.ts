import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const stepToPath = (step?: string | null) => {
    switch (step) {
      case 'terms':
        return '/terms';
      case 'verification':
        return '/student-verification';
      case 'mbti':
      case 'completed':
        return '/home';
      default:
        return '/terms';
    }
  };

  const isSafeInternalPath = (path: string) => {
    // 내부 경로만 허용
    return path.startsWith('/') && !path.startsWith('//');
  };

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  const redirectParam = searchParams.get('redirect');
  const nextParam = searchParams.get('next');
  const requestedRedirect =
    (redirectParam && isSafeInternalPath(redirectParam)
      ? redirectParam
      : null) ??
    (nextParam && isSafeInternalPath(nextParam) ? nextParam : null) ??
    null;

  console.log('--- Auth Callback Start ---');
  console.log('Code:', code);
  console.log('redirect Param:', requestedRedirect);
  console.log('next param:', nextParam);

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
  console.log('JWT Token obtained from Supabase:', jwtToken);

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
    console.log('Backend API Response:', res.data);

    // 3) 다음 페이지로 리다이렉트
    const myInfo = await axios.get(`${apiUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      timeout: 10000,
    });

    const onboardingStep = myInfo.data?.onboarding_step;
    console.log('User Onboarding Step:', onboardingStep);

    const redirectPath = stepToPath(onboardingStep);

    const isOnboardingDone = onboardingStep === 'completed';

    if (isOnboardingDone && requestedRedirect) {
      return NextResponse.redirect(`${origin}${requestedRedirect}`);
    }

    console.log('requestedRedirect:', requestedRedirect);
    console.log('myInfo.data:', myInfo.data);
    console.log('onboardingStep(raw):', myInfo.data?.onboarding_step);
    console.log('redirectPath(from stepToPath):', redirectPath);

    return NextResponse.redirect(`${origin}${redirectPath}`);
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
