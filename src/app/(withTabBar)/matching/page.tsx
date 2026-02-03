'use client';

import localFont from 'next/font/local';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CHATTINGLIST from '@/constants/CHATTING_LIST';
import ChatRoomItem from '@/components/chatting/ChatRoomItem';

interface RoomData {
  id: number;
  title: string;
  lastChat: string;
  lastChatAt: string;
  unreadCount: number;
}

const Matching = () => {
  const [rooms, setRooms] = useState<RoomData[]>(CHATTINGLIST);

  const hasRooms = rooms.length > 0;

  // 더미 프로필 이미지 URL
  const imageUrls = [
    '/images/chat/profile-image-1.jpeg',
    '/images/chat/profile-image-2.jpeg',
    '/images/chat/profile-image-3.jpeg',
    '/images/chat/profile-image-4.jpeg',
  ];

  return (
    <>
      <Header>
        <HeaderText>잇팅</HeaderText>
        <LogoCharacter alt="logo-character" />
      </Header>
      <div>
        {hasRooms ? (
          <>
            <NoticeBox>
              <NoticeText>채팅방은 약속 다음날 사라집니다</NoticeText>
            </NoticeBox>
            {rooms.map((room) => (
              <ChatRoomItem
                key={room.id}
                roomId={room.id}
                roomName={room.title}
                timeStamp={room.lastChatAt}
                content={room.lastChat}
                unreadCount={room.unreadCount}
                profileImageUrls={imageUrls}
              />
            ))}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};

export default Matching;

function EmptyState() {
  return (
    <EmptyStateContainer>
      <EmptyStateText>아직 매칭된 방이 없어요!</EmptyStateText>
      <img
        src="/svgs/home/eating-logo-character-empty.svg"
        alt="empty-state"
        width={175}
        height={175}
      />
    </EmptyStateContainer>
  );
}

const HeaderFont = localFont({
  src: '../../fonts/Hakgyoansim-Dunggeunmiso-OTF-R.otf',
  weight: '400',
});

const EmptyStateFont = localFont({
  src: '../../fonts/Ownglyph-PDH-Regular.ttf',
  weight: '400',
});

const Header = styled.header`
  width: 100%;
  background-color: #fafafa;
  font-family: ${HeaderFont.style.fontFamily};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-block: 8px;
  padding-left: 24px;
  position: sticky;
  top: 0;
`;

const HeaderText = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 36px;
  color: #ff5900;
`;

const LogoCharacter = styled.img.attrs({
  src: '/svgs/home/eating-logo-character.svg',
  width: 40,
  height: 44,
})`
  margin-left: 4px;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 150px;
  justify-content: center;
  align-items: center;
`;

const EmptyStateText = styled.p`
  font-size: 22px;
  font-family: ${EmptyStateFont.style.fontFamily};
`;

const NoticeBox = styled.div`
  width: 85%;
  height: 33px;
  border: 1px solid #f0f0f0;
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

const NoticeText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #707070;
`;
