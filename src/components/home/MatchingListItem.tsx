'use client';

import styled from 'styled-components';
import { Button } from './style';

export default function MatchingListItem({
  status = 'default',
  onClick,
}: {
  status?: 'default' | 'match';
  onClick?: () => void;
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
    <MatchingListItemContainer>
      <ParticipantsWrapper>
        <Participants>2명/4명</Participants>
      </ParticipantsWrapper>
      <DateTimeWrapper>
        <DateTime>10.30일 월 14:00</DateTime>
      </DateTimeWrapper>
      <ButtonContainer>
        {buttonsByStatus[status].map((b) => (
          <Button key={b.variant} $variant={b.variant} onClick={b.onClick}>
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
  padding-top: 25px;
  padding-bottom: 20px;
  padding-inline: 20px;
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
