import { Suspense } from 'react';
import FeedbackClient from './FeedbackClient';

export const dynamic = 'force-dynamic';

export default function FeedbackPage() {
  return (
    <Suspense fallback={null}>
      <FeedbackClient />
    </Suspense>
  );
}
