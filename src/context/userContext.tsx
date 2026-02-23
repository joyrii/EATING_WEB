'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/api/axios-client';
import { supabase } from '@/lib/supabase/client';

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
  const [me, setMe] = useState<Me | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setMe(null);
        localStorage.removeItem('me');
        return;
      }

      const { data } = await api.get('/users/me');

      const normalized = normalizeMe(data as Me);
      setMe(normalized);
      localStorage.setItem('me', JSON.stringify(normalized));
    } catch (e) {
      console.error('[UserProvider.refresh] failed:', e);
      // refresh 실패해도 앱 멈추지 않게 둠
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) 캐시 먼저 반영(빠른 페인트)
        const cached = localStorage.getItem('me');
        if (cached && !cancelled) {
          const parsed = JSON.parse(cached);
          setMe(normalizeMe(parsed));
        }

        // 2) 그리고 서버에서 최신 me로 반드시 갱신
        await refresh();
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
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
