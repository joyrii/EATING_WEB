import { Section, SectionTitle, MatchingList, Button } from './style';
import styled from 'styled-components';
import MatchingListItem from './MatchingListItem';
import { BaseModal } from '../BaseModal';
import { useEffect, useMemo, useRef, useState } from 'react';
import BaseChip from '../BaseChip';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';

import {
  fetchPendingMatches,
  getChatRooms,
  joinChat,
  type PendingMatch,
} from '@/api/matching';

import { listMyGroupChannels } from '@/lib/sendbird/client';

type ChatRoom = {
  group_id: string;
  channel_url: string; // 예: match_4JM1S2 (서비스 식별자일 수도)
  chat_code: string; // ✅ joinChat에 넣는 값
  matched_slot: { date: string; hour: number };
  restaurant: { id: string; name: string };
  member_count: number;
  members: { user_id: string; name: string; profile_image?: string }[];
  status: string;
  created_at: string;
};

// ✅ reviews/pending 쪽에서 모달에 필요한 필드(너 기존 타입)
export type PendingSlot = {
  group_id: string; // ⚠️ 여기서는 "code"였다고 했었음 (백 스펙 주의)
  round_id: string;
  matched_slot: { date: string; hour: number };
  restaurant_name: string;
  members: { user_id: string; name: string }[];
  has_reviewed: boolean;
  member_count: number;
  common_interests: string[];
  student_years_text: string;
  personality_text: string;
};

// --------------------
// util
// --------------------
function getAppointmentDateByRoom(room: ChatRoom) {
  const { date, hour } = room.matched_slot;
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, hour, 0, 0);
}

function getStatusByRoom(room: ChatRoom, myId: string): 'default' | 'match' {
  const now = new Date();
  const appointment = getAppointmentDateByRoom(room);

  const isTimePassed = now >= appointment;
  const isParticipant = (room.members ?? []).some((m) => m.user_id === myId);

  return isTimePassed && isParticipant ? 'match' : 'default';
}

function formatSlotTitleFromDateHour(date: string, hour: number) {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d, hour, 0, 0);

  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  const weekday = dt.toLocaleDateString('ko-KR', { weekday: 'short' });
  const hh = String(dt.getHours()).padStart(2, '0');

  return `${month}/${day} ${weekday} ${hh}:00`;
}

function extractLastMessageText(last: any): string | null {
  if (!last) return null;
  if (typeof last.message === 'string') return last.message;
  if (last.url) return '[파일]';
  return null;
}

export default function MatchingListSection() {
  const router = useRouter();
  const { me, isLoaded } = useUser();

  const [tick, setTick] = useState(0);

  // ✅ list는 chat/rooms
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // ✅ modal은 reviews/pending
  const [pending, setPending] = useState<PendingSlot[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedPending, setSelectedPending] = useState<PendingSlot | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const enteringRef = useRef(false);

  // ✅ sendbird meta: channel_url로 매칭 (match_... 형태일 때 잘 맞음)
  const [sbMetaByChannelUrl, setSbMetaByChannelUrl] = useState<
    Record<
      string,
      {
        memberCount: number;
        unreadCount: number;
        lastMessageText: string | null;
        lastChatAtMs: number;
      }
    >
  >({});

  // -------------------------
  // 1) list: /chat/rooms
  // -------------------------
  useEffect(() => {
    if (!isLoaded || !me?.id) return;

    let cancelled = false;

    (async () => {
      setRoomsLoading(true);
      try {
        const res = await getChatRooms();
        if (!cancelled) setRooms((res?.rooms ?? []) as ChatRoom[]);
      } catch (e) {
        console.error('Failed to load /chat/rooms:', e);
        if (!cancelled) setRooms([]);
      } finally {
        if (!cancelled) setRoomsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id, tick]);

  // -------------------------
  // 2) modal data: /reviews/pending
  // -------------------------
  useEffect(() => {
    if (!isLoaded || !me?.id) return;

    let cancelled = false;

    (async () => {
      setPendingLoading(true);
      try {
        const list = await fetchPendingMatches();
        if (!cancelled) setPending((list ?? []) as any);
      } catch (e) {
        console.error('Failed to load pending:', e);
        if (!cancelled) setPending([]);
      } finally {
        if (!cancelled) setPendingLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id, tick]);

  // -------------------------
  // 3) sendbird meta
  // -------------------------
  useEffect(() => {
    if (!isLoaded || !me?.id) return;

    let cancelled = false;

    (async () => {
      try {
        const channels = await listMyGroupChannels({
          userId: me.id,
          nickname: me.name,
        });

        const map: Record<string, any> = {};
        for (const ch of channels ?? []) {
          const url = String(ch.url ?? '');
          if (!url) continue;

          const lastText = extractLastMessageText(ch.lastMessage);
          const lastChatAtMs =
            typeof ch.lastMessage?.createdAt === 'number'
              ? ch.lastMessage.createdAt
              : typeof ch.createdAt === 'number'
                ? ch.createdAt
                : 0;

          map[url] = {
            memberCount: Number(ch.memberCount ?? 0),
            unreadCount: Number(ch.unreadMessageCount ?? 0),
            lastMessageText: lastText,
            lastChatAtMs,
          };
        }

        if (!cancelled) setSbMetaByChannelUrl(map);
      } catch (e) {
        console.error('Failed to load sendbird meta:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id, tick]);

  // -------------------------
  // ✅ 모달 열기: room 기준으로 pending 매칭해서 상세 보여주기
  // -------------------------
  const openDetail = (room: ChatRoom) => {
    setSelectedRoom(room);

    // pending에서 "이 방"에 해당하는 슬롯 찾기
    // ✅ 우선순위:
    // 1) date/hour 동일 + restaurantName 동일
    // 2) 멤버 구성 일부라도 겹치면 우선
    const found =
      pending.find(
        (p) =>
          p.matched_slot?.date === room.matched_slot?.date &&
          p.matched_slot?.hour === room.matched_slot?.hour &&
          String(p.restaurant_name ?? '') ===
            String(room.restaurant?.name ?? ''),
      ) ??
      pending.find((p) => {
        if (
          p.matched_slot?.date !== room.matched_slot?.date ||
          p.matched_slot?.hour !== room.matched_slot?.hour
        )
          return false;

        const roomMemberIds = new Set(
          (room.members ?? []).map((m) => m.user_id),
        );
        return (p.members ?? []).some((m) => roomMemberIds.has(m.user_id));
      }) ??
      null;

    setSelectedPending(found);
    setIsModalVisible(true);
  };

  // -------------------------
  // ✅ enterChat: chat_code로 joinChat → 응답 channel_url로 이동
  // -------------------------
  const enterChat = async (room: ChatRoom) => {
    if (!me?.id) return;
    if (loading) return;
    if (enteringRef.current) return;

    enteringRef.current = true;
    setLoading(true);

    try {
      const res = await joinChat({
        code: room.chat_code, // ✅ 핵심
        user_id: me.id,
        nickname: me.name,
      });

      const channelUrl = String(res?.channel_url ?? '');
      router.push(
        `/chat/${encodeURIComponent(channelUrl || room.channel_url)}`,
      );
    } catch (e) {
      console.error('Failed to enter chat:', e);
      router.push(`/chat/${encodeURIComponent(room.channel_url)}`);
    } finally {
      setLoading(false);
      enteringRef.current = false;
    }
  };

  // ✅ 정렬: 최근 메시지 순(없으면 created_at 기반)
  const sortedRooms = useMemo(() => {
    const list = [...(rooms ?? [])];
    list.sort((a, b) => {
      const ma = sbMetaByChannelUrl[a.channel_url]?.lastChatAtMs ?? 0;
      const mb = sbMetaByChannelUrl[b.channel_url]?.lastChatAtMs ?? 0;
      if (ma !== mb) return mb - ma;
      return String(b.created_at).localeCompare(String(a.created_at));
    });
    return list;
  }, [rooms, sbMetaByChannelUrl]);

  const isListLoading = roomsLoading; // 리스트 스피너는 chat/rooms 기준(원하면 pendingLoading까지 OR 가능)

  return (
    <>
      <Section>
        {isLoaded && isListLoading ? (
          <LoadingWrapper>
            <Spinner />
          </LoadingWrapper>
        ) : rooms.length === 0 ? (
          <>
            <SectionTitle>이번주에 매칭된 방이 없습니다</SectionTitle>
            <EmptyStateContainer>
              <img
                src="/svgs/home/eating-logo-character-empty.svg"
                alt="empty-state"
                width={95}
                height={95}
              />
              <EmptyStateText>아직 매칭된 방이 없어요!</EmptyStateText>
            </EmptyStateContainer>
          </>
        ) : (
          <>
            <SectionTitle>
              이번주에 매칭된 방 <span>{rooms.length}개</span>
            </SectionTitle>

            <MatchingList>
              {sortedRooms.map((room) => {
                const meta = sbMetaByChannelUrl[room.channel_url];
                const current = meta?.memberCount ?? room.members?.length ?? 0;
                const total = room.member_count;

                return (
                  <MatchingListItem
                    key={room.channel_url}
                    status={getStatusByRoom(room, me?.id)}
                    date={room.matched_slot.date}
                    hour={room.matched_slot.hour}
                    currentCount={current}
                    totalCount={total}
                    onDetailClick={() => openDetail(room)}
                    onChatClick={() => enterChat(room)}
                    clickable
                  />
                );
              })}
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
          <ModalMainText>
            {selectedRoom
              ? formatSlotTitleFromDateHour(
                  selectedRoom.matched_slot.date,
                  selectedRoom.matched_slot.hour,
                )
              : ''}
          </ModalMainText>

          {/* ✅ 모달 상세는 /reviews/pending 기반 */}
          {selectedPending ? (
            <ModalSubText>
              {selectedPending.student_years_text},{' '}
              {selectedPending.personality_text}
            </ModalSubText>
          ) : (
            <ModalSubText>
              {/* pending 아직 로딩중이거나 매칭 실패했을 때 */}
              {pendingLoading
                ? '상세 정보를 불러오는 중...'
                : '상세 정보를 찾지 못했어요.'}
            </ModalSubText>
          )}

          {/* ✅ 식당명도 같이 */}
          {selectedRoom?.restaurant?.name && (
            <ModalRestaurantText>
              📍 {selectedRoom.restaurant.name}
            </ModalRestaurantText>
          )}
        </div>

        <TagsContainer>
          {(selectedPending?.common_interests ?? []).map((interest, idx) => (
            <BaseChip key={idx} label={interest} />
          ))}
        </TagsContainer>

        <ParticipantsInfoContainer>
          <ParticipantsInfoText>
            총 정원 {selectedRoom?.member_count ?? 0}명
          </ParticipantsInfoText>
          <ParticipantsInfoText>
            입장 인원{' '}
            {selectedRoom
              ? (sbMetaByChannelUrl[selectedRoom.channel_url]?.memberCount ??
                selectedRoom.members?.length ??
                0)
              : 0}
            명
          </ParticipantsInfoText>
        </ParticipantsInfoContainer>

        <ModalButtonContainer>
          <Button
            $variant="enter"
            onClick={() => selectedRoom && enterChat(selectedRoom)}
            disabled={loading}
            style={{ fontSize: '14px' }}
          >
            입장하기
          </Button>
        </ModalButtonContainer>
      </BaseModal>
    </>
  );
}

// --------------------
// styles (너 원래 그대로)
// --------------------
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

const ModalRestaurantText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  font-weight: 500;
  color: #8a8a8a;
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
  padding: 35px 0;
`;

const EmptyStateText = styled.p`
  font-size: 20px;
  font-weight: 400;
  font-family: var(--font-empty);
  color: #bdbdbd;
`;

const LoadingWrapper = styled.div`
  height: 150px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #ff5900;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
