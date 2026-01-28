'use client';

import styled from 'styled-components';
import { usePathname } from 'next/navigation';

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
      <IndicatorWrapper>
        <StepIndicator>
          <Segment $active={step[pathname] === 1} />
          <Segment $active={step[pathname] === 2} />
          <Segment $active={step[pathname] === 3} />
        </StepIndicator>
      </IndicatorWrapper>
      {children}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 35px 23px 45px;
`;

const IndicatorWrapper = styled.div`
  height: 40px;
  position: fixed;
  top: 0;
  left: 24px;
  right: 24px;
  z-index: 10;
  padding-top: 35px;
  padding-bottom: 10px;
  background-color: #fafafa;
`;

const StepIndicator = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const Segment = styled.div<{ $active?: boolean }>`
  width: 33%;
  height: 5px;
  background-color: ${(props) => (props.$active ? '#D6D6D6' : '#f0f0f0')};
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease;
`;
