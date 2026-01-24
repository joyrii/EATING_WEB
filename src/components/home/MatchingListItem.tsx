import {
  Button,
  ButtonContainer,
  DateTime,
  DateTimeWrapper,
  MatchingListItemContainer,
  Participants,
  ParticipantsWrapper,
} from "./style";

export default function MatchingListItem() {
  return (
    <MatchingListItemContainer>
      <ParticipantsWrapper>
        <Participants>2명/4명</Participants>
      </ParticipantsWrapper>
      <DateTimeWrapper>
        <DateTime>10.30일 월 14:00</DateTime>
      </DateTimeWrapper>
      <ButtonContainer>
        <Button $variant="detail">상세 보기</Button>
        <Button $variant="chat">채팅방 입장</Button>
      </ButtonContainer>
    </MatchingListItemContainer>
  );
}
