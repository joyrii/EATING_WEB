'use client';

import localFont from 'next/font/local';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ensureSendbirdConnected } from '@/lib/sendbird/client';
import ChatRoomItem from '@/components/chat/ChatRoomItem';
import { useUser } from '@/context/userContext';
import { getSendbirdInstance } from '@/lib/sendbird/client';
import { useRouter } from 'next/navigation';
import { fetchPendingMatches } from '@/api/matching';

interface RoomData {
  id: string;
  title: string;
  lastChat: string;
  lastChatAtMs: number;
  unreadCount: number;
  profileImageUrls: string[];
}

// 기본 프로필 이미지
const DEFAULT_PROFILE_URL = [
  '/images/chat/profile-default-1.png',
  '/images/chat/profile-default-2.png',
  '/images/chat/profile-default-3.png',
] as const;

export function formatRoomTitle(params: {
  date: string; // 'YYYY-MM-DD'
  hour: number; // 0~23
  restaurantName: string;
  memberCount?: number | null;
}) {
  const { date, hour, restaurantName, memberCount } = params;
  const countText = typeof memberCount === 'number' ? ` (${memberCount})` : '';

  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d, hour, 0, 0);

  const mm = dt.getMonth() + 1;
  const dd = dt.getDate();

  const h = dt.getHours();
  const isPM = h >= 12;
  const hh12 = ((h + 11) % 12) + 1;
  const ampm = isPM ? '오후' : '오전';

  return `${mm}/${dd} ${ampm} ${hh12}시 ${restaurantName}${countText}`;
}

// 프로필이 없는 멤버 리스트
function mapMemberProfileUrls(members: any[]) {
  const noProfile = members
    .filter((m) => !m.profileUrl || String(m.profileUrl).trim() === '')
    .slice()
    .sort((a, b) => a.userId.localeCompare(b.userId));

  const assigned = new Map<string, string>();
  noProfile.forEach((member, index) => {
    assigned.set(
      String(member.userId),
      DEFAULT_PROFILE_URL[index % DEFAULT_PROFILE_URL.length],
    );
  });

  return members.map((m) => {
    const url =
      m.profileUrl && String(m.profileUrl).trim() !== ''
        ? m.profileUrl
        : assigned.get(String(m.userId));
    return url || DEFAULT_PROFILE_URL[0];
  });
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
      await ensureSendbirdConnected(me.id, me.name, me.profile_image_url);

      const sb = getSendbirdInstance();

      const pending = await fetchPendingMatches();
      const pendingMap = new Map(pending.map((s: any) => [s.group_id, s]));

      const query = sb.groupChannel.createMyGroupChannelListQuery({
        includeEmpty: true,
        limit: 50,
        order: 'latest_last_message',
      });

      const channels = await query.next();

      const mapped: RoomData[] = channels.map((channel: any) => {
        const slot = pendingMap.get(channel.url);

        const title = slot
          ? formatRoomTitle({
              date: slot.matched_slot.date,
              hour: slot.matched_slot.hour,
              restaurantName: slot.restaurant_name,
              memberCount: channel.memberCount ?? channel.members?.length,
            })
          : channel.name || '채팅방';

        const last = channel.lastMessage;
        const lastText = last?.message ?? (last?.url ? '[파일]' : '');

        const createdAtMs = last?.createdAt ?? channel.createdAt ?? Date.now();

        const profileImageUrls = mapMemberProfileUrls(
          channel.members ?? [],
        ).slice(0, 4);

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
