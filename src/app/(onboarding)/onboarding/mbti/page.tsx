'use client';

import Button from '@/components/BaseButton';
import {
  OptionColumn,
  OptionWrapper,
  StepText,
  SubText,
  TextWrapper,
  TitleText,
} from '../style';
import { ButtonWrapper } from '../style';
import MbtiOption from '@/components/onboarding/mbti';
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
      <OptionWrapper>
        <OptionColumn>
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
        </OptionColumn>
        <OptionColumn>
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
        </OptionColumn>
        <OptionColumn>
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
        </OptionColumn>
        <OptionColumn>
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
        </OptionColumn>
      </OptionWrapper>
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
