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
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        paddingTop: 40,
        display: 'grid',
        gap: 16,
      }}
    >
      <StepIndicator step={step} totalSteps={totalSteps} />

      <div>{children}</div>

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
    </div>
  );
}

const ButtonWrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 43px;
  padding: 0 24px;
`;
