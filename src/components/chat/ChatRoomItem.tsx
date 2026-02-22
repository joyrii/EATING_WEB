import ProfileImage from './ProfileImage';
import styled from 'styled-components';

type ChatRoomItemProps = {
  roomId: string;
  roomName: string;
  lastChatAsMs: number;
  content: string;
  unreadCount: number;
  profileImageUrls?: string[];
  onClick?: () => void;
};

export default function ChatRoomItem({
  roomId,
  roomName,
  lastChatAsMs,
  content,
  unreadCount,
  profileImageUrls,
  onClick,
}: ChatRoomItemProps) {
  const timeStamp = formatRelativeTime(lastChatAsMs);

  return (
    <ChatRoomItemWrapper key={roomId} onClick={onClick}>
      <ProfileImage imageUrls={profileImageUrls || []} />
      <RoomNameWrapper>
        <RoomName>{roomName}</RoomName>
        <LastMessage>{content}</LastMessage>
      </RoomNameWrapper>
      <TimeStampWrapper>
        <TimeStamp>{timeStamp}</TimeStamp>
        {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
      </TimeStampWrapper>
    </ChatRoomItemWrapper>
  );
}

function formatRelativeTime(input: number | Date) {
  if (input == null) return '';
  const now = Date.now();
  const t = typeof input === 'number' ? input : input.getTime();
  const diff = now - t;

  // 미래 시간이 들어오면 그냥 시간 표시
  if (diff < 0) return formatClock(t);

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '방금 전';

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;

  // 어제/그제 느낌
  const days = Math.floor(hour / 24);
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;

  // 일주일 넘으면 날짜로
  return formatDate(t);
}

function formatClock(ms: number) {
  const d = new Date(ms);
  // 카톡처럼 "오전 8:43" 느낌
  return d.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(ms: number) {
  const d = new Date(ms);

  // 올해면 "2월 3일", 아니면 "2026. 2. 3."
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();

  return sameYear
    ? d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    : d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
}

const ChatRoomItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const RoomNameWrapper = styled.div`
  flex: 1;
  margin-left: 23px;
  display: flex;
  flex-direction: column;
`;

const RoomName = styled.p`
  font-size: 17px;
  font-weight: 400;
  color: #000;
  margin-bottom: 4px;
  line-height: 145%;
`;

const LastMessage = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #707070;
  line-height: 145%;
`;

const TimeStampWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  gap: 2px;
`;

const TimeStamp = styled.p`
  font-size: 10px;
  font-weight: 500;
  color: #707070;
  text-align: right;
`;

const UnreadBadge = styled.div`
  width: 18px;
  height: 18px;
  background-color: #ff5900;
  border-radius: 45px;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;
