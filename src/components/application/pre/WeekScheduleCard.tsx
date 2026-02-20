import styled from 'styled-components';
import { DateBox } from '@/app/(withoutTabBar)/application/style';
import TimeGrid from '../TimeGrid';
import { Slot } from '@/components/application/TimeGrid';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

type WeekRange = {
  id: string;
  week_start: string;
  week_end: string;
};

export function WeekScheduleCard({
  week,
  value,
  onChange,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  isFirstWeek,
}: {
  week: WeekRange;
  value: Slot[];
  onChange: (next: Slot[]) => void;
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
  isFirstWeek: boolean;
}) {
  // 날짜 포맷팅 함수
  function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    return `${Number(month)}월 ${Number(day)}일`;
  }

  return (
    <div style={{ width: '100%', flex: '0 0 100%' }}>
      <DateBox
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          gap: 12,
        }}
      >
        <Button onClick={onPrev} disabled={disablePrev}>
          <IoChevronBack size={20} />
        </Button>
        {formatDate(week.week_start)} ~ {formatDate(week.week_end)}
        <Button onClick={onNext} disabled={disableNext}>
          <IoChevronForward size={20} />
        </Button>
      </DateBox>
      <TimeGrid
        key={week.id}
        value={value}
        onChange={onChange}
        disabledCell={(slot) => isFirstWeek && slot.day === 0}
      />
    </div>
  );
}

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
`;
