'use client';

import localFont from 'next/font/local';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ensureSendbirdConnected } from '@/lib/sendbird/client';
import ChatRoomItem from '@/components/chat/ChatRoomItem';
import { useUser } from '@/context/userContext';
import { getSendbirdInstance } from '@/lib/sendbird/client';
import { useRouter } from 'next/navigation';

interface RoomData {
  id: string;
  title: string;
  lastChat: string;
  lastChatAtMs: number;
  unreadCount: number;
  profileImageUrls: string[];
}

const Matching = () => {
  const router = useRouter();

  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetchingRef = useRef(false);

  const { me, isLoaded } = useUser();

  const hasRooms = rooms.length > 0;

  const fetchRooms = async () => {
    if (!me?.id) return;
    if (fetchingRef.current) return; // 중복 요청 방지

    fetchingRef.current = true;
    setIsFetching(true);

    try {
      await ensureSendbirdConnected(me.id, me.name);

      const sb = getSendbirdInstance();

      const query = sb.groupChannel.createMyGroupChannelListQuery({
        includeEmpty: true,
        limit: 50,
        order: 'latest_last_message',
      });

      const channels = await query.next();

      const mapped: RoomData[] = channels.map((channel: any) => {
        const last = channel.lastMessage;
        const lastText = last?.message ?? (last?.url ? '[파일]' : '');

        const createdAtMs = last?.createdAt ?? channel.createdAt ?? Date.now();
        const lastChatAt = new Date(createdAtMs).toLocaleString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        const profileImageUrls = (channel.members ?? [])
          .slice(0, 4)
          .map((m: any) => m.profileUrl || '/images/chat/profile-image-1.jpeg');

        return {
          id: channel.url,
          title: channel.name || '채팅방',
          lastChat: lastText || '',
          lastChatAtMs: createdAtMs,
          unreadCount: channel.unreadMessageCount || 0,
          profileImageUrls,
        };
      });

      setRooms(mapped);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
      setRooms([]);
    } finally {
      fetchingRef.current = false;
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !me?.id) return;
    fetchRooms();
  }, [isLoaded, me?.id]);

  // 자동 업데이트
  useEffect(() => {
    if (!isLoaded || !me?.id) return;

    const onFocus = () => {
      fetchRooms();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchRooms();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isLoaded, me?.id]);

  if (!isLoaded)
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );

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
                lastChatAsMs={room.lastChatAtMs}
                content={room.lastChat}
                unreadCount={room.unreadCount}
                profileImageUrls={room.profileImageUrls}
                onClick={() => {
                  router.push(`/chat/${encodeURIComponent(room.id)}`);
                }}
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

// loading spinner
const LoadingWrapper = styled.div`
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #ff5900;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
