'use client';

import ChatMessage, {
  type ChatMessageData,
  ChatAction,
} from '@/components/chat/ChatMessage';
import IceBreakingModal from '@/components/chat/IceBreakingModal';
import RestaurantModal from '@/components/chat/RestaurantModal';
import CHAT_DATA from '@/constants/CHAT';
import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import ProfileModal from '@/components/chat/ProfileModal';

export default function ChatRoomClient({ roomId }: { roomId: number }) {
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

  const router = useRouter();

  const handleAction = (action: ChatAction) => {
    console.log(action);
    switch (action.type) {
      case 'OPEN_RESTAURANT':
        setSelectedRestaurant(action.payload);
        setRestaurantModalOpen(true);
        break;
      case 'OPEN_CAFE_LIST':
        router.push(`/chat/${roomId}/cafe`);
        break;
      case 'OPEN_NO_SHOW':
      // 노쇼 신고 페이지 이동
      case 'OPEN_FEEDBACK':
      // 피드백 페이지 이동
      case 'OPEN_PROFILE':
        setProfileModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {CHAT_DATA.map((message, index) => {
        const currentDateKey = getDateKey(message.createdAt);
        const prevDateKey =
          index > 0 ? getDateKey(CHAT_DATA[index - 1].createdAt) : null;

        const showDateDivider = index === 0 || currentDateKey !== prevDateKey;

        const isGroupFirst = isFirstOfGroup(CHAT_DATA, index);
        const isGroupLast = isLastOfGroup(CHAT_DATA, index);

        const showSenderName =
          isGroupFirst &&
          (message.senderType === 'other' || message.senderType === 'system');

        const showProfileImage =
          isGroupFirst &&
          (message.senderType === 'other' || message.senderType === 'system');

        const showCreatedAt = isGroupLast;

        return (
          <div key={index}>
            {showDateDivider && (
              <DateDivider>{formatDateDivider(message.createdAt)}</DateDivider>
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
      })}
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
  return `${m.senderType}:${m.senderId ?? 'unknown'}`;
}

function isLastOfGroup(messages: ChatMessageData[], index: number) {
  const current = messages[index];
  const next = messages[index + 1];

  if (!next) return true;

  // 날짜 바뀌면 무조건 끊기
  const sameDay = getDateKey(next.createdAt) === getDateKey(current.createdAt);
  if (!sameDay) return true;

  // 다음 메시지 발신자가 다르면 현재가 그룹 마지막
  return getSenderKey(next) !== getSenderKey(current);
}

// 이름과 프로필 이미지는 첫 메시지에만
function isFirstOfGroup(messages: ChatMessageData[], index: number) {
  const current = messages[index];
  const prev = messages[index - 1];

  if (!prev) return true;

  // 날짜 바뀌면 새 그룹 시작
  const sameDay = getDateKey(prev.createdAt) === getDateKey(current.createdAt);
  if (!sameDay) return true;

  // 이전 메시지가 다른 발신자면 새 그룹 시작
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
