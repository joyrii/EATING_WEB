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
} from '@/app/(withoutTabBar)/application/style';
import TimeGrid, { Slot } from '@/components/application/TimeGrid';
import Button from '@/components/BaseButton';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseModal } from '@/components/BaseModal';
import Image from 'next/image';
import { ModalButtonWrapper } from '@/app/(withoutTabBar)/application/style';
import { getMatchingStatus } from '@/api/application';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useMatchingDraftByWeek } from '@/context/matchingDraft';

type Week = { id: string; week_start: string; week_end: string };
type ApiSlot = { date: string; hour: number };

export default function Schedule() {
  const router = useRouter();

  const [week, setWeek] = useState<Week | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]); // 선택된 시간 슬롯(day/hour)

  const [isModalVisible, setIsModalVisible] = useState(false); // 확인 모달
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 주차 조회 (여기 페이지는 1주차만 사용)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await getMatchingStatus();
        const first = res.rounds?.[0];

        if (!first) {
          setWeek(null);
          return;
        }

        setWeek({
          id: first.round_id,
          week_start: first.week_start,
          week_end: first.week_end,
        });
      } catch (e) {
        console.error('주차 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const hasSelection = slots.length > 0;

  // yyyy-mm-dd -> n월 m일
  const formatKoreanMD = (iso: string) => {
    const [, mm, dd] = iso.split('-');
    return `${Number(mm)}월 ${Number(dd)}일`;
  };

  // yyyy-mm-dd + day(0~6) -> 실제 날짜(yyyy-mm-dd)
  const addDaysISO = (isoDate: string, add: number) => {
    const [y, m, d] = isoDate.split('-').map(Number);
    const utc = new Date(Date.UTC(y, m - 1, d));
    utc.setUTCDate(utc.getUTCDate() + add);

    const yy = utc.getUTCFullYear();
    const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(utc.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };

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

  const setAvailableSlots = useMatchingDraftByWeek(
    (state) => state.setAvailableSlots,
  );

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

        <TimeGrid value={slots} onChange={setSlots} />

        <ButtonWrapper>
          <Button
            label="다음"
            disabled={!hasSelection}
            onClick={() => {
              console.log('최종 payload:', payload); // ✅ date/hour 형태로 확인
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
                // 필요하면 여기서 payload로 API 호출 or store 저장
                setAvailableSlots(payload.available_slots);
                router.push('/application/dining');
              }}
            />
          </ModalButtonWrapper>
        </ModalContent>
      </BaseModal>
    </>
  );
}
