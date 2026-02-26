import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import NoshowStore from './NoshowStore';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NoshowStore />
    </Suspense>
  );
}
