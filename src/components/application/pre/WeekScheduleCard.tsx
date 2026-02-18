import styled from 'styled-components';
import { DateBox } from '@/app/(withoutTabBar)/application/style';
import TimeGrid from '../TimeGrid';
import { Slot } from '@/components/application/TimeGrid';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

type WeekRange = {
  id: string;
  start: string;
  end: string;
};

export function WeekScheduleCard({
  week,
  value,
  onChange,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: {
  week: WeekRange;
  value: Slot[];
  onChange: (next: Slot[]) => void;
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
}) {
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
        {week.start} ~ {week.end}
        <Button onClick={onNext} disabled={disableNext}>
          <IoChevronForward size={20} />
        </Button>
      </DateBox>
      <TimeGrid value={value} onChange={onChange} />
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
