'use client';

import styled from 'styled-components';
import { BaseModal } from '../BaseModal';
import BaseChip from '../BaseChip';
import { Button } from './style';
import type { ChatRoomInfo } from '@/type/chat';
import type { PendingSlot } from './MatchingListSection';

type Props = {
  open: boolean;
  onClose: () => void;

  selectedRoom: ChatRoomInfo | null;
  selectedPending: PendingSlot | null;
  pendingLoading: boolean;

  sbJoinedMemberCount?: number;
  loading?: boolean;

  onEnter?: (room: ChatRoomInfo) => void;
  actionLabel?: string;
};

function formatSlotTitleFromDateHour(date: string, hour: number) {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d, hour, 0, 0);

  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  const weekday = dt.toLocaleDateString('ko-KR', { weekday: 'short' });
  const hh = String(dt.getHours()).padStart(2, '0');

  return `${month}/${day} ${weekday} ${hh}:00`;
}

export default function MatchingDetailModal({
  open,
  onClose,
  selectedRoom,
  selectedPending,
  pendingLoading,
  sbJoinedMemberCount = 0,
  loading,
  onEnter,
  actionLabel = '입장하기',
}: Props) {
  const title = selectedRoom
    ? formatSlotTitleFromDateHour(
        selectedRoom.matched_slot.date,
        selectedRoom.matched_slot.hour,
      )
    : '';

  const totalCount = selectedRoom?.member_count ?? 0;
  const showAction = !!onEnter && !!selectedRoom;

  return (
    <BaseModal open={open} onClose={onClose} padding="24px 21px">
      <div>
        <ModalMainText>{title}</ModalMainText>

        {selectedPending ? (
          <ModalSubText>
            {selectedPending.student_years_text},{' '}
            {selectedPending.personality_text}
          </ModalSubText>
        ) : (
          <ModalSubText>
            {pendingLoading
              ? '상세 정보를 불러오는 중...'
              : '상세 정보를 찾지 못했어요.'}
          </ModalSubText>
        )}
      </div>

      <TagsContainer>
        {(selectedPending?.common_interests ?? []).map((interest, idx) => (
          <BaseChip key={idx} label={interest} />
        ))}
      </TagsContainer>

      <ParticipantsInfoContainer>
        <ParticipantsInfoText>총 정원 {totalCount}명</ParticipantsInfoText>
        <ParticipantsInfoText>
          입장 인원 {sbJoinedMemberCount}명
        </ParticipantsInfoText>
      </ParticipantsInfoContainer>

      {showAction && (
        <ModalButtonContainer>
          <Button
            $variant="enter"
            onClick={() => selectedRoom && onEnter(selectedRoom)}
            disabled={loading || !selectedRoom}
            style={{ fontSize: '14px' }}
          >
            {actionLabel}
          </Button>
        </ModalButtonContainer>
      )}
    </BaseModal>
  );
}

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
