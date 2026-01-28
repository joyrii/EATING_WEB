import { Section, SectionTitle, MatchingList, Button } from './style';
import styled from 'styled-components';
import MatchingListItem from './MatchingListItem';
import { BaseModal } from '../BaseModal';
import { useState } from 'react';
import BaseChip from '../BaseChip';

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

// 상세 보기 모달
const ModalMainText = styled.h2`
  margin: 0;
  font-size: 21px;
  font-weight: 600;
  color: #000000;
`;

const ModalSubText = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 145%;
  letter-spacing: -0.01em;
  color: #232323;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 2px;
  margin-top: 30px;
`;

const ParticipantsInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  margin-top: 5px;
`;

const ParticipantsInfoText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #8a8a8a;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;
