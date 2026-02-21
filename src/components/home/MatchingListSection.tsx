import { Section, SectionTitle, MatchingList, Button } from './style';
import styled from 'styled-components';
import MatchingListItem from './MatchingListItem';
import { BaseModal } from '../BaseModal';
import { useEffect, useMemo, useState } from 'react';
import BaseChip from '../BaseChip';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { fetchPendingMatches, joinChat } from '@/api/matching';

export type PendingSlot = {
  group_id: string; // code
  round_id: string;
  matched_slot: { date: string; hour: number };
  restaurant_name: string;
  members: { user_id: string; name: string }[];
  has_reviewed: boolean;
};

function getAppointmentDate(slot: PendingSlot) {
  const { date, hour } = slot.matched_slot;

  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day, hour, 0, 0);
}

function getStatusBySlot(slot: PendingSlot, myId: string): 'default' | 'match' {
  const now = new Date();
  const appointment = getAppointmentDate(slot);

  const isTimePassed = now >= appointment;

  const isParticipant = slot.members.some((m) => m.user_id === myId);

  return isTimePassed && isParticipant ? 'match' : 'default';
}

function formatSlotTitle(slot: PendingSlot) {
  const { date, hour } = slot.matched_slot;

  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d, hour, 0, 0);

  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  const weekday = dt.toLocaleDateString('ko-KR', { weekday: 'short' });

  const hh = String(dt.getHours()).padStart(2, '0');

  return `${month}/${day} ${weekday} ${hh}:00`;
}

export default function MatchingListSection() {
  const router = useRouter();
  const { me, isLoaded } = useUser();

  const [tick, setTick] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pending, setPending] = useState<PendingSlot[]>([]);
  const [selected, setSelected] = useState<PendingSlot | null>(null);
  const [loading, setLoading] = useState(false);

  // 1분마다 매칭 여부 확인
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  // 입장 가능한 방 조회
  useEffect(() => {
    if (!isLoaded || !me?.id) return;

    let cancelled = false;

    const run = async () => {
      try {
        const list = await fetchPendingMatches();
        if (!cancelled) setPending(list ?? []);
      } catch (e) {
        console.error('Failed to load pending reviews:', e);
        if (!cancelled) setPending([]);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id]);

  const openDetail = (slot: PendingSlot) => {
    setSelected(slot);
    setIsModalVisible(true);
  };

  // 채팅방 입장 및 이동 (group_id == code)
  const enterChat = async (slot: PendingSlot) => {
    if (!me?.id) return;
    if (loading) return;

    setLoading(true);
    try {
      const res = await joinChat({
        code: slot.group_id,
        user_id: me.id,
        nickname: me.name,
      });

      const channelUrl = res.channel_url;
      const date = slot.matched_slot.date;
      const hour = slot.matched_slot.hour;
      const restaurant = slot.restaurant_name;

      router.push(
        `/chat/${channelUrl}?date=${date}&hour=${hour}&restaurant=${restaurant}`,
      );
    } catch (e) {
      console.error('Failed to enter chat:', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedTitle = useMemo(() => {
    if (!selected) return '';
    return formatSlotTitle(selected);
  }, [selected]);

  const selectedSub = useMemo(() => {
    if (!selected) return '';
    const members = selected.members.map((m) => m.name).join(', ');
    return `${members}의 모임`;
  }, [selected]);

  const capacityText = useMemo(() => {
    if (!selected) return { total: 0, entered: 0 };
    return { total: selected.members.length, entered: selected.members.length }; // ✅ 실제 입장 인원 구분 필요
  }, [selected]);

  return (
    <>
      <Section>
        {pending.length === 0 ? (
          <>
            <EmptyStateContainer>
              <img
                src="/svgs/home/eating-logo-character-empty.svg"
                alt="empty-state"
                width={175}
                height={175}
              />
              <EmptyStateText>아직 매칭된 방이 없어요!</EmptyStateText>
            </EmptyStateContainer>
          </>
        ) : (
          <>
            <SectionTitle>
              이번주에 매칭된 방 <span>{pending.length}개</span>
            </SectionTitle>
            <MatchingList>
              {pending.map((slot) => (
                <MatchingListItem
                  key={slot.group_id}
                  status={getStatusBySlot(slot, me?.id)}
                  date={slot.matched_slot.date}
                  hour={slot.matched_slot.hour}
                  currentCount={slot.members.length}
                  totalCount={slot.members.length} // ✅ 실제 정원 구분 필요
                  onClick={() => openDetail(slot)}
                  onChatClick={() => enterChat(slot)}
                  clickable
                />
              ))}
            </MatchingList>
          </>
        )}
      </Section>
      <BaseModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        padding="24px 21px"
      >
        <div>
          <ModalMainText>{selectedTitle}</ModalMainText>
          <ModalSubText>{selectedSub}</ModalSubText>
        </div>
        <TagsContainer>
          {/* ✅ 실제 태그 데이터 필요 */}
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
          <BaseChip label="아이돌 덕질" />
        </TagsContainer>
        <ParticipantsInfoContainer>
          <ParticipantsInfoText>
            총 정원 {capacityText.total}명
          </ParticipantsInfoText>
          <ParticipantsInfoText>
            입장 인원 {capacityText.entered}명
          </ParticipantsInfoText>
        </ParticipantsInfoContainer>
        <ModalButtonContainer>
          <Button
            $variant="enter"
            onClick={() => enterChat(selected)}
            disabled={loading}
          >
            입장하기
          </Button>
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

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  justify-content: center;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
`;

const EmptyStateText = styled.p`
  font-size: 20px;
  font-weight: 400;
  font-family: var(--font-empty);
`;
