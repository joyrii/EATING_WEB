'use client';

import styled from 'styled-components';
import { Button } from './style';

export default function MatchingListItem({
  status = 'default',
  onClick,
  clickable = false,
}: {
  status?: 'default' | 'match';
  onClick?: () => void;
  clickable?: boolean;
}) {
  const buttonsByStatus = {
    default: [
      {
        variant: 'detail' as const,
        label: '매칭 상세',
        onClick: () => {
          onClick?.();
        },
      },
      { variant: 'chat' as const, label: '채팅방 이동', onClick: () => {} },
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
        <Participants>2명/4명</Participants>
      </ParticipantsWrapper>
      <DateTimeWrapper>
        <DateTime>10.30일 월 14:00</DateTime>
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
