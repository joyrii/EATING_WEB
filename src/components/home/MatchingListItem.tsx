'use client';

import styled from 'styled-components';
import { Button } from './style';

export type MatchingListItemProps = {
  status?: 'default' | 'match';
  date: string; // YYYY-MM-DD
  hour: number; // 14
  currentCount: number; // 현재 인원
  totalCount: number; // 총 정원
  onClick?: () => void;
  onChatClick?: () => void;
  onDetailClick?: () => void;
  clickable?: boolean;
};

function formatDateTime(date: string, hour: number) {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d, hour, 0, 0);

  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  const weekday = dt.toLocaleDateString('ko-KR', { weekday: 'short' });
  const hh = String(dt.getHours()).padStart(2, '0');

  return `${month}/${day} ${weekday} ${hh}:00`;
}

export default function MatchingListItem({
  status = 'default',
  date,
  hour,
  currentCount,
  totalCount,
  onClick,
  onChatClick,
  onDetailClick,
  clickable = false,
}: MatchingListItemProps) {
  const formattedDateTime = formatDateTime(date, hour);

  const buttonsByStatus = {
    default: [
      {
        variant: 'detail' as const,
        label: '매칭 상세',
        onClick: () => {
          onDetailClick?.();
        },
      },
      {
        variant: 'chat' as const,
        label: '채팅방 이동',
        onClick: () => onChatClick?.(),
      },
    ],
    match: [
      { variant: 'review' as const, label: '평가하러 가기', onClick: () => {} },
    ],
  };

  return (
    <MatchingListItemContainer
      $clickable={clickable}
      onClick={clickable ? onClick : undefined}
    >
      <ParticipantsWrapper>
        <Participants>
          {currentCount}명/{totalCount}명
        </Participants>
      </ParticipantsWrapper>
      <DateTimeWrapper>
        <DateTime>{formattedDateTime}</DateTime>
      </DateTimeWrapper>
      <ButtonContainer>
        {buttonsByStatus[status].map((b) => (
          <Button
            key={b.variant}
            $variant={b.variant}
            onClick={(e) => {
              if (clickable) e.stopPropagation();
              b.onClick();
            }}
          >
            {b.label}
          </Button>
        ))}
      </ButtonContainer>
    </MatchingListItemContainer>
  );
}

const MatchingListItemContainer = styled.div<{ $clickable?: boolean }>`
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding-top: 12px;
  padding-bottom: 20px;
  padding-inline: 20px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const ParticipantsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Participants = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 145%;
  color: #3d3d3d;
`;

const DateTimeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
`;

const DateTime = styled.h3`
  font-size: 21px;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 6px;
`;
