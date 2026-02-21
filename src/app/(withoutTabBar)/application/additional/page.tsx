'use client';

import styled from 'styled-components';
import { TitleText } from '@/app/(onboarding)/onboarding/style';
import { SkipButton, SkipButtonWrapper } from '../style';
import { ButtonWrapper, TextWrapper } from '../style';
import Button from '@/components/BaseButton';
import ClassChip from '@/components/application/ClassChip';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MbtiOption from '@/components/onboarding/MbtiOption';
import { useMatchingDraftByWeek } from '@/context/matchingDraft';
import { applyMatching } from '@/api/application';

export default function Additional() {
  const router = useRouter();

  const CLASS = ['26', '25', '24', '23', '22'];
  const [selectedClass, setSelectedClass] = useState<string[]>([]);
  const [selectedMbti1, setSelectedMbti1] = useState<string>('');
  const [selectedMbti2, setSelectedMbti2] = useState<string>('');
  const [selectedMbti3, setSelectedMbti3] = useState<string>('');
  const [selectedMbti4, setSelectedMbti4] = useState<string>('');
  const [selectedMbti, setSelectedMbti] = useState<string>('');

  const getDraft = useMatchingDraftByWeek((s) => s.getDraft);

  const setPreferredClassYears = useMatchingDraftByWeek(
    (s) => s.setPreferredYears,
  );
  const setExcludedMbti = useMatchingDraftByWeek((s) => s.setExcludedMbti);

  const submit = async (selectedClass: string[], selectedMbti: string) => {
    setSelectedMbti(
      `${selectedMbti1}${selectedMbti2}${selectedMbti3}${selectedMbti4}`,
    );
    try {
      setPreferredClassYears(selectedClass);
      setExcludedMbti(selectedMbti);

      const draft = getDraft();
      const payload = {
        available_slots: draft.available_slots,
        excluded_restaurant_ids: draft.excluded_restaurant_ids,
        preferred_years: draft.preferred_years ?? [],
        excluded_mbti: draft.excluded_mbti ?? '',
      };

      console.log('매칭 신청 payload:', payload);

      await applyMatching(payload);
    } catch (e) {
      const status = e?.response?.status;

      if (status === 400) alert('현재 매칭 신청 기간이 아닙니다.');
      else if (status === 403) alert('사전신청자 전용 기간입니다.');
      else if (status === 409) alert('이미 모든 라운드에 신청하셨습니다.');
      else alert('매칭 신청에 실패했습니다.');
    }
    router.push('/home');
  };

  return (
    <div>
      <SkipButtonWrapper>
        <SkipButton onClick={() => router.push('/home')}>
          <span>건너뛰기</span>
        </SkipButton>
      </SkipButtonWrapper>
      <ContentWrapper>
        <TextWrapper>
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
                  console.log('선택된 학번:', selectedClass);
                }}
              />
            ))}
          </ClassWrapper>
        </InputWrapper>
        <InputWrapper>
          <Label>02 만나고 싶지 않은 MBTI는?</Label>
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
        </InputWrapper>
      </ContentWrapper>
      <ButtonWrapper style={{ paddingTop: '5px' }}>
        <Button
          label="신청 완료"
          onClick={() => {
            submit(selectedClass, selectedMbti);
          }}
        />
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

const MbtiOptionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const MbtiOptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 25px;
  margin-left: 25px;
`;
