'use client';

import styled from 'styled-components';
import { TitleText } from '@/app/(onboarding)/onboarding/style';
import {
  SkipButton,
  SkipButtonWrapper,
  ButtonWrapper,
  TextWrapper,
} from '../style';
import Button from '@/components/BaseButton';
import ClassChip from '@/components/application/ClassChip';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MbtiOption from '@/components/onboarding/MbtiOption';
import { useMatchingDraftByWeek } from '@/context/matchingDraft';
import { applyMatching, getMatchingStatus } from '@/api/application';

export default function Additional() {
  const router = useRouter();

  const CLASS = ['26', '25', '24', '23', '22'];

  const [selectedClass, setSelectedClass] = useState<string[]>([]);
  const [mbti1, setMbti1] = useState<'E' | 'I' | ''>('');
  const [mbti2, setMbti2] = useState<'S' | 'N' | ''>('');
  const [mbti3, setMbti3] = useState<'T' | 'F' | ''>('');
  const [mbti4, setMbti4] = useState<'J' | 'P' | ''>('');

  const setActiveWeekKey = useMatchingDraftByWeek((s) => s.setActiveWeekKey);
  const getDraft = useMatchingDraftByWeek((s) => s.getDraft);
  const setPreferredYears = useMatchingDraftByWeek((s) => s.setPreferredYears);
  const setExcludedMbti = useMatchingDraftByWeek((s) => s.setExcludedMbti);

  const mbtiFull = useMemo(() => {
    if (mbti1 && mbti2 && mbti3 && mbti4)
      return `${mbti1}${mbti2}${mbti3}${mbti4}`;
    return '';
  }, [mbti1, mbti2, mbti3, mbti4]);

  // 1) activeWeekKey 보강 + 복원
  useEffect(() => {
    (async () => {
      try {
        const state = useMatchingDraftByWeek.getState();
        let wk = state.activeWeekKey;

        if (!wk) {
          const res = await getMatchingStatus();
          const first = res.rounds?.[0];
          if (first?.week_start) {
            wk = first.week_start;
            setActiveWeekKey(wk);
          }
        }
        if (!wk) return;

        const draft = getDraft(wk);

        // 학번 복원
        setSelectedClass((draft.preferred_years ?? []).map(String));

        // MBTI 복원
        const saved = draft.excluded_mbti?.[0] ?? '';
        if (saved.length === 4) {
          setMbti1(saved[0] as any);
          setMbti2(saved[1] as any);
          setMbti3(saved[2] as any);
          setMbti4(saved[3] as any);
        } else {
          if (
            draft.excluded_mbti?.length === 4 &&
            draft.excluded_mbti.every((x) => x.length === 1)
          ) {
            const merged = draft.excluded_mbti.join('');
            if (merged.length === 4) {
              setMbti1(merged[0] as any);
              setMbti2(merged[1] as any);
              setMbti3(merged[2] as any);
              setMbti4(merged[3] as any);
              setExcludedMbti([merged]);
              return;
            }
          }
          setMbti1('');
          setMbti2('');
          setMbti3('');
          setMbti4('');
        }
      } catch (e) {
        console.error('Additional 복원 실패:', e);
      }
    })();
  }, []);

  // 2) 학번 토글
  const toggleClass = (classYear: string) => {
    setSelectedClass((prev) => {
      const next = prev.includes(classYear)
        ? prev.filter((x) => x !== classYear)
        : [...prev, classYear];

      setPreferredYears(
        next.map((y) => Number(y)).filter((n) => !Number.isNaN(n)),
      );
      return next;
    });
  };

  // 3) MBTI 클릭 업데이트
  const updateMbti = (index: 1 | 2 | 3 | 4, value: string) => {
    if (index === 1) setMbti1((prev) => (prev === value ? '' : value) as any);
    if (index === 2) setMbti2((prev) => (prev === value ? '' : value) as any);
    if (index === 3) setMbti3((prev) => (prev === value ? '' : value) as any);
    if (index === 4) setMbti4((prev) => (prev === value ? '' : value) as any);
  };

  useEffect(() => {
    setExcludedMbti(mbtiFull ? [mbtiFull] : []);
  }, [mbtiFull, setExcludedMbti]);

  const submit = async () => {
    try {
      const draft = getDraft();
      const payload = {
        available_slots: draft.available_slots ?? [],
        excluded_restaurant_ids: draft.excluded_restaurant_ids ?? [],
        preferred_years: (draft.preferred_years ?? [])
          .map((y) => Number(y))
          .filter((n) => !Number.isNaN(n)),
        excluded_mbti: mbtiFull ? [mbtiFull] : [],
      };

      console.log('매칭 신청 payload:', payload);

      await applyMatching(payload);
    } catch (e: any) {
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
        <SkipButton
          onClick={() => {
            submit();
            router.push('/home');
          }}
        >
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

        {/* 학번 */}
        <InputWrapper>
          <Label>01 만나고 싶은 학번은?</Label>
          <ClassWrapper>
            {CLASS.map((classYear) => (
              <ClassChip
                key={classYear}
                label={classYear}
                checked={selectedClass.includes(classYear)}
                onClick={() => toggleClass(classYear)}
              />
            ))}
          </ClassWrapper>
        </InputWrapper>

        {/* MBTI */}
        <InputWrapper>
          <Label>02 만나고 싶지 않은 MBTI는?</Label>

          <MbtiOptionWrapper>
            <MbtiOptionColumn>
              <MbtiOption
                label="E"
                selected={mbti1 === 'E'}
                onClick={() => updateMbti(1, 'E')}
              />
              <MbtiOption
                label="I"
                selected={mbti1 === 'I'}
                onClick={() => updateMbti(1, 'I')}
              />
            </MbtiOptionColumn>

            <MbtiOptionColumn>
              <MbtiOption
                label="S"
                selected={mbti2 === 'S'}
                onClick={() => updateMbti(2, 'S')}
              />
              <MbtiOption
                label="N"
                selected={mbti2 === 'N'}
                onClick={() => updateMbti(2, 'N')}
              />
            </MbtiOptionColumn>

            <MbtiOptionColumn>
              <MbtiOption
                label="T"
                selected={mbti3 === 'T'}
                onClick={() => updateMbti(3, 'T')}
              />
              <MbtiOption
                label="F"
                selected={mbti3 === 'F'}
                onClick={() => updateMbti(3, 'F')}
              />
            </MbtiOptionColumn>

            <MbtiOptionColumn>
              <MbtiOption
                label="J"
                selected={mbti4 === 'J'}
                onClick={() => updateMbti(4, 'J')}
              />
              <MbtiOption
                label="P"
                selected={mbti4 === 'P'}
                onClick={() => updateMbti(4, 'P')}
              />
            </MbtiOptionColumn>
          </MbtiOptionWrapper>
        </InputWrapper>
      </ContentWrapper>

      <ButtonWrapper style={{ paddingTop: '5px' }}>
        <Button label="신청 완료" onClick={submit} />
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
