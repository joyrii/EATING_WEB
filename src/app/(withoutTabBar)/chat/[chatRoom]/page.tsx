import ChatMessage, {
  type ChatMessageProps,
  type SenderType,
  type ChatMessageData,
} from '@/components/chat/ChatMessage';
import CHAT_DATA from '@/constants/CHAT';
import styled from 'styled-components';

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ chatRoom: string }>;
}) {
  const chatRoom = await params;
  const roomId = Number(chatRoom.chatRoom);

  return (
    <div>
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
              key={index}
              roomId={roomId}
              senderType={message.senderType}
              senderName={message.senderName}
              profileImageUrl={message.profileImageUrl}
              content={message.content}
              createdAt={message.createdAt}
              createdAtText={formatChatTime(message.createdAt)}
              showCreatedAt={showCreatedAt}
              showSenderName={showSenderName}
              showProfileImage={showProfileImage}
            />
          </div>
        );
      })}
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
