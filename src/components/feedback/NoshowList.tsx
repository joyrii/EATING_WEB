'use client';

import styled from 'styled-components';

export type NoshowListItemProps = {
  date: string; // YYYY-MM-DD
  hour: number; // 14
  onClick?: () => void;
  onDetailClick?: () => void;
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

export default function NoshowListItem({
  date,
  hour,
  onClick,
  onDetailClick,
}: NoshowListItemProps) {
  const formattedDateTime = formatDateTime(date, hour);

  const buttonsByStatus = {
    default: [
      {
        variant: 'detail' as const,
        label: '상세 보기',
        onClick: () => {
          onDetailClick?.();
        },
      },
    ],
  };

  return (
    <MatchingListItemContainer onClick={onClick}>
      <DateTimeWrapper>
        <DateTime>{formattedDateTime}</DateTime>
      </DateTimeWrapper>
      <ButtonContainer>
        {buttonsByStatus.default.map((b) => (
          <Button
            key={b.variant}
            onClick={(e) => {
              e.stopPropagation();
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

const MatchingListItemContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding-top: 12px;
  padding-bottom: 20px;
  padding-inline: 20px;
  cursor: pointer;
`;

const DateTimeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
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

export const Button = styled.button`
  flex: 1;
  min-width: 0;
  cursor: pointer;
  height: 45px;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
`;
