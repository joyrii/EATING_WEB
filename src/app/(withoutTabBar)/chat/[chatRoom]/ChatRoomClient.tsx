'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useParams, useRouter } from 'next/navigation';

import ChatMessage, {
  type ChatMessageData,
  CafeListPayload,
  ChatAction,
} from '@/components/chat/ChatMessage';
import IceBreakingModal from '@/components/chat/IceBreakingModal';
import RestaurantModal from '@/components/chat/RestaurantModal';
import ProfileModal from '@/components/chat/ProfileModal';

import { useUser } from '@/context/userContext';
import {
  ensureSendbirdConnected,
  getSendbirdInstance,
} from '@/lib/sendbird/client';

import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type { BaseMessage } from '@sendbird/chat/message';

import { fetchPendingMatches, type PendingMatch } from '@/api/matching';
import { ensureChannelMeta, toKstIso } from '@/lib/sendbird/channelMeta';
import { getAutoSystemMessage } from '@/lib/sendbird/autoSystemMessage';
import { getRestaurants } from '@/api/application';

const DEFAULT_PROFILE_URL = [
  '/images/chat/profile-default-1.png',
  '/images/chat/profile-default-2.png',
  '/images/chat/profile-default-3.png',
] as const;

function pickDefaultProfileUrlByUserId(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++)
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return DEFAULT_PROFILE_URL[hash % DEFAULT_PROFILE_URL.length];
}

export default function ChatRoomClient() {
  const params = useParams<{ chatRoom: string }>();
  const roomId = params?.chatRoom ? decodeURIComponent(params.chatRoom) : ''; // channelUrl

  const { me, isLoaded } = useUser();
  const router = useRouter();

  const [sbMessages, setSbMessages] = useState<BaseMessage[]>([]);
  const channelRef = useRef<any>(null);
  const handlerIdRef = useRef('');

  const [pending, setPending] = useState<PendingMatch[]>([]);
  const [appointmentAtISO, setAppointmentAtISO] = useState<string>('');
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [cafesPayload, setCafesPayload] = useState<CafeListPayload | null>(
    null,
  );

  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [iceBreakingModalOpen, setIceBreakingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] = useState<null | {
    id: string;
    name: string;
    category: string;
    benefit: string;
    menu: string;
    imageUrl: string;
  }>(null);

  const handleAction = (action: ChatAction) => {
    switch (action.type) {
      case 'OPEN_RESTAURANT':
        setSelectedRestaurant(action.payload);
        setRestaurantModalOpen(true);
        break;
      case 'OPEN_CAFE_LIST':
        router.push(action.payload.redirectUrl);
        break;
      case 'OPEN_PROFILE':
        setProfileModalOpen(true);
        break;
      default:
        break;
    }
  };

  const fetchMessages = async () => {
    const channel = channelRef.current;
    if (!channel) return;

    const prevQuery = channel.createPreviousMessageListQuery({
      limit: 50,
      reverse: false,
    });
    const list = (await prevQuery.load()) as BaseMessage[];
    setSbMessages(list);
  };

  // 카페 정보 가져오기
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const restaurants = await getRestaurants();
        const cafes = (restaurants ?? [])
          .filter((r: any) => String(r.category).toLowerCase() === '카페')
          .map((r: any) => ({
            id: String(r.id),
            name: String(r.name),
          }))
          .slice(0, 3); // 최대 3개

        const payload: CafeListPayload = {
          cafes,
          redirectUrl: `/chat/${encodeURIComponent(roomId)}/cafe`,
        };

        if (!cancelled) setCafesPayload(payload);
      } catch (e) {
        console.error('Failed to load cafes:', e);

        if (!cancelled)
          setCafesPayload({
            cafes: [],
            redirectUrl: `/chat/${encodeURIComponent(roomId)}/cafe`,
          });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  // pending 로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchPendingMatches();
        if (!cancelled) setPending(list);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // sendbird init + channel + messages + handler + meta/appointment 계산
  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;

    let cancelled = false;

    const run = async () => {
      try {
        await ensureSendbirdConnected(me.id, me.name);
        const sb = getSendbirdInstance();

        const channel = await sb.groupChannel.getChannel(roomId);
        channelRef.current = channel;

        await fetchMessages();

        // appointment 계산 (channel.data 우선, 없으면 pending으로 보정)
        if (pending.length > 0) {
          const meta = await ensureChannelMeta(channel, pending);
          if (meta && !cancelled) {
            setAppointmentAtISO(
              toKstIso(meta.matched_slot.date, meta.matched_slot.hour),
            );
            setRestaurantName(meta.restaurant_name ?? '');
          }
        }

        const safeId = btoa(unescape(encodeURIComponent(roomId))).slice(0, 40);
        const handlerId = `room-${safeId}`;
        handlerIdRef.current = handlerId;

        const handler = new GroupChannelHandler({
          onMessageReceived: (ch, message) => {
            if (ch.url !== roomId) return;
            setSbMessages((prev) => [...prev, message as BaseMessage]);
          },
        });

        sb.groupChannel.addGroupChannelHandler(handlerId, handler);

        try {
          channel.markAsRead?.();
        } catch {}
      } catch (e) {
        console.error('Failed to init chat room:', e);
        if (!cancelled) setSbMessages([]);
      }
    };

    run();

    return () => {
      cancelled = true;
      try {
        const sb = getSendbirdInstance();
        const id = handlerIdRef.current;
        if (id) sb.groupChannel.removeGroupChannelHandler(id);
      } catch {}
      handlerIdRef.current = '';
    };
  }, [isLoaded, me?.id, me?.name, roomId, pending]);

  // send 이후 강제 새로고침
  useEffect(() => {
    const onRefresh = () => fetchMessages();
    window.addEventListener('chat:refresh', onRefresh);
    return () => window.removeEventListener('chat:refresh', onRefresh);
  }, []);

  // sendbird → ui
  const uiMessages: ChatMessageData[] = useMemo(() => {
    if (!me?.id) return [];
    return sbMessages
      .map((m) => toChatMessageData(m, me.id))
      .filter(Boolean) as ChatMessageData[];
  }, [sbMessages, me?.id]);

  // auto system
  const systemMessages: ChatMessageData[] = useMemo(() => {
    if (!appointmentAtISO) return [];

    const restaurantPayload = restaurantName
      ? ({
          id: 0,
          name: restaurantName,
          category: '',
          benefit: '',
          menu: '',
          imageUrl: '',
        } as any)
      : undefined;

    return getAutoSystemMessage({
      roomId,
      appointmentAtISO,
      restaurant: restaurantPayload,
      cafes: cafesPayload ?? undefined,
    });
  }, [appointmentAtISO, restaurantName, roomId]);

  // merge + sort
  const merged: ChatMessageData[] = useMemo(() => {
    const all = [...uiMessages, ...systemMessages];
    all.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
    return all;
  }, [uiMessages, systemMessages]);

  return (
    <Wrapper>
      {merged.length > 0 ? (
        merged.map((message, index) => {
          const currentDateKey = getDateKey(message.createdAt);
          const prevDateKey =
            index > 0 ? getDateKey(merged[index - 1].createdAt) : null;
          const showDateDivider = index === 0 || currentDateKey !== prevDateKey;

          const isGroupFirst = isFirstOfGroup(merged, index);
          const isGroupLast = isLastOfGroup(merged, index);

          const showSenderName =
            isGroupFirst &&
            (message.senderType === 'other' || message.senderType === 'system');

          const showProfileImage =
            isGroupFirst &&
            (message.senderType === 'other' || message.senderType === 'system');

          const showCreatedAt = isGroupLast;

          return (
            <div key={message.id}>
              {showDateDivider && (
                <DateDivider>
                  {formatDateDivider(message.createdAt)}
                </DateDivider>
              )}

              <ChatMessage
                {...message}
                roomId={roomId}
                createdAtText={formatChatTime(message.createdAt)}
                showCreatedAt={showCreatedAt}
                showSenderName={showSenderName}
                showProfileImage={showProfileImage}
                onAction={handleAction}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateText>
          아직 채팅이 없어요! 먼저 채팅을 시작해보세요
        </EmptyStateText>
      )}

      <IceBreaking onClick={() => setIceBreakingModalOpen(true)}>
        <IceBreakingText>
          🧊 아이스브레이킹 주제 추천
          <img
            src="/svgs/chat/chevron-right.svg"
            alt="arrow"
            style={{ rotate: '-90deg' }}
          />
        </IceBreakingText>
      </IceBreaking>

      <RestaurantModal
        isOpen={restaurantModalOpen}
        onClose={() => setRestaurantModalOpen(false)}
        restaurant={selectedRestaurant}
      />
      <IceBreakingModal
        isOpen={iceBreakingModalOpen}
        onClose={() => setIceBreakingModalOpen(false)}
      />
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </Wrapper>
  );
}

function toChatMessageData(
  m: BaseMessage,
  myUserId: string,
): ChatMessageData | null {
  const text = (m as any).message;
  if (typeof text !== 'string') return null;

  const sender = (m as any).sender;
  const senderUserId: string | undefined = sender?.userId;
  const isMe = senderUserId === myUserId;

  return {
    id: String((m as any).messageId ?? `${m.createdAt}`),
    senderType: isMe ? 'user' : 'other',
    messageType: 'text',
    senderId: senderUserId,
    senderName: sender?.nickname,
    profileImageUrl:
      sender?.profileUrl && sender.profileUrl.trim().length > 0
        ? sender.profileUrl
        : pickDefaultProfileUrlByUserId(senderUserId ?? 'unknown'),
    content: text,
    createdAt: new Date(m.createdAt).toISOString(),
  };
}

function formatChatTime(createdAt: string) {
  const d = new Date(createdAt);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getDateKey(createdAt: string) {
  const d = new Date(createdAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateDivider(createdAt: string) {
  const d = new Date(createdAt);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getSenderKey(m: ChatMessageData) {
  if (m.senderType === 'system') return 'system';
  return `${m.senderType}:${m.senderId ?? m.senderName ?? 'unknown'}`;
}

// 같은 사람이지만 1분 이상 텀이면 그룹 끊기(너가 원한 이슈 해결)
function isLastOfGroup(messages: ChatMessageData[], index: number) {
  const current = messages[index];
  const next = messages[index + 1];
  if (!next) return true;

  const sameDay = getDateKey(next.createdAt) === getDateKey(current.createdAt);
  if (!sameDay) return true;

  const diffMs =
    new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime();
  if (diffMs > 60 * 1000) return true;

  return getSenderKey(next) !== getSenderKey(current);
}

function isFirstOfGroup(messages: ChatMessageData[], index: number) {
  const current = messages[index];
  const prev = messages[index - 1];
  if (!prev) return true;

  const sameDay = getDateKey(prev.createdAt) === getDateKey(current.createdAt);
  if (!sameDay) return true;

  return getSenderKey(prev) !== getSenderKey(current);
}

const Wrapper = styled.div`
  padding-bottom: 60px;
`;

const DateDivider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #8a8a8a;
  padding: 14px 0 10px;
`;

const IceBreaking = styled.button`
  width: 75%;
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f3f3f3;
  border: none;
  border-radius: 30px;
  padding: 10px;
`;

const IceBreakingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #575757;
`;

const EmptyStateText = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #8a8a8a;
`;
