'use client';

import styled from 'styled-components';
import {
  StepText,
  SubText,
  TextWrapper,
  TitleText,
} from '@/app/(onboarding)/onboarding/style';
import Button from '@/components/BaseButton';
import InterestsOption from '@/components/onboarding/InterestsChip';
import {
  INTERESTS_SECTION,
  INTERESTS_GROUPS,
} from '@/constants/INTERESTS_SECTION';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/userContext';
import { getInterests, updateInterests } from '@/api/onboarding';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../LoadingSpinner';

type InterestItem = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
};

type Props = {
  stepText?: string;
  titleText?: (name: string) => string;
  subtitleText?: string;
  nextLabel?: string;
  nextRoute: string;
  storageKey?: string;
  successQueryKey?: string;
};

export default function InterestsForm({
  stepText = '02',
  titleText = (name) => `${name}님의 관심사를 선택해주세요.`,
  subtitleText = '매칭을 위해 부가적으로 사용됩니다.',
  nextLabel = '다음',
  nextRoute,
  storageKey = 'onboarding.interests.selected',
  successQueryKey,
}: Props) {
  const router = useRouter();
  const { me } = useUser();
  const name = me?.name || '';

  const [optionsByKey, setOptionsByKey] = useState<Record<string, string[]>>(
    {},
  );
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [idByName, setIdByName] = useState<Record<string, string>>({});

  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!storageKey) return;

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setSelected(JSON.parse(saved));
      }
    } catch {
      setSelected({});
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!storageKey) return;
    if (!hydrated) return;

    sessionStorage.setItem(storageKey, JSON.stringify(selected));
  }, [hydrated, selected, storageKey]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setIsOptionsLoading(true);

      try {
        const data: InterestItem[] = await getInterests();
        if (!mounted) return;

        const nextOptions: Record<string, string[]> = {};
        const nextIdByName: Record<string, string> = {};

        for (const item of data) {
          nextIdByName[item.name] = item.id;
          const key = item.subcategory ?? item.category;

          if (!nextOptions[key]) nextOptions[key] = [];
          nextOptions[key].push(item.name);
        }

        setOptionsByKey(nextOptions);
        setIdByName(nextIdByName);
      } catch (error) {
        console.error('Failed to load interests:', error);
      } finally {
        if (!mounted) return;
        setIsOptionsLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
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

  if (isOptionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <TextWrapper>
        {stepText && <StepText>{stepText}</StepText>}
        {titleText && <TitleText>{titleText(name)}</TitleText>}
        {subtitleText && <SubText>{subtitleText}</SubText>}
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
                    if ((i + 1) % 4 === 0)
                      nodes.push(<Break key={`br-${key}-${i}`} />);
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
          label={nextLabel}
          onClick={async () => {
            try {
              const selectedNames = Object.values(selected).flat();
              const interestIds = Array.from(
                new Set(selectedNames.map((n) => idByName[n]).filter(Boolean)),
              );
              await updateInterests(interestIds);
              if (storageKey) sessionStorage.removeItem(storageKey);
              if (successQueryKey) {
                router.push(`${nextRoute}?${successQueryKey}=true`);
              } else {
                router.push(nextRoute);
              }
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
