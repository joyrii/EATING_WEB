'use client';

import {
  StepText,
  TitleText,
  SubText,
  ButtonWrapper,
} from '@/app/(onboarding)/onboarding/style';
import {
  CautionWrapper,
  ModalContent,
  TextWrapper,
} from '@/app/(withoutTabBar)/application/style';
import { Slot } from '@/components/application/TimeGrid';
import Button from '@/components/BaseButton';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseModal } from '@/components/BaseModal';
import Image from 'next/image';
import { ModalButtonWrapper } from '@/app/(withoutTabBar)/application/style';
import { WeekScheduleCard } from '@/components/application/pre/WeekScheduleCard';
import { useMatchingDraftByWeek } from '@/context/matchingDraft';
import { getMatchingStatus } from '@/api/application';
import LoadingSpinner from '@/components/LoadingSpinner';

type Week = { id: string; week_start: string; week_end: string };
type ApiSlot = { date: string; hour: number };

export default function Schedule() {
  const router = useRouter();

  const [weeks, setWeeks] = useState<Week[]>([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [selectedByWeek, setSelectedByWeek] = useState<Record<string, Slot[]>>(
    {},
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 주차 조회
  useEffect(() => {
    const run = async () => {
      const res = await getMatchingStatus();

      const nextWeeks: Week[] = (res.rounds ?? []).map((r: any) => ({
        id: r.round_id,
        week_start: r.week_start,
        week_end: r.week_end,
      }));

      setWeeks(nextWeeks);
    };

    run();
  }, []);

  // activeWeekIndex 범위 보정
  useEffect(() => {
    setActiveWeekIndex((i) => Math.min(i, Math.max(weeks.length - 1, 0)));
  }, [weeks.length]);

  const activeWeek = weeks[activeWeekIndex];

  const setAvailableSlots = useMatchingDraftByWeek(
    (state) => state.setAvailableSlots,
  );

  const setActiveWeekKey = useMatchingDraftByWeek(
    (state) => state.setActiveWeekKey,
  );

  // 현재 활성 주차 key 동기화
  useEffect(() => {
    if (activeWeek) {
      setActiveWeekKey(activeWeek.week_start);
    }
  }, [activeWeek, setActiveWeekKey]);

  const hasSelection = useMemo(
    () => Object.values(selectedByWeek).some((slots) => slots.length > 0),
    [selectedByWeek],
  );

  // yyyy-mm-dd + day(0~6) → 실제 날짜 계산
  const addDaysISO = (isoDate: string, add: number) => {
    const [y, m, d] = isoDate.split('-').map(Number);
    const utc = new Date(Date.UTC(y, m - 1, d));
    utc.setUTCDate(utc.getUTCDate() + add);

    const yy = utc.getUTCFullYear();
    const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(utc.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };

  // 서버 전송용 payload 생성 (date/hour 형태)
  const payload = useMemo(() => {
    const roundIdToWeekStart = new Map<string, string>();
    weeks.forEach((w) => roundIdToWeekStart.set(w.id, w.week_start));

    const apiSlots: ApiSlot[] = Object.entries(selectedByWeek).flatMap(
      ([roundId, slots]) => {
        const weekStart = roundIdToWeekStart.get(roundId);
        if (!weekStart) return [];

        return slots.map((s) => ({
          date: addDaysISO(weekStart, s.day),
          hour: s.hour,
        }));
      },
    );

    return { available_slots: apiSlots };
  }, [selectedByWeek, weeks]);

  if (weeks.length === 0) return <LoadingSpinner />;

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

        <WeekScheduleCard
          week={activeWeek}
          value={selectedByWeek[activeWeek.id] ?? []}
          onChange={(next) => {
            setSelectedByWeek((prev) => ({
              ...prev,
              [activeWeek.id]: next,
            }));
          }}
          onPrev={() => setActiveWeekIndex((i) => Math.max(0, i - 1))}
          onNext={() =>
            setActiveWeekIndex((i) => Math.min(weeks.length - 1, i + 1))
          }
          disablePrev={activeWeekIndex === 0}
          disableNext={activeWeekIndex === weeks.length - 1}
        />

        <ButtonWrapper>
          <Button
            label="다음"
            disabled={!hasSelection}
            onClick={() => {
              console.log('전송 payload:', payload);
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
              방이 생성된 후 약속 불참 시<br />
              노쇼 페널티가 부과됩니다
            </p>
          </CautionWrapper>

          <ModalButtonWrapper>
            <Button
              label="확인"
              onClick={() => {
                setAvailableSlots(payload.available_slots);
                router.push('/pre/dining');
              }}
            />
          </ModalButtonWrapper>
        </ModalContent>
      </BaseModal>
    </>
  );
}
