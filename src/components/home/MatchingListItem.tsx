'use client';

import {
  Button,
  ButtonContainer,
  DateTime,
  DateTimeWrapper,
  MatchingListItemContainer,
  Participants,
  ParticipantsWrapper,
} from './style';

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
