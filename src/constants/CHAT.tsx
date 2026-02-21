import type { ChatMessageData } from '@/components/chat/ChatMessage';

const CHAT_DATA: ChatMessageData[] = [
  {
    id: '1',
    senderType: 'system',
    messageType: 'text',
    content: '안녕하세요 팅팅이들 😆\n잇팅방에 들어오신 걸 환영합니다',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    senderType: 'system',
    messageType: 'restaurant',
    createdAt: new Date().toISOString(),
    payload: {
      id: 10,
      name: '진미당',
      category: '한식',
      benefit: '10% 할인',
      menu: '치즈불짜파게티',
      imageUrl: '/images/dummy.jpg',
    },
  },
  {
    id: '4',
    senderType: 'system',
    messageType: 'noShowReport',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    senderType: 'system',
    messageType: 'cafeList',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    senderType: 'system',
    messageType: 'feedback',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    senderType: 'other',
    senderId: '123',
    senderName: '홍길동',
    messageType: 'text',
    content: '안녕하세요! 반가워요 😊',
    createdAt: new Date().toISOString(),
    profileImageUrl: '/images/chat/profile-image-1.jpeg',
  },
];

export default CHAT_DATA;
