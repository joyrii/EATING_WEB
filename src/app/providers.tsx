'use client';

import SendbirdBootstrap from '@/components/chat/SendbirdBootstrap';
import { UserProvider, useUser } from '@/context/userContext';
import { disconnectSendbird } from '@/lib/sendbird/client';
import { useEffect } from 'react';

function SendbirdGate() {
  const { me, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !me?.id) {
      disconnectSendbird().catch(() => {});
    }
  }, [isLoaded, me?.id]);

  if (!isLoaded || !me?.id) return null;
  return <SendbirdBootstrap userId={me.id} nickname={me.name} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SendbirdGate />
      {children}
    </UserProvider>
  );
}
