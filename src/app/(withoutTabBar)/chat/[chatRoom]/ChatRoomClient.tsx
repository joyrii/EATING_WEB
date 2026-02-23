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

import { fetchPendingMatches, type PendingMatch } from '@/api/matching';
import { ensureChannelMeta, toKstIso } from '@/lib/sendbird/channelMeta';
import { getRestaurants } from '@/api/application';

const DEFAULT_PROFILE_URL = '/images/chat/profile-default-.png';

function pickDefaultProfileUrlByUserId(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++)
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return DEFAULT_PROFILE_URL[hash % DEFAULT_PROFILE_URL.length];
}

/**
 * ===========================
 * ✅ 요구사항(정리)
 * ===========================
 *
 * 1) 백이 SendBird로 SYSTEM 텍스트를 "특정 시간"에 자동 전송 (custom_type="SYSTEM")
 * 2) 프론트는 백 텍스트는 그대로 '잇팅'의 텍스트 말풍선로 보여준다.
 * 3) 그리고 같은 타이밍에 "카드 UI"를 바로 이어서 보여주고 싶다 (렌더링 전용).
 *
 * 매핑:
 * - R5(장소 확정): SYSTEM 텍스트 + RestaurantCard
 * - R6(인사 권유): SYSTEM 텍스트만
 * - R7(노쇼 안내): SYSTEM 텍스트 + NoShow 카드
 * - R8(2차/평가): SYSTEM 텍스트 + Cafe 카드 → Feedback 카드 (이 순서)
 *
 * 4) 카페 3개 이름은 하드코딩 금지.
 *    getRestaurants()로 서버에서 받아온 데이터를 cafesPayload에 넣어서 사용.
 *
 * 5) 디버그 모드:
 *    URL 끝에 ?debug=system 붙이면 하단 패널 노출.
 *    버튼 클릭으로 R5~R8 케이스를 "실제로 전송 없이" 화면에 주입해서 UI 확인.
 *
 * 6) R5 카드가 안 뜨는 이슈 해결:
 *    R5 카드는 restaurantName이 비어있으면 생성되지 않는 게 정상.
 *    디버그에서는 UI 확인이 목적이므로,
 *    debug=system일 때 restaurantName이 비어있으면 debugRestaurantName을 fallback으로 사용.
 */

export default function ChatRoomClient() {
  const params = useParams<{ chatRoom: string }>();
  const roomId = params?.chatRoom ? decodeURIComponent(params.chatRoom) : ''; // channelUrl
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

  const [pending, setPending] = useState<PendingMatch[]>([]);
  const [appointmentAtISO, setAppointmentAtISO] = useState<string>('');
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [cafesPayload, setCafesPayload] = useState<CafeListPayload | null>(
    null,
  );

  // ✅ 디버그에서만: R5 식당카드 뜨게 하는 fallback 값
  const [debugRestaurantName, setDebugRestaurantName] =
    useState<string>('학생식당');

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
      // case 'OPEN_RESTAURANT':
      //   setSelectedRestaurant(action.payload);
      //   setRestaurantModalOpen(true);
      //   break;
      case 'OPEN_CAFE_LIST':
        router.push(
          action.payload.redirectUrl +
            (appointmentAtISO
              ? `?appointmentAt=${encodeURIComponent(appointmentAtISO)}`
              : ''),
        );
        break;
      // case 'OPEN_PROFILE':
      //   setProfileModalOpen(true);
      //   break;
      // case 'OPEN_NO_SHOW':
      //   router.push('/noshow');
      //   break;
      // case 'OPEN_FEEDBACK':
      //   router.push('/feedback');
      //   break;
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

  // -------------------------
  // ✅ pending 로드
  // -------------------------
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

  // -------------------------
  // ✅ 공통: "메시지 1개 들어왔을 때" 처리 로직
  // - 실수신(실제 SendBird) / 디버그 주입(가짜) 둘 다 여기 타게 함
  // -------------------------
  const processIncomingMessage = (message: BaseMessage) => {
    // 1) 원본 메시지는 그대로 쌓기
    setSbMessages((prev) => [...prev, message]);

    // 2) SYSTEM이면 카드 세트도 붙이기
    if (isBackendSystemMessage(message)) {
      // ✅ R5 카드 안 뜨는 문제 해결:
      // 디버그 모드에서는 restaurantName이 비어있으면 debugRestaurantName을 사용
      const effectiveRestaurantName = isSystemDebug
        ? restaurantName || debugRestaurantName
        : restaurantName;

      const cards = buildCardsForSystemMessage({
        m: message,
        roomId,
        restaurantName: effectiveRestaurantName,
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

    const effectiveRestaurantName = isSystemDebug
      ? restaurantName || debugRestaurantName
      : restaurantName;

    const cards = buildCardsFromSystemMessages({
      sbMessages: list,
      roomId,
      restaurantName: effectiveRestaurantName,
      cafesPayload,
      handled: handledSystemMessageIdsRef.current,
    });

    setLocalSystemCards(cards);
  };

  // -------------------------
  // ✅ sendbird init + channel + messages + handler + meta/appointment 계산
  // -------------------------
  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;

    let cancelled = false;

    const run = async () => {
      try {
        await ensureSendbirdConnected(me.id, me.name);
        const sb = getSendbirdInstance();

        const channel = await sb.groupChannel.getChannel(roomId);
        channelRef.current = channel;

        // appointment/restaurantName 계산 (channel.data 우선, 없으면 pending으로 보정)
        if (pending.length > 0) {
          const meta = await ensureChannelMeta(channel, pending);
          if (meta && !cancelled) {
            setAppointmentAtISO(
              toKstIso(meta.matched_slot.date, meta.matched_slot.hour),
            );
            setRestaurantName(meta.restaurant_name ?? '');
          }
        }

        await fetchMessages();

        const safeId = btoa(unescape(encodeURIComponent(roomId))).slice(0, 40);
        const handlerId = `room-${safeId}`;
        handlerIdRef.current = handlerId;

        const handler = new GroupChannelHandler({
          onMessageReceived: (ch, message) => {
            if (ch.url !== roomId) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, me?.id, me?.name, roomId, pending]);

  // send 이후 강제 새로고침
  useEffect(() => {
    const onRefresh = () => fetchMessages();
    window.addEventListener('chat:refresh', onRefresh);
    return () => window.removeEventListener('chat:refresh', onRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // ✅ DEBUG: 버튼 누르면 "SYSTEM 텍스트 도착"을 가짜로 주입 (전송 X)
  // -------------------------
  const injectSystem = (kind: 'R5' | 'R6' | 'R7' | 'R8') => {
    const now = Date.now();
    const msgId = `debug-${kind}-${now}-${Math.random().toString(16).slice(2)}`;

    // detectSystemKindByText()가 잡을 수 있는 문구로 구성
    const effectiveRestaurantName = restaurantName || debugRestaurantName;

    const textMap: Record<typeof kind, string> = {
      R5: `🎉 매칭이 확정되었어요!\n\n📍 장소: ${effectiveRestaurantName}\n📅 일시: ${appointmentAtISO ? formatKstDebug(appointmentAtISO) : '2026-02-25 12시'}\n\n채팅방에서 먼저 인사를 나눠보세요! 👋`,
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

  // merge + sort
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
              <strong>식당명(실제):</strong> {restaurantName || '(없음)'}
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
              R8 주입 (텍스트+카페카드+피드백카드)
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
 * ✅ "백 텍스트" 다음에 붙을 카드(들)을 만든다.
 * - createdAt은 base + 1ms, +2ms ... 로 설정해서 정렬 시 항상 텍스트 뒤에 오게 함
 * - R8은 cafeList 먼저, feedback 다음
 */
function buildCardsForSystemMessage(args: {
  m: BaseMessage;
  roomId: string;
  restaurantName: string;
  cafesPayload: CafeListPayload | null;
  handled: Set<string>;
}): ChatMessageData[] {
  const text = (args.m as any).message;
  if (typeof text !== 'string') return [];

  const kind = detectSystemKindByText(text);
  if (!kind) return [];

  // ✅ 중복 방지: 같은 SYSTEM 메시지에 대해 카드 세트 1회만 생성
  const key = getMessageKey(args.m);
  if (args.handled.has(key)) return [];
  args.handled.add(key);

  const baseISO = new Date(
    (args.m as any).createdAt ?? Date.now(),
  ).toISOString();

  if (kind === 'R5') {
    // restaurantName이 없으면 카드 생성 안 함 (프로덕션 동작)
    if (!args.restaurantName) return [];

    const payload: RestaurantPayload = {
      id: '0',
      name: args.restaurantName,
      category: '',
      benefit: '',
      menu: '',
      imageUrl: '',
    };

    return [
      {
        id: `sys-card-${key}-restaurant`,
        senderType: 'system',
        messageType: 'restaurant',
        createdAt: addMs(baseISO, 1),
        payload,
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

  // R8: cafeList → feedback
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

/**
 * ✅ 히스토리 로드 시: SYSTEM 텍스트들을 스캔해서 카드들을 "재구성"한다.
 */
function buildCardsFromSystemMessages(args: {
  sbMessages: BaseMessage[];
  roomId: string;
  restaurantName: string;
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
      restaurantName: args.restaurantName,
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
