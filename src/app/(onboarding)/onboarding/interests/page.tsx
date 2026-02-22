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
import { useUser } from '@/context/userContext';
import { useEffect } from 'react';
import { getInterests, updateInterests } from '@/api/onboarding';

type InterestItem = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
};

export default function OnboardingInterests() {
  const router = useRouter();

  const { me } = useUser();
  const name = me?.name || '';

  const [optionsByKey, setOptionsByKey] = useState<Record<string, string[]>>(
    {},
  );
  const [idByName, setIdByName] = useState<Record<string, string>>({});

  const [selected, setSelected] = useState<Record<string, string[]>>({});

  useEffect(() => {
    (async () => {
      try {
        const data: InterestItem[] = await getInterests();

        const nextOptions: Record<string, string[]> = {};
        const nextIdByName: Record<string, string> = {};

        for (const item of data) {
          nextIdByName[item.name] = item.id;

          const key = item.subcategory ?? item.category;

          if (!nextOptions[key]) {
            nextOptions[key] = [];
          }
          nextOptions[key].push(item.name);
        }
        setOptionsByKey(nextOptions);
        setIdByName(nextIdByName);
      } catch (error) {
        console.error('Failed to load interests:', error);
      }
    })();
  }, []);

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
        <TitleText>{name}님의 관심사를 선택해주세요.</TitleText>
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
                  {optionsByKey[key]?.flatMap((option, i) => {
                    const nodes = [
                      <InterestsOption
                        key={`opt-${key}-${option}-${i}`}
                        label={option}
                        $selected={picked.includes(option)}
                        onClick={() => toggle(key, option)}
                      />,
                    ];

                    if ((i + 1) % 4 === 0) {
                      nodes.push(<Break key={`br-${key}-${i}`} />);
                    }

                    return nodes;
                  })}
                </InterestsOptionWrapper>
              );
              return group.sectionTitle === '대학생활' ? (
                <div key={`section-${group.sectionTitle}`}>{optionList}</div>
              ) : (
                <InterestsWrapper
                  key={`section-${group.sectionTitle}-${sub.title}`}
                >
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
          onClick={async () => {
            try {
              const selectedNames = Object.values(selected).flat();
              const interestIds = Array.from(
                new Set(
                  selectedNames.map((name) => idByName[name]).filter(Boolean),
                ),
              );
              await updateInterests(interestIds);
              router.push('/application/schedule');
            } catch (error) {
              console.error('Failed to update interests:', error);
            }
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

  max-height: calc(100vh - 300px);
  position: relative;
  overflow-y: auto;
  padding-right: 10px;

  &::after {
    content: '';
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 180px;
    pointer-events: none;
    z-index: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(250, 250, 250, 1)
    );
  }

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
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

const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;
