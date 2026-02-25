'use client';

import styled from 'styled-components';
import { getRestaurantById, getRestaurants } from '@/api/application';
import {
  getChatRooms,
  getIceBreakingQuestions,
  joinChat,
} from '@/api/matching';
import ChatMessage, {
  CafeListPayload,
  ChatAction,
  ChatMessageData,
  RestaurantPayload,
} from '@/components/chat/ChatMessage';
import { useUser } from '@/context/userContext';
import { toKstIso } from '@/lib/sendbird/channelMeta';
import {
  ensureSendbirdConnected,
  getSendbirdInstance,
} from '@/lib/sendbird/client';
import { ChatRoomInfo } from '@/type/chat';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { AdminMessage, BaseMessage } from '@sendbird/chat/message';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import RestaurantModal from '@/components/chat/RestaurantModal';
import IceBreakingModal from '@/components/chat/IceBreakingModal';
import ProfileModal from '@/components/chat/ProfileModal';

// 기본 프로필 이미지 설정 (모든 사용자)
const DEFAULT_PROFILE_IMAGE_URL = '/images/chat/profile-default-3.png';
function setDefaultProfileImage(url?: string) {
  return url && url.trim() !== '' ? url : DEFAULT_PROFILE_IMAGE_URL;
}

export default function ChatRoomClient({
  roomInfo,
}: {
  roomInfo: ChatRoomInfo;
}) {
  const router = useRouter();

  // 채팅방 ID
  const params = useParams<{ chatRoom: string }>();
  const roomId = params?.chatRoom ? decodeURIComponent(params.chatRoom) : '';

  // 내 정보
  const { me, isLoaded } = useUser();

  // 채팅방 메타 정보 상태
  const [roomMeta, setRoomMeta] = useState<ChatRoomInfo | null>(null);
  const [appointmentAtISO, setAppointmentAtISO] = useState<string>(''); // 카페 리스트 할인 시간 설정용

  // 채팅 내용 가져오기
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  // refs
  const channelRef = useRef<any>(null);
  const handlerIdRef = useRef('');
  const seenMessageIdsRef = useRef<Set<string>>(new Set());
  const restaurantCacheRef = useRef<Map<string, RestaurantPayload>>(new Map());
  const selectedRestaurantCacheRef = useRef<RestaurantPayload | null>(null);
  const cafeListCacheRef = useRef<CafeListPayload | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 모달
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [iceBreakingTopics, setIceBreakingTopics] = useState<string[]>([]);
  const [iceBreakingModalOpen, setIceBreakingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Location Info
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantPayload | null>(null);
  // Cafe List
  const [cafes, setCafes] = useState<CafeListPayload | null>(null);

  // 채팅방 메타 정보 가져오기
  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await getChatRooms();
        const found =
          (res?.rooms ?? []).find(
            (r) => String(r.channel_url) === String(roomId),
          ) ?? null; // 현재 채팅방

        if (cancelled) return;

        setRoomMeta(found); // 채팅방 메타 정보 상태 업데이트

        if (found) {
          setAppointmentAtISO(
            toKstIso(found.matched_slot?.date, found.matched_slot?.hour),
          );
        } else {
          // 채팅방 정보가 없는 경우
          router.replace('/matching');
        }
      } catch (error) {
        console.error('Failed to fetch chat rooms', error);
        if (!cancelled) {
          setRoomMeta(null);
          router.replace('/matching');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id, roomId]);

  // 매장 정보 가져오기
  useEffect(() => {
    const id = roomMeta?.restaurant?.id;
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await getRestaurants();
        const found = res.find((r) => String(r.id) === String(id)) ?? null;
        if (!found) return null;

        const data = await getRestaurantById(String(id));

        const restaurantData: RestaurantPayload = {
          id: found.id,
          name: found.name,
          category: found.category,
          benefit: data.promotion,
          menu: found.menu_items[0].name,
          imageUrl: found.image_url,
        };

        if (!cancelled) {
          restaurantCacheRef.current.set(String(id), restaurantData);
          setSelectedRestaurant(restaurantData);
          selectedRestaurantCacheRef.current = restaurantData;
        }
      } catch (error) {
        console.error('Failed to build restaurant payload', error);
        return null;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomMeta?.restaurant?.id]);

  // 카페 정보 불러오기
  async function primeCafeList() {
    if (cafeListCacheRef.current?.cafes?.length) return;

    const restaurants = await getRestaurants();
    const cafes = (restaurants ?? [])
      .filter((r) => r.category === '카페')
      .map((r) => ({ id: r.id, name: r.name }))
      .slice(0, 3);

    const cafeData: CafeListPayload = {
      cafes,
      redirectUrl: `/chat/${encodeURIComponent(roomId)}/cafe`,
    };

    cafeListCacheRef.current = cafeData;
    setCafes(cafeData);
  }

  // safe parse
  function safeParse(raw: any) {
    try {
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }

  // Sendbird -> UI
  function renderMessage(
    message: BaseMessage,
    myUserId: string,
  ): ChatMessageData {
    const createdAtISO = new Date(message.createdAt).toISOString();

    // 시스템 메시지
    if (message.isAdminMessage()) {
      return {
        id: String((message as any).messageId ?? createdAtISO),
        senderType: 'system',
        messageType: 'text',
        content: (message as any).message ?? '',
        createdAt: createdAtISO,
      };
    }

    // 유저 메시지
    const sender = (message as any).sender;
    const senderId: string | undefined = sender?.userId;
    const senderName: string | undefined = sender?.nickname;
    const senderProfileUrl = setDefaultProfileImage(sender?.profileUrl);
    const isMe = senderId === myUserId;

    return {
      id: String((message as any).messageId ?? createdAtISO),
      senderType: isMe ? 'user' : 'other',
      senderId,
      senderName,
      profileImageUrl: senderProfileUrl,
      messageType: 'text',
      content: (message as any).message ?? '',
      createdAt: createdAtISO,
    };
  }

  // 메시지 1개 처리
  const processIncomingMessage = async (message: BaseMessage) => {
    if (!me?.id) return;

    const key = String(
      (message as any).messageId ??
        (message as any).reqId ??
        (message as any).createdAt ??
        '',
    );
    if (key && seenMessageIdsRef.current.has(key)) return;
    if (key) seenMessageIdsRef.current.add(key);

    const createdAtISO = new Date(
      (message as any).createdAt ?? Date.now(),
    ).toISOString();

    // 시스템 메시지
    if (message.isAdminMessage()) {
      const admin = message as AdminMessage;
      const data = safeParse((admin as any).data);

      // 카드형
      if ((admin as any).customType === 'SYSTEM_CARD') {
        // 카페 리스트 예외
        if (data?.type === 'cafe_recommend') {
          const textMsg: ChatMessageData = {
            id: String((admin as any).messageId ?? createdAtISO),
            senderType: 'system',
            messageType: 'text',
            content: (admin as any).message ?? '',
            createdAt: createdAtISO,
          };
          let payload: CafeListPayload | null =
            cafes ?? cafeListCacheRef.current ?? null;

          if (payload) cafeListCacheRef.current = payload;

          const next: ChatMessageData[] = [textMsg];

          if (payload?.cafes && payload?.redirectUrl) {
            next.push({
              id: `card-${String((admin as any).messageId ?? createdAtISO)}`,
              senderType: 'system',
              messageType: 'cafeList',
              payload,
              createdAt: new Date(
                new Date(createdAtISO).getTime() + 1,
              ).toISOString(),
            });
          }

          setMessages((prev) => [...prev, ...next]);
          return;
        }

        const mapped: ChatMessageData = {
          id: String((admin as any).messageId ?? createdAtISO),
          senderType: 'system',
          messageType: 'actionCard',
          payload: {
            cardType: data.type,
            body: String(data.body ?? ''),
            button: {
              label: String(data.button?.label ?? ''),
              url: String(data.button?.url ?? ''),
            },
          } as any,
          createdAt: createdAtISO,
        };
        setMessages((prev) => [...prev, mapped]);
        return;
      }

      // location 카드형 (텍스트 + 매장 카드)
      if (
        (admin as any).customType === 'SYSTEM_TEXT' &&
        data?.type === 'location'
      ) {
        // (A) 텍스트 버블
        const textMsg: ChatMessageData = {
          id: String((admin as any).messageId ?? createdAtISO),
          senderType: 'system',
          messageType: 'text',
          content: (admin as any).message ?? '',
          createdAt: createdAtISO,
        };

        // (B) restaurant 카드
        let payload: RestaurantPayload | null = null;

        if (data?.restaurant_id) {
          payload = selectedRestaurantCacheRef.current;

          if (payload) setSelectedRestaurant(payload);
          selectedRestaurantCacheRef.current = payload;
        } else {
          payload = selectedRestaurantCacheRef.current;
        }

        const next: ChatMessageData[] = [textMsg];

        if (payload?.id && payload?.name) {
          next.push({
            id: `card-${String((admin as any).messageId ?? createdAtISO)}`,
            senderType: 'system',
            messageType: 'restaurant',
            payload,
            createdAt: new Date(
              new Date(createdAtISO).getTime() + 1,
            ).toISOString(),
          });
        }

        setMessages((prev) => [...prev, ...next]);
        return;
      }

      // 기타 시스템 메시지
      setMessages((prev) => [...prev, renderMessage(message, me.id)]);
      return;
    }

    // 유저 메시지
    setMessages((prev) => [...prev, renderMessage(message, me.id)]);
  };

  // 초기화 및 메시지 수신 핸들러
  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;
    let cancelled = false;

    // 초기화
    seenMessageIdsRef.current = new Set();
    setMessages([]);

    const run = async () => {
      try {
        await ensureSendbirdConnected(me.id, me.name);
        await primeCafeList();
        const sb = getSendbirdInstance();

        let channelUrlToOpen = roomId;
        let channel: any = null;

        // 채널 열기 시도
        try {
          channel = await sb.groupChannel.getChannel(channelUrlToOpen);
        } catch (err: any) {
          const msg = String(err?.message ?? '').toLowerCase();

          // 채널을 찾을 수 없는 경우
          if (msg.includes('channel') && msg.includes('not found')) {
            const code = roomMeta?.chat_code;
            if (!code) throw err;

            const joinRes = await joinChat({
              code,
              user_id: me.id,
              nickname: me.name,
            });
            const realUrl = String(joinRes.channel_url ?? '');
            if (!realUrl) throw err;

            if (realUrl !== roomId) {
              router.replace(`/chat/${encodeURIComponent(realUrl)}`);
              return;
            }

            channelUrlToOpen = realUrl;
            channel = await sb.groupChannel.getChannel(channelUrlToOpen);
          } else {
            throw err;
          }
        }

        if (cancelled) return;
        channelRef.current = channel;

        // 기존 메시지 로드
        const q = channel.createPreviousMessageListQuery({
          limit: 50,
          reverse: false,
        });
        const list = (await q.load()) as BaseMessage[];
        if (cancelled) return;
        for (const m of list) {
          if (cancelled) return;
          await processIncomingMessage(m);
        }

        // 새 메시지 수신 핸들러 등록
        const safeId = btoa(
          unescape(encodeURIComponent(channelUrlToOpen)),
        ).slice(0, 40);
        const handlerId = `handler-${safeId}`;
        handlerIdRef.current = handlerId;

        const handler = new GroupChannelHandler({
          onMessageReceived: (ch, msg) => {
            if (ch.url !== channelUrlToOpen) return;
            void processIncomingMessage(msg as BaseMessage);
            try {
              channelRef.current?.markAsRead?.();
            } catch {}
          },
        });

        sb.groupChannel.addGroupChannelHandler(handlerId, handler);

        try {
          channel.markAsRead?.();
        } catch {}
      } catch (error) {
        console.error('Failed to initialize chat room:', error);
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
      channelRef.current = null;
    };
  }, [isLoaded, me?.id, me?.name, roomId, roomMeta?.chat_code]);

  // 새 메시지 이벤트 리스너
  useEffect(() => {
    const onNew = (e: any) => {
      const message = e?.detail?.message;
      if (!message) return;
      void processIncomingMessage(message as BaseMessage);
    };

    window.addEventListener('chat:new-message', onNew);
    return () => window.removeEventListener('chat:new-message', onNew);
  }, [roomId, me?.id]);

  // Action Handler
  const handleAction = (action: ChatAction) => {
    switch (action.type) {
      case 'OPEN_RESTAURANT':
        // 식당 정보 모달 열기
        break;
      case 'OPEN_PROFILE':
        // 프로필 모달 열기
        break;
      case 'OPEN_CAFE_LIST':
        router.push(
          action.payload.redirectUrl +
            (appointmentAtISO
              ? `?appointmentAt=${encodeURIComponent(appointmentAtISO)}`
              : ''),
        );
        break;
      case 'NAVIGATE':
        router.push((action as any).url);
      default:
        break;
    }
  };

  // 메시지 정렬 및 그룹핑
  const merged = useMemo(() => {
    const all = [...messages];
    all.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return all;
  }, [messages]);

  // 아이스 브레이킹 주제
  useEffect(() => {
    (async () => {
      try {
        const res = await getIceBreakingQuestions();
        setIceBreakingTopics(res.map((q) => q.question));
      } catch (error) {
        console.error('Failed to fetch ice breaking questions:', error);
      }
    })();
  }, []);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [merged.length]);

  return (
    <Wrapper>
      {merged.length > 0 ? (
        merged.map((msg, idx) => {
          const currentDateKey = getDateKey(msg.createdAt);
          const prevDateKey =
            idx > 0 ? getDateKey(merged[idx - 1].createdAt) : null;
          const showDateDivider = idx === 0 || currentDateKey !== prevDateKey;

          const isGroupFirst = isFirstOfGroup(merged, idx);
          const isGroupLast = isLastOfGroup(merged, idx);

          const showSenderName =
            isGroupFirst &&
            (msg.senderType === 'other' || msg.senderType === 'system');
          const showProfileImage =
            isGroupFirst &&
            (msg.senderType === 'other' || msg.senderType === 'system');
          const showCreatedAt = isGroupLast;

          return (
            <div key={msg.id}>
              {showDateDivider && (
                <DateDivider>{formatDateDivider(msg.createdAt)}</DateDivider>
              )}
              <ChatMessage
                {...msg}
                roomId={roomId}
                createdAtText={formatChatTime(msg.createdAt)}
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
          아직 대화가 없습니다. 첫 메시지를 보내보세요!
        </EmptyStateText>
      )}

      <div ref={bottomRef} />

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
        topics={iceBreakingTopics}
      />
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </Wrapper>
  );
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

  const diffMs =
    new Date(current.createdAt).getTime() - new Date(prev.createdAt).getTime();
  if (diffMs > 60 * 1000) return true;

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

// ---- DEBUG UI ----
const DebugPanel = styled.div`
  position: fixed;
  left: 12px;
  right: 12px;
  top: 70px;
  z-index: 50;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  display: grid;
  gap: 10px;
`;

const DebugTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const DebugInfo = styled.div`
  font-size: 12px;
  opacity: 0.95;
  display: grid;
  gap: 8px;

  strong {
    font-weight: 800;
  }
`;

const DebugInput = styled.input`
  width: 100%;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0 10px;
  outline: none;
`;

const DebugButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const DebugButton = styled.button`
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
`;

const DebugButtonDanger = styled.button`
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  background: #ff4d4f;
  color: #fff;
`;
