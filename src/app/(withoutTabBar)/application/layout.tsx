'use client';

import { usePathname } from 'next/navigation';
import styled from 'styled-components';

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
          <BackButton onClick={() => history.back()}>
            <img src="/svgs/back.svg" alt="back" />
          </BackButton>
          <Segment $active={step[pathname] === 1} />
          <Segment $active={step[pathname] === 2} />
          <Segment $active={step[pathname] === 3} />
        </StepIndicator>
      </IndicatorWrapper>
      <div style={{ marginTop: 10 }}>{children}</div>
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
  left: 20px;
  right: 28px;
  z-index: 10;
  padding-top: 35px;
  padding-bottom: 30px;
  background-color: #fafafa;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  margin-right: 30px;
`;

const StepIndicator = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const Segment = styled.div<{ $active?: boolean }>`
  width: 30%;
  height: 5px;
  background-color: ${(props) => (props.$active ? '#707070' : '#f0f0f0')};
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease;
`;
