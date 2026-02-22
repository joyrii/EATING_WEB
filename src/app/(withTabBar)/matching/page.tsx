'use client';

import localFont from 'next/font/local';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ensureSendbirdConnected } from '@/lib/sendbird/client';
import ChatRoomItem from '@/components/chat/ChatRoomItem';
import { useUser } from '@/context/userContext';
import { getSendbirdInstance } from '@/lib/sendbird/client';
import { useRouter } from 'next/navigation';
import { fetchPendingMatches, getChatRooms } from '@/api/matching';
import { ChatRoomFromApi } from '@/type/chat';

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

// 채팅방 제목 포맷 (eg. 2/1 오후 4시 진미당(4)
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
  const noProfile = (members ?? [])
    .filter((m) => !m.profileUrl || String(m.profileUrl).trim() === '')
    .slice()
    .sort((a, b) => String(a.userId).localeCompare(String(b.userId)));

  const assigned = new Map<string, string>();
  noProfile.forEach((member, index) => {
    assigned.set(
      String(member.userId),
      DEFAULT_PROFILE_URL[index % DEFAULT_PROFILE_URL.length],
    );
  });

  return (members ?? []).map((m) => {
    const url =
      m.profileUrl && String(m.profileUrl).trim() !== ''
        ? m.profileUrl
        : assigned.get(String(m.userId));

    return url || DEFAULT_PROFILE_URL[0];
  });
}

// UI용 ROOM
type UiRoom = {
  channelUrl: string;
  title: string;
  lastChat: string;
  lastChatAtMs: number;
  unreadCount: number;
  profileImageUrls: string[];
};

export default function Matching() {
  const router = useRouter();
  const { me, isLoaded } = useUser();

  const [notice, setNotice] = useState('');
  const [apiRooms, setApiRooms] = useState<ChatRoomFromApi[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const fetchingRef = useRef(false);

  const fetchAll = async () => {
    if (!me?.id) return;
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      // 1) 방 목록 (정답 데이터)
      const res = await getChatRooms();
      setNotice(res.notice ?? '');
      setApiRooms(res.rooms ?? []);

      // 2) sendbird: 내 채널 목록(최근메시지/안읽음/프로필URL 등 실시간 메타)
      await ensureSendbirdConnected(me.id, me.name, me.profile_image_url);

      const sb = getSendbirdInstance();
      const q = sb.groupChannel.createMyGroupChannelListQuery({
        includeEmpty: true,
        limit: 50,
        order: 'latest_last_message',
      });

      const list = await q.next();
      setChannels(list ?? []);
    } catch (e) {
      console.error('Failed to load chat rooms:', e);
      setNotice('');
      setApiRooms([]);
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

  // 백 rooms + sendbird channels 조인
  const uiRooms: UiRoom[] = useMemo(() => {
    const channelMap = new Map<string, any>();
    (channels ?? []).forEach((ch) => channelMap.set(String(ch.url), ch));

    const merged = (apiRooms ?? []).map((r) => {
      const ch = channelMap.get(String(r.channel_url));

      const last = ch?.lastMessage;
      const lastText = last?.message ?? (last?.url ? '[파일]' : '');
      const lastAt =
        last?.createdAt ??
        ch?.createdAt ??
        (r.created_at ? new Date(r.created_at).getTime() : Date.now());

      const memberCount =
        typeof r.member_count === 'number'
          ? r.member_count
          : (ch?.memberCount ??
            ch?.members?.length ??
            r.members?.length ??
            null);

      const title = formatRoomTitle({
        date: r.matched_slot?.date,
        hour: r.matched_slot?.hour,
        restaurantName: r.restaurant?.name,
        memberCount,
      });

      const profileImageUrls = ch?.members
        ? mapMemberProfileUrls(ch.members).slice(0, 4)
        : (r.members ?? [])
            .slice(0, 4)
            .map((m) =>
              m.profile_image && m.profile_image.trim()
                ? m.profile_image
                : DEFAULT_PROFILE_URL[0],
            );

      return {
        channelUrl: r.channel_url,
        title,
        lastChat: String(lastText ?? ''),
        lastChatAtMs: Number(lastAt ?? Date.now()),
        unreadCount: Number(ch?.unreadMessageCount ?? 0),
        profileImageUrls,
      };
    });

    // 최신 메시지 기준 정렬
    merged.sort((a, b) => b.lastChatAtMs - a.lastChatAtMs);
    return merged;
  }, [apiRooms, channels]);

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
                roomName={room.title}
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
