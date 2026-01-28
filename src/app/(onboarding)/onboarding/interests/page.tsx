'use client';

import styled from 'styled-components';
import { StepText, SubText, TextWrapper, TitleText } from '../style';
import Button from '@/components/BaseButton';
import { useRouter } from 'next/navigation';
import InterestsOption from '@/components/onboarding/InterestsChip';
import INTERESTS_SECTION from '@/constants/INTERESTS_SECTION';
import { useState } from 'react';

export default function OnboardingInterests() {
  const router = useRouter();

  const [univLife, setUnivLife] = useState<string[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [beauty, setBeauty] = useState<string[]>([]);

  return (
    <div>
      <TextWrapper>
        <StepText>02</StepText>
        <TitleText>주연님의 관심사를 선택해주세요.</TitleText>
        <SubText>매칭을 위해 부가적으로 사용됩니다.</SubText>
      </TextWrapper>
      <InterestsContent>
        <InterestsWrapperLarge>
          <InterestsMainTitle>대학생활</InterestsMainTitle>
          <InterestsOptionWrapper>
            {INTERESTS_SECTION[0].options.map((option, index) => (
              <InterestsOption
                key={index}
                label={option}
                width={option === '방문학생/교환학생' ? '110px' : '75px'}
                $selected={univLife.includes(option)}
                onClick={() => {
                  if (univLife.includes(option)) {
                    setUnivLife(univLife.filter((item) => item !== option));
                  } else {
                    setUnivLife([...univLife, option]);
                  }
                }}
              />
            ))}
          </InterestsOptionWrapper>
        </InterestsWrapperLarge>
        <InterestsWrapperLarge>
          <InterestsMainTitle>취미</InterestsMainTitle>
          <InterestsWrapper>
            <InterestsSubTitle>뮤직</InterestsSubTitle>
            <InterestsOptionWrapper>
              {INTERESTS_SECTION[1].options.map((option, index) => (
                <InterestsOption
                  key={index}
                  label={option}
                  $selected={music.includes(option)}
                  onClick={() => {
                    if (music.includes(option)) {
                      setMusic(music.filter((item) => item !== option));
                    } else {
                      setMusic([...music, option]);
                    }
                  }}
                />
              ))}
            </InterestsOptionWrapper>
          </InterestsWrapper>
          <InterestsWrapper>
            <InterestsSubTitle>뷰티</InterestsSubTitle>
            <InterestsOptionWrapper>
              {INTERESTS_SECTION[2].options.map((option, index) => (
                <InterestsOption
                  key={index}
                  label={option}
                  $selected={beauty.includes(option)}
                  onClick={() => {
                    if (beauty.includes(option)) {
                      setBeauty(beauty.filter((item) => item !== option));
                    } else {
                      setBeauty([...beauty, option]);
                    }
                  }}
                />
              ))}
            </InterestsOptionWrapper>
          </InterestsWrapper>
        </InterestsWrapperLarge>
      </InterestsContent>
      <ButtonWrapper>
        <Button
          disabled={
            univLife.length === 0 && music.length === 0 && beauty.length === 0
          }
          label="다음"
          onClick={() => {
            router.push('/onboarding/test');
          }}
        />
      </ButtonWrapper>
    </div>
  );
}

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 45px;
  left: 23px;
  right: 23px;
`;

const InterestsMainTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
`;

const InterestsSubTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 145%;
  letter-spacing: -0.01em;
`;

const InterestsContent = styled.div`
  margin-top: 46px;
`;

const InterestsWrapperLarge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 45px;
`;

const InterestsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 45px;
`;

const InterestsOptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;
