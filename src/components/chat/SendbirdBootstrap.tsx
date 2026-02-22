import { useEffect } from 'react';
import { connectSendbird } from '@/lib/sendbird/client';

export default function SendbirdBootstrap({
  userId,
  nickname,
  profileUrl,
}: {
  userId: string;
  nickname?: string;
  profileUrl?: string;
}) {
  useEffect(() => {
    if (!userId) return;
    connectSendbird(userId, nickname, profileUrl).catch((error) => {
      console.error('Failed to connect Sendbird:', error);
    });
  }, [userId, nickname, profileUrl]);

  return null;
}
