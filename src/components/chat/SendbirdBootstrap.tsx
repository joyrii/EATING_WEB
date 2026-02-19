import { useEffect } from 'react';
import { connectSendbird } from '@/lib/sendbird/client';

export default function SendbirdBootstrap({
  userId,
  nickname,
}: {
  userId: string;
  nickname?: string;
}) {
  useEffect(() => {
    if (!userId) return;
    connectSendbird(userId, nickname).catch((error) => {
      console.error('Failed to connect Sendbird:', error);
    });
  }, [userId, nickname]);

  return null;
}
