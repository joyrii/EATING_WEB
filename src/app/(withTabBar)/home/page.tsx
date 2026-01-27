'use client';

import GuideSection from '@/components/home/GuideSection';
import MathchingListSection from '@/components/home/MatchingListSection';
import { useMatching } from './context';

export default function Home() {
  const { currentStatus } = useMatching();

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
