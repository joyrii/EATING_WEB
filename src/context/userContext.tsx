'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/api/axios-client';

type Me = { name?: string; onboarding_step?: string };

const UserContext = createContext<{
  me: Me | null;
  isLoaded: boolean;
  refresh: () => Promise<void>;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // ✅ SSR/CSR 첫 렌더 동일: 항상 null로 시작
  const [me, setMe] = useState<Me | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = async () => {
    const { data } = await api.get('/users/me');
    setMe(data);
    // ✅ 캐시는 여기서(렌더 후)
    localStorage.setItem('me', JSON.stringify(data));
  };

  useEffect(() => {
    (async () => {
      try {
        // ✅ 캐시는 effect에서 읽기(하이드레이션 이후)
        const cached = localStorage.getItem('me');
        if (cached) setMe(JSON.parse(cached));

        await refresh();
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoaded(true);
      }
    })();
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
