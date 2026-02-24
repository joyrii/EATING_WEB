'use client';

import { supabase } from '@/lib/supabase/client';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 요청 인터셉터: 모든 요청에 대해 토큰 자동 첨부
api.interceptors.request.use(async (config) => {
  let session = (await supabase.auth.getSession()).data.session;

  // session이 없으면 refresh 시도
  if (!session) {
    const { data } = await supabase.auth.refreshSession();
    session = data.session;
  }

  const token = session?.access_token;

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

      const { data, error: refreshError } =
        await supabase.auth.refreshSession();

      const token =
        data?.session?.access_token ??
        (await supabase.auth.getSession()).data.session?.access_token;

      if (!refreshError && token) {
        console.log('[auth] token refreshed: ', token);

        if (!original.headers) original.headers = {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
