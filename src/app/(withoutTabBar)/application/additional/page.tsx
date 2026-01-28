'use client';

import styled from 'styled-components';
import {
  TextWrapper,
  StepText,
  TitleText,
} from '@/app/(onboarding)/onboarding/style';
import { ButtonWrapper } from '../style';
import Button from '@/components/BaseButton';
import ClassChip from '@/components/application/ClassChip';
import { useState } from 'react';

export default function additional() {
  const CLASS = ['26학번', '25학번', '24학번', '23학번', '22학번 이상'];
  const [selectedClass, setSelectedClass] = useState<string[]>([]);
  const [excludedMbti, setExcludedMbti] = useState<string>('');

  return (
    <div>
      <ContentWrapper>
        <TextWrapper>
          <StepText>03</StepText>
          <TitleText>
            최적의 매칭을 위한
            <br />
            추가정보를 알려주세요.
          </TitleText>
        </TextWrapper>
        <InputWrapper>
          <Label>01 만나고 싶은 학번은?</Label>
          <ClassWrapper>
            {CLASS.map((classYear) => (
              <ClassChip
                key={classYear}
                label={classYear}
                checked={selectedClass.includes(classYear)}
                onClick={() => {
                  if (selectedClass.includes(classYear)) {
                    setSelectedClass(
                      selectedClass.filter((item) => item !== classYear),
                    );
                  } else {
                    setSelectedClass([...selectedClass, classYear]);
                  }
                }}
              />
            ))}
          </ClassWrapper>
        </InputWrapper>
        <InputWrapper>
          <Label>02 만나고 싶지 않은 MBTI는?</Label>
          <TextInput
            type="text"
            placeholder="입력해주세요."
            value={excludedMbti}
            onChange={(e) => setExcludedMbti(e.target.value)}
          />
        </InputWrapper>
      </ContentWrapper>
      <ButtonWrapper style={{ paddingTop: '5px' }}>
        <Button label="신청 완료" />
      </ButtonWrapper>
    </div>
  );
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 45px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
  color: #232323;
`;

const ClassWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  text-align: center;
`;

const TextInput = styled.input`
  width: 100%;
  height: 68px;
  border: 1px solid #d6d6d6;
  border-radius: 15px;
  padding: 23px 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
  color: #000000;

  &::placeholder {
    color: #bdbdbd;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 100px;
`;
