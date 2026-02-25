'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import ChatMessage, {
  type ChatMessageData,
  type RestaurantPayload,
  type CafeListPayload,
  type ChatAction,
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

import { toKstIso } from '@/lib/sendbird/channelMeta';
import { getRestaurants, getRestaurantById } from '@/api/application';
import {
  getChatRooms,
  getIceBreakingQuestions,
  joinChat,
} from '@/api/matching';

const DEFAULT_PROFILE_URL = '/images/chat/profile-default-.png';

function pickDefaultProfileUrlByUserId(userId: string) {
  // ⚠️ 원본 로직 유지 (DEFAULT_PROFILE_URL이 배열이라면 그대로 동작)
  let hash = 0;
  for (let i = 0; i < userId.length; i++)
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return (DEFAULT_PROFILE_URL as any)[
    hash % (DEFAULT_PROFILE_URL as any).length
  ];
}

type ApiRoom = {
  group_id: string;
  channel_url: string; // 예: match_4JM1S2
  chat_code: string; // 예: 4JM1S2
  matched_slot: { date: string; hour: number };
  restaurant: { id: string; name: string };
  member_count: number;
  members: { user_id: string; name: string; profile_image?: string }[];
  status: string;
  created_at: string;
};

function extractLastMessageText(last: any): string {
  if (!last) return '';
  if (typeof last.message === 'string') return last.message;
  if (last.url) return '[파일]';
  return '';
}

export default function ChatRoomClient() {
  const params = useParams<{ chatRoom: string }>();
  const roomId = params?.chatRoom ? decodeURIComponent(params.chatRoom) : ''; // ✅ channel_url or sendbird url
  const searchParams = useSearchParams();
  const isSystemDebug = searchParams?.get('debug') === 'system';

  const { me, isLoaded } = useUser();
  const router = useRouter();

  const [sbMessages, setSbMessages] = useState<BaseMessage[]>([]);
  const [localSystemCards, setLocalSystemCards] = useState<ChatMessageData[]>(
    [],
  );

  const channelRef = useRef<any>(null);
  const handlerIdRef = useRef('');
  const handledSystemMessageIdsRef = useRef<Set<string>>(new Set());

  const [roomMeta, setRoomMeta] = useState<ApiRoom | null>(null);

  const [appointmentAtISO, setAppointmentAtISO] = useState<string>('');
  const [restaurantName, setRestaurantName] = useState<string>('');

  const [cafesPayload, setCafesPayload] = useState<CafeListPayload | null>(
    null,
  );

  // ✅ R5에서 사용할 "풀" payload
  const [restaurantPayload, setRestaurantPayload] =
    useState<RestaurantPayload | null>(null);

  // ✅ 디버그 fallback
  const [debugRestaurantName, setDebugRestaurantName] =
    useState<string>('학생식당');

  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [iceBreakingModalOpen, setIceBreakingModalOpen] = useState(false);
  const [iceBreakingTopics, setIceBreakingTopics] = useState<string[]>([]);
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
      case 'OPEN_CAFE_LIST':
        router.push(
          action.payload.redirectUrl +
            (appointmentAtISO
              ? `?appointmentAt=${encodeURIComponent(appointmentAtISO)}`
              : ''),
        );
        break;
      default:
        break;
    }
  };

  // -------------------------
  // ✅ 카페 정보 가져오기 (하드코딩 금지, 서버 기반)
  // -------------------------
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
          .slice(0, 3);

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

  // -------------------------
  // ✅ /chat/rooms 로드 → 현재 방 메타 세팅 (channel_url === roomId)
  // -------------------------
  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await getChatRooms();
        const rooms = (res?.rooms ?? []) as ApiRoom[];
        const found =
          rooms.find((r) => String(r.channel_url) === String(roomId)) ?? null;

        if (cancelled) return;

        setRoomMeta(found);

        if (found) {
          setAppointmentAtISO(
            toKstIso(found.matched_slot.date, found.matched_slot.hour),
          );
          setRestaurantName(found.restaurant?.name ?? '');
        } else {
          setAppointmentAtISO('');
          setRestaurantName('');
        }
      } catch (e) {
        console.error('Failed to load /chat/rooms meta:', e);
        if (!cancelled) {
          setRoomMeta(null);
          setAppointmentAtISO('');
          setRestaurantName('');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id, roomId]);

  // -------------------------
  // ✅ restaurant.id로 상세 조회 → RestaurantPayload 풀로 채움
  // 응답 스키마:
  // { id, name, category, promotion, image_url }
  // -------------------------
  useEffect(() => {
    if (!roomMeta?.restaurant?.id) {
      setRestaurantPayload(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await getRestaurantById(roomMeta.restaurant.id);

        const payload: RestaurantPayload = {
          id: String(data.id),
          name: String(data.name),
          category: String(data.category ?? ''),
          benefit: String(data.promotion ?? ''), // ✅ promotion → benefit
          menu: '', // 응답에 없으므로 빈값
          imageUrl: String(data.image_url ?? ''), // ✅ image_url → imageUrl
        };

        if (!cancelled) setRestaurantPayload(payload);
      } catch (e) {
        console.error('Failed to load restaurant detail:', e);

        // 실패해도 최소 정보는 유지 (카드는 뜨게)
        if (!cancelled) {
          setRestaurantPayload({
            id: String(roomMeta.restaurant.id),
            name: String(roomMeta.restaurant?.name ?? ''),
            category: '',
            benefit: '',
            menu: '',
            imageUrl: '',
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomMeta?.restaurant?.id]);

  // -------------------------
  // ✅ 공통: "메시지 1개 들어왔을 때" 처리
  // -------------------------
  const processIncomingMessage = (message: BaseMessage) => {
    setSbMessages((prev) => [...prev, message]);

    if (isBackendSystemMessage(message)) {
      // 디버그에서는 payload 없으면 fallback name으로라도 구성
      const effectiveRestaurantPayload: RestaurantPayload | null = isSystemDebug
        ? (restaurantPayload ??
          ({
            id: roomMeta?.restaurant?.id
              ? String(roomMeta.restaurant.id)
              : 'debug',
            name: restaurantName || debugRestaurantName,
            category: '',
            benefit: '',
            menu: '',
            imageUrl: '',
          } as RestaurantPayload))
        : restaurantPayload;

      const cards = buildCardsForSystemMessage({
        m: message,
        roomId,
        restaurantPayload: effectiveRestaurantPayload,
        cafesPayload,
        handled: handledSystemMessageIdsRef.current,
      });

      if (cards.length > 0) setLocalSystemCards((prev) => [...prev, ...cards]);
    }
  };

  // -------------------------
  // ✅ 메시지 히스토리 로드 + SYSTEM 카드 재구성
  // -------------------------
  const fetchMessages = async () => {
    const channel = channelRef.current;
    if (!channel) return;

    const prevQuery = channel.createPreviousMessageListQuery({
      limit: 50,
      reverse: false,
    });

    const list = (await prevQuery.load()) as BaseMessage[];
    setSbMessages(list);

    const effectiveRestaurantPayload: RestaurantPayload | null = isSystemDebug
      ? (restaurantPayload ??
        ({
          id: roomMeta?.restaurant?.id
            ? String(roomMeta.restaurant.id)
            : 'debug',
          name: restaurantName || debugRestaurantName,
          category: '',
          benefit: '',
          menu: '',
          imageUrl: '',
        } as RestaurantPayload))
      : restaurantPayload;

    const cards = buildCardsFromSystemMessages({
      sbMessages: list,
      roomId,
      restaurantPayload: effectiveRestaurantPayload,
      cafesPayload,
      handled: handledSystemMessageIdsRef.current,
    });

    setLocalSystemCards(cards);
  };

  // -------------------------
  // ✅ sendbird init + channel + messages + handler
  // - "Channel not found"면 joinChat(code=chat_code)로 복구
  // -------------------------
  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;

    let cancelled = false;

    const run = async () => {
      try {
        await ensureSendbirdConnected(me.id, me.name);
        const sb = getSendbirdInstance();

        let channelUrlToOpen = roomId;
        let channel: any = null;

        try {
          channel = await sb.groupChannel.getChannel(channelUrlToOpen);
        } catch (err: any) {
          const msg = String(err?.message ?? err).toLowerCase();

          // ✅ Channel not found → joinChat으로 복구
          if (msg.includes('channel') && msg.includes('not found')) {
            const code = roomMeta?.chat_code;

            if (!code) throw err;

            const joinRes = await joinChat({
              code,
              user_id: me.id,
              nickname: me.name,
            });

            const realChannelUrl = String(joinRes?.channel_url ?? '');

            if (!realChannelUrl) throw err;

            // URL 교정 (roomId가 진짜 sendbird url이 아닐 수 있음)
            if (realChannelUrl !== roomId) {
              router.replace(`/chat/${encodeURIComponent(realChannelUrl)}`);
              return;
            }

            channelUrlToOpen = realChannelUrl;
            channel = await sb.groupChannel.getChannel(channelUrlToOpen);
          } else {
            throw err;
          }
        }

        if (cancelled) return;

        channelRef.current = channel;

        await fetchMessages();

        const safeId = btoa(
          unescape(encodeURIComponent(channelUrlToOpen)),
        ).slice(0, 40);
        const handlerId = `room-${safeId}`;
        handlerIdRef.current = handlerId;

        const handler = new GroupChannelHandler({
          onMessageReceived: (ch, message) => {
            if (ch.url !== channelUrlToOpen) return;
            processIncomingMessage(message as BaseMessage);
          },
        });

        sb.groupChannel.addGroupChannelHandler(handlerId, handler);

        try {
          channel.markAsRead?.();
        } catch {}
      } catch (e) {
        console.error('Failed to init chat room:', e);
        if (!cancelled) {
          setSbMessages([]);
          setLocalSystemCards([]);
        }
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
    // roomMeta.chat_code 준비되면 복구 로직이 가능하니 의존성에 포함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, me?.id, me?.name, roomId, roomMeta?.chat_code]);

  // send 이후 강제 새로고침
  useEffect(() => {
    const onRefresh = () => fetchMessages();
    window.addEventListener('chat:refresh', onRefresh);
    return () => window.removeEventListener('chat:refresh', onRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // ✅ DEBUG: 버튼 누르면 SYSTEM 텍스트 도착을 "가짜 주입"
  // -------------------------
  const injectSystem = (kind: 'R5' | 'R6' | 'R7' | 'R8') => {
    const now = Date.now();
    const msgId = `debug-${kind}-${now}-${Math.random().toString(16).slice(2)}`;

    const effectiveRestaurantName = restaurantName || debugRestaurantName;

    const textMap: Record<typeof kind, string> = {
      R5: `🎉 매칭이 확정되었어요!\n\n📍 장소: ${effectiveRestaurantName}\n📅 일시: ${
        appointmentAtISO ? formatKstDebug(appointmentAtISO) : '2026-03-06 12시'
      }\n\n채팅방에서 먼저 인사를 나눠보세요! 👋`,
      R6: `👋 오늘 약속이 있어요!\n\n아직 인사를 안 했다면, 먼저 인사해보는 건 어떨까요?\n어색함을 줄이는 데 도움이 될 거예요 😊`,
      R7: `⏰ 약속 시간이 20분 지났어요.\n\n아직 도착하지 않은 멤버가 있나요?\n노쇼 신고는 마이페이지 > 신고하기에서 할 수 있어요.`,
      R8: `🍽️ 맛있게 드셨나요?\n\n☕ 2차로 카페는 어떨까요?\n\n📝 오늘 만남은 어땠나요?\n👉 평가하러 가기`,
    };

    const fake = {
      messageId: msgId,
      createdAt: now,
      message: textMap[kind],
      customType: 'SYSTEM',
    } as any as BaseMessage;

    processIncomingMessage(fake);
  };

  const resetDebugView = () => {
    handledSystemMessageIdsRef.current.clear();
    setSbMessages([]);
    setLocalSystemCards([]);
  };

  // -------------------------
  // ✅ sendbird → ui
  // -------------------------
  const uiMessages: ChatMessageData[] = useMemo(() => {
    if (!me?.id) return [];
    return sbMessages
      .map((m) => toChatMessageData(m, me.id))
      .filter(Boolean) as ChatMessageData[];
  }, [sbMessages, me?.id]);

  const merged: ChatMessageData[] = useMemo(() => {
    const all = [...uiMessages, ...localSystemCards];
    all.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
    return all;
  }, [uiMessages, localSystemCards]);

  // 아이스브레이킹
  useEffect(() => {
    (async () => {
      try {
        const res = await getIceBreakingQuestions();
        setIceBreakingTopics(res.map((q) => q.question));
      } catch (error) {
        console.error('Failed to fetch ice-breaking questions', error);
      }
    })();
  }, []);

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
        topics={iceBreakingTopics}
      />
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* ✅ 디버그 모드 UI */}
      {isSystemDebug && (
        <DebugPanel>
          <DebugTitle>DEBUG: SYSTEM UI 테스트 (?debug=system)</DebugTitle>

          <DebugInfo>
            <div>
              <strong>roomId:</strong> {roomId}
            </div>
            <div>
              <strong>chat_code:</strong> {roomMeta?.chat_code ?? '(없음)'}
            </div>
            <div>
              <strong>식당명(실제):</strong> {restaurantName || '(없음)'}
            </div>
            <div>
              <strong>식당 payload:</strong>{' '}
              {restaurantPayload
                ? `${restaurantPayload.name} / ${restaurantPayload.category} / ${restaurantPayload.benefit}`
                : '(로딩 전/없음)'}
            </div>
            <div>
              <strong>식당명(디버그 fallback):</strong>{' '}
              <DebugInput
                value={debugRestaurantName}
                onChange={(e) => setDebugRestaurantName(e.target.value)}
                placeholder="R5 식당카드 테스트용"
              />
            </div>
            <div>
              <strong>카페(서버):</strong>{' '}
              {cafesPayload?.cafes?.length
                ? `${cafesPayload.cafes.length}곳 (${cafesPayload.cafes
                    .map((c) => c.name)
                    .join(', ')})`
                : '(아직 로딩 전이거나 0곳)'}
            </div>
          </DebugInfo>

          <DebugButtonRow>
            <DebugButton onClick={() => injectSystem('R5')}>
              R5 주입 (텍스트+식당카드)
            </DebugButton>
            <DebugButton onClick={() => injectSystem('R6')}>
              R6 주입 (텍스트만)
            </DebugButton>
            <DebugButton onClick={() => injectSystem('R7')}>
              R7 주입 (텍스트+노쇼카드)
            </DebugButton>
            <DebugButton onClick={() => injectSystem('R8')}>
              R8 주입 (텍스트+카페+피드백)
            </DebugButton>
          </DebugButtonRow>

          <DebugButtonDanger onClick={resetDebugView}>
            화면 초기화
          </DebugButtonDanger>
        </DebugPanel>
      )}
    </Wrapper>
  );
}

// -------------------------
// ✅ message → ui message
// -------------------------
function toChatMessageData(
  m: BaseMessage,
  myUserId: string,
): ChatMessageData | null {
  const text = (m as any).message;
  if (typeof text !== 'string') return null;

  const sender = (m as any).sender;
  const senderUserId: string | undefined = sender?.userId;
  const isMe = senderUserId === myUserId;

  const isBackendSystem = isBackendSystemMessage(m);

  if (isBackendSystem) {
    return {
      id: String((m as any).messageId ?? `${m.createdAt}`),
      senderType: 'system',
      messageType: 'text',
      content: text,
      createdAt: new Date(m.createdAt).toISOString(),
    };
  }

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

// -------------------------
// ✅ SYSTEM 메시지 판별 + R5/R7/R8 매핑
// -------------------------
function isBackendSystemMessage(m: BaseMessage) {
  const ct = (m as any).customType ?? (m as any).custom_type;
  return ct === 'SYSTEM';
}

type SystemKind = 'R5' | 'R7' | 'R8';

function detectSystemKindByText(text: string): SystemKind | null {
  if (text.includes('매칭이 확정') || text.includes('📍 장소:')) return 'R5';
  if (text.includes('20분') && (text.includes('노쇼') || text.includes('신고')))
    return 'R7';
  if (text.includes('평가') || text.includes('2차') || text.includes('카페'))
    return 'R8';
  return null;
}

function getMessageKey(m: BaseMessage) {
  return String((m as any).messageId ?? (m as any).createdAt);
}

function addMs(iso: string, ms: number) {
  return new Date(new Date(iso).getTime() + ms).toISOString();
}

/**
 * ✅ SYSTEM 텍스트 다음에 붙을 카드 생성
 * - R5: restaurantPayload(풀)
 * - R7: noShowReport
 * - R8: cafeList → feedback
 */
function buildCardsForSystemMessage(args: {
  m: BaseMessage;
  roomId: string;
  restaurantPayload: RestaurantPayload | null;
  cafesPayload: CafeListPayload | null;
  handled: Set<string>;
}): ChatMessageData[] {
  const text = (args.m as any).message;
  if (typeof text !== 'string') return [];

  const kind = detectSystemKindByText(text);
  if (!kind) return [];

  const key = getMessageKey(args.m);
  if (args.handled.has(key)) return [];
  args.handled.add(key);

  const baseISO = new Date(
    (args.m as any).createdAt ?? Date.now(),
  ).toISOString();

  if (kind === 'R5') {
    if (!args.restaurantPayload?.name) return [];

    return [
      {
        id: `sys-card-${key}-restaurant`,
        senderType: 'system',
        messageType: 'restaurant',
        createdAt: addMs(baseISO, 1),
        payload: args.restaurantPayload,
      },
    ];
  }

  if (kind === 'R7') {
    return [
      {
        id: `sys-card-${key}-noshow`,
        senderType: 'system',
        messageType: 'noShowReport',
        createdAt: addMs(baseISO, 1),
      },
    ];
  }

  const cafePayload: CafeListPayload = args.cafesPayload ?? {
    cafes: [],
    redirectUrl: `/chat/${encodeURIComponent(args.roomId)}/cafe`,
  };

  return [
    {
      id: `sys-card-${key}-cafeList`,
      senderType: 'system',
      messageType: 'cafeList',
      createdAt: addMs(baseISO, 1),
      payload: cafePayload,
    },
    {
      id: `sys-card-${key}-feedback`,
      senderType: 'system',
      messageType: 'feedback',
      createdAt: addMs(baseISO, 2),
    },
  ];
}

function buildCardsFromSystemMessages(args: {
  sbMessages: BaseMessage[];
  roomId: string;
  restaurantPayload: RestaurantPayload | null;
  cafesPayload: CafeListPayload | null;
  handled: Set<string>;
}) {
  args.handled.clear();

  const cards: ChatMessageData[] = [];
  for (const m of args.sbMessages) {
    if (!isBackendSystemMessage(m)) continue;

    const next = buildCardsForSystemMessage({
      m,
      roomId: args.roomId,
      restaurantPayload: args.restaurantPayload,
      cafesPayload: args.cafesPayload,
      handled: args.handled,
    });

    if (next.length > 0) cards.push(...next);
  }
  return cards;
}

// -------------------------
// 시간/그룹 렌더 유틸
// -------------------------
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

  return getSenderKey(prev) !== getSenderKey(current);
}

function formatKstDebug(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = d.getHours();
  return `${y}-${m}-${day} ${h}시`;
}

// -------------------------
// styles
// -------------------------
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
