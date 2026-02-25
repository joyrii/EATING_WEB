'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/api/axios-client';
import { supabase } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';

type Me = {
  id: string;
  name?: string;
  onboarding_step?: string;
  is_pre_registered?: boolean;
  is_admin?: boolean;
  profile_image_url?: string;
};

const UserContext = createContext<{
  me: Me | null;
  isLoaded: boolean;
  refresh: () => Promise<void>;
} | null>(null);

const DEFAULT_PROFILE_IMAGE_URL = '/images/chat/profile-default-3.png';

function normalizeMe(data: Me | null): Me | null {
  if (!data) return null;

  return {
    ...data,
    profile_image_url:
      data.profile_image_url && data.profile_image_url.trim() !== ''
        ? data.profile_image_url
        : DEFAULT_PROFILE_IMAGE_URL,

    is_admin: data.is_admin ?? false,
    is_pre_registered: data.is_pre_registered ?? false,
    onboarding_step: data.onboarding_step ?? undefined,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [me, setMe] = useState<Me | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = async () => {
    try {
      const { data } = await api.get('/users/me');
      setMe(normalizeMe(data as Me));
    } catch (e) {
      console.error('[UserProvider.refresh] failed:', e);
      setMe(null);
    }
  };

  // 앱 시작 시 1회만 호출
  useEffect(() => {
    if (pathname === '/login') {
      setIsLoaded(true);
      return;
    }
    (async () => {
      try {
        await refresh();
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // 세션 변화 감지 (SIGNED_IN/SIGNED_OUT만 반응, TOKEN_REFRESHED는 무시)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setMe(null);
        return;
      }
      if (event === 'SIGNED_IN' && session?.access_token) {
        await refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ me, isLoaded, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
