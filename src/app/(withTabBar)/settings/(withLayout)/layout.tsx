'use client';

import { useRouter } from 'next/navigation';
import { BackButton, Body, Header, Page } from './style';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Page>
      <Header>
        <BackButton onClick={() => router.back()}>
          <img src="/svgs/back.svg" alt="back" />
        </BackButton>
      </Header>
      <Body>{children}</Body>
    </Page>
  );
}
