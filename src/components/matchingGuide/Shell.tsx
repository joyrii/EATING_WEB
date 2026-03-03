'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/StepDots';
import BaseButton from '../BaseButton';

export default function StepShell({
  step,
  totalSteps,
  children,
}: {
  step: number;
  totalSteps: number;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const go = (nextStep: number) => {
    router.push(`/matching-guide/${nextStep}`);
  };

  return (
    <Background>
      <StepIndicator step={step} totalSteps={totalSteps} />

      <Content>{children}</Content>

      <ButtonWrapper>
        <BaseButton
          label={step >= totalSteps ? '확인' : '다음'}
          onClick={() => {
            if (step >= totalSteps) {
              router.replace('/home');
            } else go(step + 1);
          }}
        />
      </ButtonWrapper>
    </Background>
  );
}

const ButtonWrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 43px;
  padding: 0 24px;
`;

const Background = styled.div`
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  gap: clamp(8px, 2.2vh, 16px);

  padding-top: clamp(16px, 4vh, 40px);

  background: linear-gradient(
    to bottom,
    rgba(255, 255, 246, 0.5),
    rgba(255, 247, 242, 0.5),
    rgba(255, 238, 229, 0.5)
  );
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;

  padding-bottom: calc(43px + 56px);
`;
