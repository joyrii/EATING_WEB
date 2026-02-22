'use client';

import {
  StepText,
  TitleText,
  SubText,
  ButtonWrapper,
} from '@/app/(onboarding)/onboarding/style';
import {
  CautionWrapper,
  DateBox,
  ModalContent,
  TextWrapper,
  ModalButtonWrapper,
} from '@/app/(withoutTabBar)/application/style';
import TimeGrid, { Slot } from '@/components/application/TimeGrid';
import Button from '@/components/BaseButton';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseModal } from '@/components/BaseModal';
import Image from 'next/image';
import { getMatchingStatus } from '@/api/application';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useMatchingDraftByWeek, ApiSlot } from '@/context/matchingDraft';

type Week = { id: string; week_start: string; week_end: string };

export default function Schedule() {
  const router = useRouter();

  const [week, setWeek] = useState<Week | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const sigSlots = (arr: Slot[]) =>
    arr
      .map((s) => `${s.day}-${s.hour}`)
      .sort()
      .join('|');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // zustand
  const setActiveWeekKey = useMatchingDraftByWeek((s) => s.setActiveWeekKey);
  const setAvailableSlots = useMatchingDraftByWeek((s) => s.setAvailableSlots);
  const getDraft = useMatchingDraftByWeek((s) => s.getDraft);

  // yyyy-mm-dd -> n월 m일
  const formatKoreanMD = (iso: string) => {
    const [, mm, dd] = iso.split('-');
    return `${Number(mm)}월 ${Number(dd)}일`;
  };

  // yyyy-mm-dd + day(0~6) -> yyyy-mm-dd
  const addDaysISO = (isoDate: string, add: number) => {
    const [y, m, d] = isoDate.split('-').map(Number);
    const utc = new Date(Date.UTC(y, m - 1, d));
    utc.setUTCDate(utc.getUTCDate() + add);

    const yy = utc.getUTCFullYear();
    const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(utc.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };

  // yyyy-mm-dd -> Date(UTC)
  const toUTCDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  };

  // 두 날짜 차이(day)
  const diffDaysISO = (fromISO: string, toISO: string) => {
    const from = toUTCDate(fromISO).getTime();
    const to = toUTCDate(toISO).getTime();
    return Math.round((to - from) / (1000 * 60 * 60 * 24));
  };

  // 1) 주차 조회 (여기 페이지는 1주차만 사용)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await getMatchingStatus();
        const first = res.rounds?.[0];

        if (!first) {
          setWeek(null);
          return;
        }

        const w: Week = {
          id: first.round_id,
          week_start: first.week_start,
          week_end: first.week_end,
        };

        setWeek(w);

        // ✅ store activeWeekKey 설정
        setActiveWeekKey(w.week_start);

        // ✅ store에 저장된 값 있으면 복원
        const draft = getDraft(w.week_start);
        if (draft.available_slots?.length) {
          const restored: Slot[] = draft.available_slots
            .map((s: ApiSlot) => ({
              day: diffDaysISO(w.week_start, s.date),
              hour: s.hour,
            }))
            .filter((s) => s.day >= 0 && s.day <= 6);

          setSlots(restored);
        } else {
          setSlots([]);
        }
      } catch (e) {
        console.error('주차 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastSlotsSigRef = useRef<string>(''); // Schedule 컴포넌트 안

  useEffect(() => {
    lastSlotsSigRef.current = sigSlots(slots);
  }, [slots]);

  const hasSelection = slots.length > 0;

  // 서버 전송용 payload (date/hour)
  const payload = useMemo(() => {
    if (!week) return { available_slots: [] as ApiSlot[] };

    return {
      available_slots: slots.map((s) => ({
        date: addDaysISO(week.week_start, s.day),
        hour: s.hour,
      })),
    };
  }, [slots, week]);

  if (loading) return <LoadingSpinner />;
  if (!week) return <div>현재 매칭 가능한 주차가 없어요.</div>;

  return (
    <>
      <div>
        <TextWrapper>
          <StepText>01</StepText>
          <TitleText>매칭 가능한 일정을 알려주세요.</TitleText>
          <SubText>
            꼭 나갈 수 있는 시간만 스크롤해서 선택해주세요!
            <br />
            <span>최대 2개</span>의 방이 생성될 수 있어요
          </SubText>
        </TextWrapper>

        <DateBox>
          {formatKoreanMD(week.week_start)} ~ {formatKoreanMD(week.week_end)}
        </DateBox>
        <TimeGrid
          value={slots}
          onChange={(next) => {
            const nextSig = sigSlots(next);

            // ✅ 동일 값이면 state/store 업데이트 스킵 (무한루프 차단)
            if (nextSig === lastSlotsSigRef.current) return;

            lastSlotsSigRef.current = nextSig;
            setSlots(next);

            // store 저장
            setActiveWeekKey(week.week_start);
            const nextApiSlots: ApiSlot[] = next.map((s) => ({
              date: addDaysISO(week.week_start, s.day),
              hour: s.hour,
            }));
            setAvailableSlots(nextApiSlots);
          }}
        />

        <ButtonWrapper>
          <Button
            label="다음"
            disabled={!hasSelection}
            onClick={() => {
              console.log('최종 payload:', payload);
              setIsModalVisible(true);
            }}
          />
        </ButtonWrapper>
      </div>

      <BaseModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        padding="20px 21px"
      >
        <ModalContent>
          <CautionWrapper>
            <Image
              src="/svgs/caution.svg"
              alt="caution"
              width={36}
              height={36}
            />
            <p>
              방이 생성된 후 약속 불참 시
              <br />
              노쇼 페널티가 부과됩니다
            </p>
          </CautionWrapper>

          <ModalButtonWrapper>
            <Button
              label="확인"
              onClick={() => {
                setActiveWeekKey(week.week_start);
                setAvailableSlots(payload.available_slots);
                // 필요하면 여기서 payload로 API 호출 or store 저장
                router.push('/application/dining');
              }}
            />
          </ModalButtonWrapper>
        </ModalContent>
      </BaseModal>
    </>
  );
}
