'use client';

import styled from 'styled-components';
import { StepText, SubText, TextWrapper, TitleText } from '../style';
import Button from '@/components/BaseButton';
import { useRouter } from 'next/navigation';
import InterestsOption from '@/components/onboarding/InterestsChip';
import {
  INTERESTS_SECTION,
  INTERESTS_GROUPS,
} from '@/constants/INTERESTS_SECTION';
import { useState } from 'react';

export default function OnboardingInterests() {
  const router = useRouter();

  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const toggle = (key: string, option: string) => {
    setSelected((prev) => {
      const cur = prev[key] || [];
      const next = cur.includes(option)
        ? cur.filter((x) => x !== option)
        : [...cur, option];
      return { ...prev, [key]: next };
    });
  };

  return (
    <div>
      <TextWrapper>
        <StepText>02</StepText>
        <TitleText>주연님의 관심사를 선택해주세요.</TitleText>
        <SubText>매칭을 위해 부가적으로 사용됩니다.</SubText>
      </TextWrapper>
      <InterestsContent>
        {INTERESTS_GROUPS.map((group) => (
          <InterestsWrapperLarge key={group.sectionTitle}>
            <InterestsMainTitle>{group.sectionTitle}</InterestsMainTitle>
            {group.items.map((index) => {
              const sub = INTERESTS_SECTION[index];
              const key = sub.title ?? group.sectionTitle;
              const picked = selected[key] ?? [];

              const optionList = (
                <InterestsOptionWrapper>
                  {sub.options.map((option) => (
                    <InterestsOption
                      key={option}
                      label={option}
                      width={option === '방문학생/교환학생' ? '110px' : '75px'}
                      $selected={picked.includes(option)}
                      onClick={() => toggle(key, option)}
                    />
                  ))}
                </InterestsOptionWrapper>
              );
              return group.sectionTitle === '대학생활' ? (
                <div key={sub.title}>{optionList}</div>
              ) : (
                <InterestsWrapper key={sub.title}>
                  <InterestsSubTitle>{sub.title}</InterestsSubTitle>
                  {optionList}
                </InterestsWrapper>
              );
            })}
          </InterestsWrapperLarge>
        ))}
      </InterestsContent>
      <ButtonWrapper>
        <Button
          disabled={Object.values(selected).flat().length === 0}
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
