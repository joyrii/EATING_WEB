'use client';

import GuideSection from '@/components/home/GuideSection';
import MathchingListSection from '@/components/home/MatchingListSection';
import { useMatching } from './context';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Home() {
  const { currentStatus } = useMatching();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('🔥 CURRENT TOKEN:', session?.access_token);
    })();
  }, []);

  return (
    <>
      {currentStatus === 'before' || currentStatus === 'inProgress' ? (
        <GuideSection />
      ) : (
        <MathchingListSection />
      )}
    </>
  );
}
