'use client';

import localFont from 'next/font/local';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  ensureSendbirdConnected,
  listMyGroupChannels,
} from '@/lib/sendbird/client';
import ChatRoomItem from '@/components/chat/ChatRoomItem';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { fetchPendingMatches, getChatRooms } from '@/api/matching';

// 기본 프로필 이미지
const DEFAULT_PROFILE_URL = '/images/chat/profile-default-3.png';

function extractLastMessageText(last: any): string {
  if (!last) return '';
  if (typeof last.message === 'string') return last.message;
  if (last.url) return '[파일]';
  return '';
}

export function formatRoomTitle(params: {
  date?: string;
  hour?: number;
  restaurantName?: string;
  memberCount?: number | null;
}) {
  const { date, hour, restaurantName, memberCount } = params;

  const count = typeof memberCount === 'number' ? `(${memberCount})` : '';

  if (!date || typeof hour !== 'number' || !restaurantName) {
    return { main: '채팅방', count };
  }

  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d, hour, 0, 0);

  const mm = dt.getMonth() + 1;
  const dd = dt.getDate();

  const h = dt.getHours();
  const isPM = h >= 12;
  const hh12 = ((h + 11) % 12) + 1;
  const ampm = isPM ? '오후' : '오전';

  return {
    main: `${mm}/${dd} ${ampm} ${hh12}시 ${restaurantName}`,
    count,
  };
}

type UiRoom = {
  channelUrl: string;
  title: { main: string; count: string };
  lastChat: string;
  lastChatAtMs: number;
  unreadCount: number;
  profileImageUrls: string[];
  date?: string;
  hour?: number;
  restaurantName?: string;
};

export default function Matching() {
  const router = useRouter();
  const { me, isLoaded } = useUser();

  const [notice, setNotice] = useState(
    '해당 채팅방은 약속 다음 날 사라집니다.',
  );

  // 이 화면은 /reviews/pending 데이터를 기반으로 방 목록 만듦(백 /chat/rooms 미완 대응)
  const [pending, setPending] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const fetchingRef = useRef(false);

  const fetchAll = async () => {
    if (!me?.id) return;
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      // 1) pending(정답 데이터 대체)
      const p = await fetchPendingMatches();
      setPending(p ?? []);

      // 2) /chat/rooms가 살아있으면 notice만 사용 (없으면 기본 notice 유지)
      try {
        const roomsRes = await getChatRooms();
        if (roomsRes?.notice) setNotice(roomsRes.notice);
      } catch {
        // ignore
      }

      // 3) sendbird 채널 메타(최근메시지/안읽음/입장인원)
      await ensureSendbirdConnected(me.id, me.name, me.profile_image_url);

      const list = await listMyGroupChannels({
        userId: me.id,
        nickname: me.name,
        profileUrl: me.profile_image_url,
        limit: 50,
      });

      setChannels(list ?? []);
    } catch (e) {
      console.error('Failed to fetch pending or channels:', e);
      setPending([]);
      setChannels([]);
    } finally {
      fetchingRef.current = false;
    }
  };

  // 첫 로드
  useEffect(() => {
    if (!isLoaded || !me?.id) return;
    fetchAll();
  }, [isLoaded, me?.id]);

  // 포커스/복귀 시 갱신
  useEffect(() => {
    if (!isLoaded || !me?.id) return;

    const onFocus = () => fetchAll();
    const onVis = () => document.visibilityState === 'visible' && fetchAll();

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [isLoaded, me?.id]);

  // pending + sendbird 조인해서 uiRooms 만들기
  const uiRooms: UiRoom[] = useMemo(() => {
    const channelMap = new Map<string, any>();
    (channels ?? []).forEach((ch) => channelMap.set(String(ch.url), ch));

    const merged: UiRoom[] = (pending ?? []).map((p) => {
      const channelUrl = `match_${p.group_id}`;
      const ch = channelMap.get(channelUrl);

      const last = ch?.lastMessage;
      const lastChat = extractLastMessageText(last);

      const lastChatAtMs =
        typeof last?.createdAt === 'number'
          ? last.createdAt
          : typeof ch?.createdAt === 'number'
            ? ch.createdAt
            : 0;

      const unreadCount = Number(ch?.unreadMessageCount ?? 0);

      const memberCount =
        typeof ch?.memberCount === 'number' ? ch.memberCount : null;

      const title = formatRoomTitle({
        date: p.matched_slot?.date,
        hour: p.matched_slot?.hour,
        restaurantName: p.restaurant_name,
        memberCount,
      });

      const profileImageUrls = [DEFAULT_PROFILE_URL];

      return {
        channelUrl,
        title,
        lastChat,
        lastChatAtMs,
        unreadCount,
        profileImageUrls,
        date: p.matched_slot?.date,
        hour: p.matched_slot?.hour,
        restaurantName: p.restaurant_name,
      };
    });

    merged.sort((a, b) => b.lastChatAtMs - a.lastChatAtMs);
    return merged;
  }, [pending, channels]);

  const hasRooms = uiRooms.length > 0;

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
              <NoticeText>{notice}</NoticeText>
            </NoticeBox>

            {uiRooms.map((room) => (
              <ChatRoomItem
                key={room.channelUrl}
                roomId={room.channelUrl}
                roomName={
                  <RoomTitle>
                    {room.title.main}
                    {room.title.count && (
                      <CountText>{room.title.count}</CountText>
                    )}
                  </RoomTitle>
                }
                lastChatAsMs={room.lastChatAtMs}
                content={room.lastChat}
                unreadCount={room.unreadCount}
                profileImageUrls={room.profileImageUrls}
                onClick={() => {
                  router.push(`/chat/${encodeURIComponent(room.channelUrl)}`);
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
}

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

const RoomTitle = styled.span`
  font-weight: 600;
`;

const CountText = styled.span`
  color: #ff5900;
  margin-left: 4px;
  font-weight: 600;
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
