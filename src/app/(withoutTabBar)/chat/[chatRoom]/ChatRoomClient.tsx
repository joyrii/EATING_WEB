'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useParams, useRouter } from 'next/navigation';

import ChatMessage, {
  type ChatMessageData,
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

export default function ChatRoomClient() {
  const params = useParams<{ chatRoom: string }>();
  const roomId = params?.chatRoom ? decodeURIComponent(params.chatRoom) : ''; // channelUrl

  const { me, isLoaded } = useUser();
  const router = useRouter();

  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const handlerIdRef = useRef<string>('');
  const channelRef = useRef<any>(null);

  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [iceBreakingModalOpen, setIceBreakingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<null | {
    id: number;
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
        router.push(`/chat/${encodeURIComponent(roomId)}/cafe`);
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
    setMessages(list);
  };

  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;

    let cancelled = false;

    const run = async () => {
      try {
        await ensureSendbirdConnected(me.id, me.name);
        const sb = getSendbirdInstance();

        const channel = await sb.groupChannel.getChannel(roomId);
        channelRef.current = channel;

        // 과거 메시지 로드
        await fetchMessages();

        // 실시간 핸들러
        const safeId = btoa(unescape(encodeURIComponent(roomId))).slice(0, 40);
        const handlerId = `room-${safeId}`;
        handlerIdRef.current = handlerId;

        const handler = new GroupChannelHandler({
          onMessageReceived: (ch, message) => {
            if (ch.url !== roomId) return;
            setMessages((prev) => [...prev, message as BaseMessage]);
          },
        });

        sb.groupChannel.addGroupChannelHandler(handlerId, handler);

        // 읽음 처리
        try {
          channel.markAsRead?.();
        } catch {}
      } catch (e) {
        console.error('Failed to init chat room:', e);
        if (!cancelled) setMessages([]);
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
  }, [isLoaded, me?.id, me?.name, roomId]);

  useEffect(() => {
    const onRefresh = () => {
      fetchMessages();
    };

    window.addEventListener('chat:refresh', onRefresh);
    return () => {
      window.removeEventListener('chat:refresh', onRefresh);
    };
  }, []);

  const uiMessages: ChatMessageData[] = useMemo(() => {
    if (!me?.id) return [];
    return messages
      .map((m) => toChatMessageData(m, me.id))
      .filter(Boolean) as ChatMessageData[];
  }, [messages, me?.id]);

  const hasMessages = uiMessages.length > 0;

  return (
    <div style={{ paddingBottom: '60px' }}>
      {hasMessages ? (
        uiMessages.map((message, index) => {
          const currentDateKey = getDateKey(message.createdAt);
          const prevDateKey =
            index > 0 ? getDateKey(uiMessages[index - 1].createdAt) : null;

          const showDateDivider = index === 0 || currentDateKey !== prevDateKey;

          const isGroupFirst = isFirstOfGroup(uiMessages, index);
          const isGroupLast = isLastOfGroup(uiMessages, index);

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
        <EmptyStateText>아직 채팅이 없어요!</EmptyStateText>
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
    </div>
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
    senderId: undefined,
    senderName: sender?.nickname,
    profileImageUrl:
      sender?.profileUrl && sender.profileUrl.trim().length > 0
        ? sender.profileUrl
        : undefined,
    content: text,
    createdAt: new Date(m.createdAt).toISOString(),
  };
}

// createdAt 파싱
function formatChatTime(createdAt: string) {
  const d = new Date(createdAt);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// 날짜 구분선 기준 키
function getDateKey(createdAt: string) {
  const d = new Date(createdAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 날짜 구분선 표시
export function formatDateDivider(createdAt: string) {
  const d = new Date(createdAt);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 같은 사용자의 마지막 메시지
function getSenderKey(m: ChatMessageData) {
  if (m.senderType === 'system') return 'system';
  return `${m.senderType}:${m.senderId ?? m.senderName ?? 'unknown'}`;
}

function isLastOfGroup(messages: ChatMessageData[], index: number) {
  const current = messages[index];
  const next = messages[index + 1];
  if (!next) return true;

  const sameDay = getDateKey(next.createdAt) === getDateKey(current.createdAt);
  if (!sameDay) return true;

  // 1분 이상 시간 차이 있으면 다른 그룹으로 간주
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
