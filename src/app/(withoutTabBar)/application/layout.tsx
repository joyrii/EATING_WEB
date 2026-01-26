'use client';

import { usePathname } from 'next/navigation';
import {
  IndicatorWrapper,
  MainContainer,
  Segment,
  StepIndicator,
} from '@/app/(onboarding)/onboarding/style';

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const step: Record<string, number> = {
    '/application/schedule': 1,
    '/application/dining': 2,
    '/application/additional': 3,
  };

  const pathname = usePathname();

  return (
    // Step Indicator
    <MainContainer>
      <IndicatorWrapper>
        <StepIndicator>
          <Segment $active={step[pathname] === 1} />
          <Segment $active={step[pathname] === 2} />
          <Segment $active={step[pathname] === 3} />
        </StepIndicator>
      </IndicatorWrapper>
      <div style={{ marginTop: 10 }}>{children}</div>
    </MainContainer>
  );
}
