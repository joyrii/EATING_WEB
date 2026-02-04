import type { ChatMessageData } from '@/components/chat/ChatMessage';

const CHAT_DATA: ChatMessageData[] = [
  {
    senderType: 'system',
    content: '안녕하세요 팅팅이들 😆\n잇팅방에 들어오신 걸 환영합니다',
    createdAt: '2026-02-06T14:32:10+09:00',
  },
  {
    senderType: 'system',
    content: '벗들의 취향을 반영해서,\n오늘 갈 식당이 정해졌어요!',
    createdAt: '2026-02-06T14:35:10+09:00',
  },
  {
    senderType: 'system',
    content: `🎟️ 할인코드 사용 방법 안내 🎟️\n1. 약속 시간에 맞춰 할인코드가 자동으로 공개돼요\n2. 식당에 도착하면 매장에 비치된 QR 코드를 찍어주세요\n3. QR 사이트에 할인코드를 입력하면 나오는 쿠폰 화면을 사장님께 보여드리면 끝!`,
    createdAt: '2026-02-06T14:40:10+09:00',
  },
  {
    senderType: 'system',
    content:
      '오늘 잇팅 약속 있는 날이에요!\n만나기 전에 매칭된 벗들과 가볍게 인사 한마디 나눠보세요😊',
    createdAt: '2026-02-26T14:45:10+09:00',
  },
  {
    senderType: 'user',
    senderId: 0,
    content:
      '안녕하세요! 저는 불어불문 26학번 김이화라고 합니당~ 잘 부탁드려요!!',
    createdAt: '2026-02-26T14:50:10+09:00',
  },
  {
    senderType: 'other',
    senderId: 1,
    senderName: '김방어',
    profileImageUrl: '/images/chat/profile-image-3.jpeg',
    content:
      '안녕하세요!! 저는 독문과 25학번 김방어입니다! 같이 푸파 맛있게 해용 ㅎㅎ',
    createdAt: '2026-02-26T14:55:10+09:00',
  },
  {
    senderType: 'system',
    content: '약속시간이 다 되었습니다!\n할인코드를 알려드릴게요:)',
    createdAt: '2026-02-26T15:00:10+09:00',
  },
];

export default CHAT_DATA;
