import { Section, SectionTitle, MatchingList, Button } from './style';
import styled from 'styled-components';
import MatchingListItem from './MatchingListItem';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import MatchingDetailModal from './MatchingDetailModal';

import {
  fetchPendingMatches,
  getChatRooms,
  joinChat,
  type PendingMatch,
} from '@/api/matching';

import { listMyGroupChannels } from '@/lib/sendbird/client';
import { ChatRoomInfo } from '@/type/chat';

export type PendingSlot = {
  group_id: string;
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

function getAppointmentDateByRoom(room: ChatRoomInfo) {
  const { date, hour } = room.matched_slot;
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, hour, 0, 0);
}

function getStatusByRoom(
  room: ChatRoomInfo,
  myId: string,
): 'default' | 'match' {
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

  // list: chat/rooms
  const [rooms, setRooms] = useState<ChatRoomInfo[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // modal: reviews/pending
  const [pending, setPending] = useState<PendingSlot[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomInfo | null>(null);
  const [selectedPending, setSelectedPending] = useState<PendingSlot | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const enteringRef = useRef(false);

  // sendbird meta: channel_url로 매칭
  const [sbMetaByChannelUrl, setSbMetaByChannelUrl] = useState<
    Record<
      string,
      {
        memberCount: number;
        joinedMemberCount: number;
        unreadCount: number;
        lastMessageText: string | null;
        lastChatAtMs: number;
      }
    >
  >({});

  const selectedJoinedCount = selectedRoom
    ? (sbMetaByChannelUrl[selectedRoom.channel_url]?.joinedMemberCount ?? 0)
    : 0;

  // 1) list: /chat/rooms

  useEffect(() => {
    if (!isLoaded || !me?.id) return;
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [isLoaded, me?.id]);

  useEffect(() => {
    if (!isLoaded || !me?.id) return;

    let cancelled = false;

    (async () => {
      setRoomsLoading(true);
      try {
        const res = await getChatRooms();
        if (!cancelled) setRooms((res?.rooms ?? []) as ChatRoomInfo[]);
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
  }, [isLoaded, me?.id]);

  // 2) modal data: /reviews/pending
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
  }, [isLoaded, me?.id]);

  // 3) sendbird meta
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
            joinedMemberCount: Number((ch as any).joinedMemberCount ?? 0),
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
  }, [isLoaded, me?.id]);

  // 모달 열기: room 기준으로 pending 매칭해서 상세 보여주기
  const openDetail = (room: ChatRoomInfo) => {
    setSelectedRoom(room);

    const found =
      pending.find((p) => String(p.group_id) === String(room.group_id)) ?? null;

    setSelectedPending(found);
    setIsModalVisible(true);
  };

  // enterChat: chat_code로 joinChat → 응답 channel_url로 이동
  const enterChat = async (room: ChatRoomInfo) => {
    if (!me?.id) return;
    if (loading) return;
    if (enteringRef.current) return;

    enteringRef.current = true;
    setLoading(true);

    try {
      const res = await joinChat({
        code: room.chat_code,
        user_id: me.id,
        nickname: me.name,
      });

      const channelUrl = String(res?.channel_url ?? '');
      console.log('joinChat response:', res);
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

  const isListLoading = roomsLoading;

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
                const current = meta?.joinedMemberCount ?? 0;
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
                    onReviewClick={() => {
                      if (getStatusByRoom(room, me?.id) !== 'match') return;
                      router.replace(`/feedback?group_id=${room.group_id}`);
                    }}
                    clickable
                  />
                );
              })}
            </MatchingList>
          </>
        )}
      </Section>
      <MatchingDetailModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedRoom={selectedRoom}
        selectedPending={selectedPending}
        pendingLoading={pendingLoading}
        sbJoinedMemberCount={selectedJoinedCount}
        loading={loading}
        onEnter={(room) => enterChat(room)}
      />
    </>
  );
}

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
