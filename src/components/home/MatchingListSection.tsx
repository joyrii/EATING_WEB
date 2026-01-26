import {
  Section,
  SectionTitle,
  MatchingList,
  Button,
  ModalMainText,
  ModalSubText,
  ModalButtonContainer,
  ParticipantsInfoText,
  ParticipantsInfoContainer,
  TagsContainer,
} from "./style";
import MatchingListItem from "./MatchingListItem";
import { BaseModal } from "../BaseModal";
import { useState } from "react";
import BaseChip from "../BaseChip";

export default function MatchingListSection() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Section>
        <SectionTitle>
          이번주에 매칭된 방 <span>5개</span>
        </SectionTitle>
        <MatchingList>
          <MatchingListItem status="match" onClick={() => {}} />
          <MatchingListItem
            status="default"
            onClick={() => {
              setIsModalVisible(true);
            }}
          />
          <MatchingListItem
            status="default"
            onClick={() => {
              setIsModalVisible(true);
            }}
          />
          <MatchingListItem
            status="default"
            onClick={() => {
              setIsModalVisible(true);
            }}
          />
          <MatchingListItem
            status="default"
            onClick={() => {
              setIsModalVisible(true);
            }}
          />
        </MatchingList>
      </Section>
      <BaseModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        padding="24px 21px"
      >
        <div>
          <ModalMainText>10.30일 월요일 14:00</ModalMainText>
          <ModalSubText>22학번/21학번, E들의 모임</ModalSubText>
        </div>
        <TagsContainer>
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
        </TagsContainer>
        <ParticipantsInfoContainer>
          <ParticipantsInfoText>총 정원 4명</ParticipantsInfoText>
          <ParticipantsInfoText>입장 인원 2명</ParticipantsInfoText>
        </ParticipantsInfoContainer>
        <ModalButtonContainer>
          <Button $variant="enter">입장하기</Button>
        </ModalButtonContainer>
      </BaseModal>
    </>
  );
}
