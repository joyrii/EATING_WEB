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

const weeks = [
  { id: 'w1', start: '2월 23일', end: '3월 1일' },
  { id: 'w2', start: '3월 2일', end: '3월 8일' },
] as const;

type WeekId = (typeof weeks)[number]['id'];

export default function Schedule() {
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false); // 확인 모달

  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [selectedByWeek, setSelectedByWeek] = useState<Record<WeekId, Slot[]>>({
    w1: [],
    w2: [],
  });

  const setAvailableSlots = useMatchingDraftByWeek(
    (state) => state.setAvailableSlots,
  );

  const setActiveWeekKey = useMatchingDraftByWeek(
    (state) => state.setActiveWeekKey,
  );

  useEffect(() => {
    setActiveWeekKey('2026-02-23');
  }, [setActiveWeekKey]);

  const hasSelection = useMemo(
    () => Object.values(selectedByWeek).some((slots) => slots.length > 0),
    [selectedByWeek],
  );

  const payload = useMemo(
    () => ({
      available_slots: [...selectedByWeek.w1, ...selectedByWeek.w2],
    }),
    [selectedByWeek],
  );

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
          week={weeks[activeWeekIndex]}
          value={selectedByWeek[weeks[activeWeekIndex].id]}
          onChange={(next) => {
            setSelectedByWeek((prev) => ({
              ...prev,
              [weeks[activeWeekIndex].id]: next,
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
              console.log('선택된 시간 슬롯:', payload);
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
