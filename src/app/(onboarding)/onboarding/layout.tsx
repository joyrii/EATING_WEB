'use client';

import { usePathname } from 'next/navigation';
import { MainContainer, Segment, StepIndicator } from './style';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const step: Record<string, number> = {
    '/onboarding/mbti': 1,
    '/onboarding/interests': 2,
    '/onboarding/test': 3,
  };

  const pathname = usePathname();

  return (
    // Step Indicator
    <MainContainer>
      <StepIndicator>
        <Segment active={step[pathname] === 1} />
        <Segment active={step[pathname] === 2} />
        <Segment active={step[pathname] === 3} />
      </StepIndicator>
      {children}
    </MainContainer>
  );
}
