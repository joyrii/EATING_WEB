import ProfileImage from './ProfileImage';
import styled from 'styled-components';

type ChatRoomItemProps = {
  roomId: string;
  roomName: string;
  timeStamp: string;
  content: string;
  unreadCount: number;
  profileImageUrls?: string[];
};

export default function ChatRoomItem({
  roomId,
  roomName,
  timeStamp,
  content,
  unreadCount,
  profileImageUrls,
}: ChatRoomItemProps) {
  return (
    <ChatRoomItemWrapper key={roomId}>
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
