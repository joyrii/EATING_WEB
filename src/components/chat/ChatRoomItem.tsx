import ProfileImage from './ProfileImage';
import styled from 'styled-components';
import React, { useEffect } from 'react';
import { getSendbirdInstance } from '@/lib/sendbird/client';

type ChatRoomItemProps = {
  roomId: string;
  roomName: React.ReactNode; // ✅ string → ReactNode
  lastChatAsMs: number;
  content: string;
  unreadCount: number;
  memberCount: number;
  profileImageUrl: string;
  onClick?: () => void;
};

export default function ChatRoomItem({
  roomId,
  roomName,
  lastChatAsMs,
  content,
  unreadCount,
  memberCount,
  profileImageUrl,
  onClick,
}: ChatRoomItemProps) {
  const timeStamp = formatRelativeTime(lastChatAsMs);

  function toRepeatedImageUrls(url: string, memberCount: number) {
    const safe = url?.trim() ? url : '/images/chat/profile-default-3.png';
    const n = Math.max(1, Math.min(4, Number(memberCount) || 1)); // 1~4
    return Array.from({ length: n }, () => safe);
  }

  return (
    <ChatRoomItemWrapper key={roomId} onClick={onClick}>
      <ProfileImage
        imageUrls={toRepeatedImageUrls(profileImageUrl, memberCount)}
      />
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
  if (!input) return '';
  const now = Date.now();
  const t = typeof input === 'number' ? input : input.getTime();
  const diff = Math.max(0, now - t); // 미래 시점 방지: 음수는 0으로 처리

  if (diff < 0) return '';

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '방금 전';

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;

  return `${Math.floor(hour / 24)}일 전`;
}

const ChatRoomItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;
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
`;

const LastMessage = styled.p`
  font-size: 14px;
  color: #707070;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const TimeStampWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-left: 30px;
  gap: 2px;
`;

const TimeStamp = styled.p`
  font-size: 10px;
  color: #707070;
`;

const UnreadBadge = styled.div`
  width: 18px;
  height: 18px;
  background-color: #ff5900;
  border-radius: 45px;
  color: #fff;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;
