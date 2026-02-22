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
  // 첫째주 월요일 제외
  const isFirstWeek = activeWeekIndex === 0;
  const draftByWeek = useMatchingDraftByWeek((s) => s.draftByWeek);
  const getDraft = useMatchingDraftByWeek((s) => s.getDraft);

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

  const toUtcDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  };

  const diffDaysISO = (startIso: string, dateIso: string) => {
    const a = toUtcDate(startIso).getTime();
    const b = toUtcDate(dateIso).getTime();
    return Math.floor((b - a) / (1000 * 60 * 60 * 24));
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

  useEffect(() => {
    if (weeks.length === 0) return;

    // 이미 칠해진 게 있으면 덮어쓰지 않음
    const hasAny = Object.values(selectedByWeek).some((v) => v.length > 0);
    if (hasAny) return;

    const draft = getDraft();
    const allApiSlots: ApiSlot[] = draft.available_slots ?? [];

    // round_id -> week_start 매핑
    const roundIdToWeekStart = new Map<string, string>();
    weeks.forEach((w) => roundIdToWeekStart.set(w.id, w.week_start));

    // week_start -> round_id 역매핑도 만들기
    const weekStartToRoundId = new Map<string, string>();
    weeks.forEach((w) => weekStartToRoundId.set(w.week_start, w.id));

    const restored: Record<string, Slot[]> = {};

    // 초기화
    weeks.forEach((w) => {
      restored[w.id] = [];
    });

    // 2주 전체 슬롯을 어느 주에 속하는지 계산해서 분배
    for (const s of allApiSlots) {
      for (const w of weeks) {
        const day = diffDaysISO(w.week_start, s.date);
        if (day >= 0 && day <= 6) {
          restored[w.id].push({ day, hour: s.hour });
          break;
        }
      }
    }

    setSelectedByWeek(restored);
  }, [weeks, getDraft]);

  useEffect(() => {
    if (weeks.length === 0) return;

    const roundIdToWeekStart = new Map<string, string>();
    weeks.forEach((w) => roundIdToWeekStart.set(w.id, w.week_start));

    const allApiSlots: ApiSlot[] = Object.entries(selectedByWeek).flatMap(
      ([roundId, slots]) => {
        const weekStart = roundIdToWeekStart.get(roundId);
        if (!weekStart) return [];
        return slots.map((s) => ({
          date: addDaysISO(weekStart, s.day),
          hour: s.hour,
        }));
      },
    );

    setAvailableSlots(allApiSlots);
  }, [selectedByWeek, weeks, setAvailableSlots]);

  return (
    <>
      {weeks.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div>
          <TextWrapper>
            <StepText>01</StepText>
            <TitleText>매칭 가능한 일정을 알려주세요.</TitleText>
            <SubText>
              {'>'}를 눌러 2주 동안 가능한 시간 모두 스크롤 해주세요!
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
            isFirstWeek={isFirstWeek}
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
      )}
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
