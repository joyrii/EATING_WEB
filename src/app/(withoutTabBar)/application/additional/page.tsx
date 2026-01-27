'use client';

import {
  TextWrapper,
  StepText,
  TitleText,
} from '@/app/(onboarding)/onboarding/style';
import Button from '@/components/BaseButton';
import {
  ButtonWrapper,
  ClassWrapper,
  ContentWrapper,
  InputWrapper,
  Label,
  TextInput,
} from '../style';
import ClassChip from '@/components/application/ClassChip';
import { useState } from 'react';

export default function additional() {
  const CLASS = ['26학번', '25학번', '24학번', '23학번', '22학번 이상'];
  const [selectedClass, setSelectedClass] = useState<string[]>([]);

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
          <TextInput type="text" placeholder="입력해주세요." />
        </InputWrapper>
      </ContentWrapper>
      <ButtonWrapper style={{ paddingTop: '5px' }}>
        <Button label="신청 완료" />
      </ButtonWrapper>
    </div>
  );
}
