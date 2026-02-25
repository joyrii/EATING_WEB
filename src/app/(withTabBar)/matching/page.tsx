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

import { getChatRooms, joinChat } from '@/api/matching';
import { ChatRoomInfo } from '@/type/chat';

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

type ApiRoom = {
  group_id: string;
  channel_url: string; // 예: match_4JM1S2 (서비스 식별자일 수도 있음)
  chat_code: string; // 예: 4JM1S2 (joinChat에 넣는 값)
  matched_slot: { date: string; hour: number };
  restaurant: { id: string; name: string };
  member_count: number;
  members: { user_id: string; name: string; profile_image?: string }[];
  status: string;
  created_at: string;
};

type UiRoom = {
  // API 기반
  apiChannelUrl: string;
  chatCode: string;

  // UI 표시
  title: { main: string; count: string };
  lastChat: string;
  lastChatAtMs: number;
  unreadCount: number;
  memberCount: number;
  profileImageUrl: string;
};

export default function Matching() {
  const router = useRouter();
  const { me, isLoaded } = useUser();

  const [notice, setNotice] = useState(
    '해당 채팅방은 약속 다음 날 사라집니다.',
  );
  const [rooms, setRooms] = useState<ChatRoomInfo[]>([]);
  const [channels, setChannels] = useState<any[]>([]);

  const [isFetching, setIsFetching] = useState(true);
  const fetchingRef = useRef(false);

  // ✅ 클릭 중복 방지
  const enteringRef = useRef(false);

  const fetchAll = async () => {
    if (!me?.id) return;
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setIsFetching(true);

    try {
      // 1) /chat/rooms
      const roomsRes = await getChatRooms();
      setNotice(roomsRes?.notice || '해당 채팅방은 약속 다음 날 사라집니다.');
      setRooms((roomsRes?.rooms ?? []) as ChatRoomInfo[]);

      // 2) Sendbird 채널 메타(최근메시지/안읽음/멤버수)
      await ensureSendbirdConnected(me.id, me.name, me.profile_image_url);

      const list = await listMyGroupChannels({
        userId: me.id,
        nickname: me.name,
        profileUrl: me.profile_image_url,
        limit: 50,
      });

      setChannels(list ?? []);
    } catch (e) {
      console.error('Failed to fetch /chat/rooms or channels:', e);
      setRooms([]);
      setChannels([]);
    } finally {
      fetchingRef.current = false;
      setIsFetching(false);
    }
  };

  // 첫 로드
  useEffect(() => {
    if (!isLoaded || !me?.id) return;
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, me?.id]);

  // ✅ enterChat: 목록에서 클릭할 때도 joinChat을 타고, 응답 channel_url로 이동
  const enterChat = async (room: ChatRoomInfo) => {
    if (!me?.id) return;
    if (enteringRef.current) return;

    enteringRef.current = true;

    try {
      const res = await joinChat({
        code: room.chat_code, // ✅ 핵심: chat_code로 입장
        user_id: me.id,
        nickname: me.name,
      });

      // ✅ joinChat 응답의 channel_url이 "진짜 sendbird channel url"일 가능성이 높음
      const channelUrl = String(res?.channel_url ?? '');

      if (!channelUrl) {
        // 응답이 이상하면 fallback으로 api channel_url라도 이동 시도
        router.push(`/chat/${encodeURIComponent(room.channel_url)}`);
        return;
      }

      router.push(`/chat/${encodeURIComponent(channelUrl)}`);
    } catch (e) {
      console.error('Failed to enter chat:', e);
      // 실패 시에도 fallback 이동(원하면 제거 가능)
      router.push(`/chat/${encodeURIComponent(room.channel_url)}`);
    } finally {
      enteringRef.current = false;
    }
  };

  const uiRooms: UiRoom[] = useMemo(() => {
    const channelMap = new Map<string, any>();
    (channels ?? []).forEach((ch) => channelMap.set(String(ch.url), ch));

    const merged: UiRoom[] = (rooms ?? []).map((r) => {
      const ch = channelMap.get(String(r.channel_url));

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
        typeof r.member_count === 'number'
          ? r.member_count
          : typeof ch?.memberCount === 'number'
            ? ch.memberCount
            : null;

      const title = formatRoomTitle({
        date: r.matched_slot?.date,
        hour: r.matched_slot?.hour,
        restaurantName: r.restaurant?.name,
        memberCount,
      });

      return {
        apiChannelUrl: r.channel_url,
        chatCode: r.chat_code,
        title,
        lastChat,
        lastChatAtMs,
        unreadCount,
        memberCount: memberCount ?? 1,
        profileImageUrl: '/images/chat/profile-default-3.png',
      };
    });

    merged.sort((a, b) => b.lastChatAtMs - a.lastChatAtMs);
    return merged;
  }, [rooms, channels]);

  const hasRooms = uiRooms.length > 0;

  if (!isLoaded || isFetching)
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

            {rooms.map((room) => {
              const ui = uiRooms.find(
                (u) => u.apiChannelUrl === room.channel_url,
              );

              if (!ui) return null;

              return (
                <ChatRoomItem
                  key={room.channel_url}
                  roomId={room.channel_url}
                  roomName={
                    <RoomTitle>
                      {ui.title.main}
                      {ui.title.count && (
                        <CountText>{ui.title.count}</CountText>
                      )}
                    </RoomTitle>
                  }
                  lastChatAsMs={ui.lastChatAtMs}
                  content={ui.lastChat}
                  unreadCount={ui.unreadCount}
                  memberCount={ui.memberCount}
                  profileImageUrl={ui.profileImageUrl}
                  onClick={() => enterChat(room)}
                />
              );
            })}
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
