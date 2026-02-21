import {
  CafeListPayload,
  ChatMessageData,
  RestaurantPayload,
} from '@/components/chat/ChatMessage';

type AutoInput = {
  roomId: string;
  appointmentAtISO: string;
  restaurant?: RestaurantPayload;
  cafes?: CafeListPayload;
};

export function getAutoSystemMessage({
  roomId,
  appointmentAtISO,
  restaurant,
  cafes,
}: AutoInput): ChatMessageData[] {
  const now = Date.now();
  const appt = new Date(appointmentAtISO); // 약속 시간
  const apptMs = appt.getTime(); // 약속 시간의 타임스탬프

  // 매주 금요일 오후 6:00의 타임스탬프
  const friday18Ms = getFriday1800Before(appt);

  // 약속 당일 9:00 AM의 타임스탬프
  const day9amMs = new Date(
    appt.getFullYear(),
    appt.getMonth(),
    appt.getDate(),
    9,
    0,
    0,
    0,
  ).getTime();

  // 현재 시간에 따라 보여줄 메시지 결정
  const candidates: ChatMessageData[] = [
    // 금요일 오후 6:00 메시지
    ...buildFriday18Set(roomId, friday18Ms, restaurant),
    // 약속 당일 09:00
    {
      id: `system-${roomId}-morning`,
      senderType: 'system',
      messageType: 'text',
      content:
        '오늘 잇팅 약속 있는 날이에요!\n만나기 전에 매칭된 벗들과 가볍게 인사 한마디 나눠보세요 ☺️',
      createdAt: new Date(day9amMs).toISOString(),
    },
    // 약속 +20m 노쇼
    {
      id: `system-${roomId}-no-show`,
      senderType: 'system',
      messageType: 'noShowReport',
      createdAt: new Date(apptMs + 20 * 60 * 1000).toISOString(),
    },
    // 약속 +30m 카페 리스트
    ...buildCafeSet(roomId, apptMs + 30 * 60 * 1000, cafes),
    // 약속 +2h 피드백
    {
      id: `system-${roomId}-feedback`,
      senderType: 'system',
      messageType: 'feedback',
      createdAt: new Date(apptMs + 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const visible = candidates.filter(
    (m) => new Date(m.createdAt).getTime() <= now,
  );

  visible.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return visible;
}

// 약속 전 매주 금요일 오후 6:00의 타임스탬프 계산
function getFriday1800Before(appt: Date) {
  const d = new Date(appt);
  d.setHours(18, 0, 0, 0); // 금요일 오후 6:00로 설정

  const day = d.getDay();
  const diffToFriday = (day - 5 + 7) % 7; // 금요일(5)까지의 일 수 계산
  d.setDate(d.getDate() - diffToFriday); // 가장 가까운 금요일로 이동

  if (d.getTime() > appt.getTime()) {
    d.setDate(d.getDate() - 7); // 약속보다 이후라면, 이전 금요일로 이동
  }

  return d.getTime();
}

// 메시지 묶음
function atOffset(baseMs: number, offsetMs: number) {
  return new Date(baseMs + offsetMs * 1000).toISOString();
}

// 금요일 오후 6시 인사 메시지 + 식당 정보
function buildFriday18Set(
  roomId: string,
  friday18Ms: number,
  restaurant?: RestaurantPayload,
): ChatMessageData[] {
  const result: ChatMessageData[] = [];

  result.push({
    id: `system-${roomId}-fri-welcome`,
    senderType: 'system',
    messageType: 'text',
    content: '안녕하세요 잇팅이들 😆\n잇팅방에 들어오신 걸 환영합니다',
    createdAt: atOffset(friday18Ms, 0),
  });

  result.push({
    id: `system-${roomId}-fri-place-text`,
    senderType: 'system',
    messageType: 'text',
    content: '벗들의 취향을 반영해서,\n약속날 갈 식당이 정해졌어요!',
    createdAt: atOffset(friday18Ms, 1),
  });

  if (restaurant) {
    result.push({
      id: `system-${roomId}-fri-restaurant`,
      senderType: 'system',
      messageType: 'restaurant',
      payload: restaurant,
      createdAt: atOffset(friday18Ms, 2),
    });
  }

  result.push({
    id: `system-${roomId}-fri-discount-guide`,
    senderType: 'system',
    messageType: 'text',
    content:
      `🎟️할인 받는 방법 안내🎟️\n\n` +
      `1. 약속 시간에 맞춰 벗들과 만나요!\n` +
      `2. 식당에 도착하면 매장에 비치된 QR코드를 찍어주세요!\n` +
      `3. 쿠폰 화면을 사장님께 보여드리면 끝!`,
    createdAt: atOffset(friday18Ms, 3),
  });

  return result;
}

// 카페 리스트
function buildCafeSet(
  roomId: string,
  baseMs: number,
  cafes?: CafeListPayload,
): ChatMessageData[] {
  return [
    {
      id: `system-${roomId}-cafe-text-1`,
      senderType: 'system',
      messageType: 'text',
      content:
        '팅팅이들, 즐겁게 잇팅하고 있나요?\n식사 후에 가볍게 들르기 좋은\n2차 카페 리스트도 준비했어요 ☕️\n\n아래에서 제휴 카페 확인하고 할인도 이어서 받아보세요!',
      createdAt: atOffset(baseMs, 0),
    },
    {
      id: `system-${roomId}-cafe-text-2`,
      senderType: 'system',
      messageType: 'text',
      content:
        '할인받는 방법은 식당하고 똑같아요!\n오늘 만난 친구하고 2차를 가보는 건 어떨까요?',
      createdAt: atOffset(baseMs, 1),
    },
    {
      id: `system-${roomId}-cafe-card`,
      senderType: 'system',
      messageType: 'cafeList',
      payload: {
        cafes: [
          { id: '1', name: '다방방' },
          { id: '2', name: '주디' },
          { id: '3', name: '마마카페' },
        ],
        redirectUrl: `/chat/${encodeURIComponent(roomId)}/cafe`,
      },
      createdAt: atOffset(baseMs, 2),
    },
  ];
}
