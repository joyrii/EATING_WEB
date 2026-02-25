'use client';

import { supabase } from '@/lib/supabase/client';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});

// Supabase 호출에 timeout을 걸어 인앱 브라우저에서 hang 방지
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Session fetch timeout')), ms),
    ),
  ]);
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

// Supabase 세션 변경 시 캐시 업데이트
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token) {
    cachedToken = session.access_token;
    tokenExpiresAt = (session.expires_at ?? 0) * 1000;
  } else {
    cachedToken = null;
    tokenExpiresAt = 0;
  }
});

async function getAccessToken(): Promise<string | null> {
  // 캐시된 토큰이 아직 유효하면 바로 반환 (네트워크 호출 없음)
  if (cachedToken && Date.now() < tokenExpiresAt - 30000) {
    return cachedToken;
  }

  try {
    const { data } = await withTimeout(supabase.auth.getSession(), 10000);
    if (data.session?.access_token) {
      cachedToken = data.session.access_token;
      tokenExpiresAt = (data.session.expires_at ?? 0) * 1000;
      return cachedToken;
    }
  } catch (e) {
    console.warn('[auth] getSession failed:', e);
  }

  return cachedToken;
}

// 요청 인터셉터: 모든 요청에 대해 토큰 자동 첨부
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터: 401 Unauthorized 발생 시 토큰 갱신 시도
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;

      const token = await getAccessToken();

      if (token) {
        console.log('[auth] token refreshed');
        if (!original.headers) original.headers = {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
