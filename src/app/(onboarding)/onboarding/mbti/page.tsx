'use client';

import styled from 'styled-components';
import Button from '@/components/BaseButton';
import { StepText, SubText, TextWrapper, TitleText } from '../style';
import { ButtonWrapper } from '../style';
import MbtiOption from '@/components/onboarding/MbtiOption';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingMbti() {
  const router = useRouter();

  const [selectedMbti1, setSelectedMbti1] = useState<string | null>(null);
  const [selectedMbti2, setSelectedMbti2] = useState<string | null>(null);
  const [selectedMbti3, setSelectedMbti3] = useState<string | null>(null);
  const [selectedMbti4, setSelectedMbti4] = useState<string | null>(null);

  return (
    <div>
      <TextWrapper>
        <StepText>01</StepText>
        <TitleText>주연님의 MBTI를 알려주세요.</TitleText>
        <SubText>매칭을 위해 부가적으로 사용됩니다.</SubText>
      </TextWrapper>
      <MbtiOptionWrapper>
        <MbtiOptionColumn>
          <MbtiOption
            label="E"
            selected={selectedMbti1 === 'E'}
            onClick={() => setSelectedMbti1('E')}
          />
          <MbtiOption
            label="I"
            selected={selectedMbti1 === 'I'}
            onClick={() => setSelectedMbti1('I')}
          />
        </MbtiOptionColumn>
        <MbtiOptionColumn>
          <MbtiOption
            label="S"
            selected={selectedMbti2 === 'S'}
            onClick={() => setSelectedMbti2('S')}
          />
          <MbtiOption
            label="N"
            selected={selectedMbti2 === 'N'}
            onClick={() => setSelectedMbti2('N')}
          />
        </MbtiOptionColumn>
        <MbtiOptionColumn>
          <MbtiOption
            label="T"
            selected={selectedMbti3 === 'T'}
            onClick={() => setSelectedMbti3('T')}
          />
          <MbtiOption
            label="F"
            selected={selectedMbti3 === 'F'}
            onClick={() => setSelectedMbti3('F')}
          />
        </MbtiOptionColumn>
        <MbtiOptionColumn>
          <MbtiOption
            label="J"
            selected={selectedMbti4 === 'J'}
            onClick={() => setSelectedMbti4('J')}
          />
          <MbtiOption
            label="P"
            selected={selectedMbti4 === 'P'}
            onClick={() => setSelectedMbti4('P')}
          />
        </MbtiOptionColumn>
      </MbtiOptionWrapper>
      <ButtonWrapper>
        <Button
          disabled={
            !selectedMbti1 || !selectedMbti2 || !selectedMbti3 || !selectedMbti4
          }
          label="다음"
          onClick={() => {
            router.push('/onboarding/interests');
          }}
        />
      </ButtonWrapper>
    </div>
  );
}

const MbtiOptionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const MbtiOptionWrapper = styled.div`
  margin-top: 113px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
`;
