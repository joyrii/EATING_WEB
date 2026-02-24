'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/api/axios-client';
import { supabase } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  const [me, setMe] = useState<Me | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 로그인 없이 접근 가능
  const publicPaths = useMemo(() => new Set(['/login']), []);

  const redirectToLoginIfNeeded = (path?: string | null) => {
    const p = path ?? pathname;
    if (!p || !publicPaths.has(p)) {
      router.replace('/login');
    }
  };

  const clearMeCache = () => {
    setMe(null);
    localStorage.removeItem('me');
  };

  const refresh = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        clearMeCache();
        redirectToLoginIfNeeded();
        return;
      }

      const { data } = await api.get('/users/me');

      const normalized = normalizeMe(data as Me);
      setMe(normalized);
      localStorage.setItem('me', JSON.stringify(normalized));
    } catch (e) {
      console.error('[UserProvider.refresh] failed:', e);
      // refresh 실패해도 앱 멈추지 않게 둠
      clearMeCache();
      redirectToLoginIfNeeded();
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem('me');
    if (cached) {
      setMe(normalizeMe(JSON.parse(cached)));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (pathname !== '/login') {
          await refresh();
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // 세션 변화 감지
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.access_token) {
        clearMeCache();
        redirectToLoginIfNeeded();
        return;
      }
      // 세션이 생기거나 갱신되면 me를 다시 동기화
      await refresh();
    });

    return () => subscription.unsubscribe();
    // pathname 바뀔 때 public path 판단이 달라질 수 있으니 넣어줌
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
