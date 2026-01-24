import {
  Button,
  ButtonContainer,
  DateTime,
  DateTimeWrapper,
  MatchingListItemContainer,
  Participants,
  ParticipantsWrapper,
} from "./style";

export default function MatchingListItem({
  status,
}: {
  status?: "default" | "match";
}) {
  return (
    <MatchingListItemContainer>
      <ParticipantsWrapper>
        <Participants>2명/4명</Participants>
      </ParticipantsWrapper>
      <DateTimeWrapper>
        <DateTime>10.30일 월 14:00</DateTime>
      </DateTimeWrapper>
      {status == "default" && (
        <ButtonContainer>
          <Button $variant="detail">매칭 상세</Button>
          <Button $variant="chat">채팅방 이동</Button>
        </ButtonContainer>
      )}
      {status === "match" && (
        <ButtonContainer>
          <Button $variant="review">평가하러 가기</Button>
        </ButtonContainer>
      )}
    </MatchingListItemContainer>
  );
}
