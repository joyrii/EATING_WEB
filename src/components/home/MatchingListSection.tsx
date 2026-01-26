import { Section, SectionTitle, MatchingList } from "./style";
import MatchingListItem from "./MatchingListItem";
import { BaseModal } from "../BaseModal";
import { useState } from "react";

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
        안녕하세요
      </BaseModal>
    </>
  );
}
