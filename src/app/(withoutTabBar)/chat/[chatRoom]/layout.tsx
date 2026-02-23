'use client';

import { getChatRooms } from '@/api/matching';
import { formatRoomTitle } from '@/app/(withTabBar)/matching/page';
import { useUser } from '@/context/userContext';
import {
  ensureSendbirdConnected,
  getSendbirdInstance,
} from '@/lib/sendbird/client';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function ChatRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ chatRoom: string }>();
  const roomId = params?.chatRoom ? decodeURIComponent(params.chatRoom) : '';

  const { me, isLoaded } = useUser();

  const [message, setMessage] = useState('');
  const roomRef = useRef<any>(null);

  const hideChatBar = pathname.endsWith('/cafe');

  // ✅ formatRoomTitle과 동일한 방식으로 출력될 "문자열" 제목
  const [roomTitleText, setRoomTitleText] = useState('채팅방');

  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;

    let cancelled = false;

    const run = async () => {
      try {
        // ✅ 1) /chat/rooms로 "실제 약속 정보" 기반 제목 세팅
        // (스펙: rooms[].matched_slot.date/hour, rooms[].restaurant.name, rooms[].member_count)
        const res = await getChatRooms();
        const r = (res.rooms ?? []).find((x: any) => x.channel_url === roomId);

        if (!cancelled && r) {
          const { main, count } = formatRoomTitle({
            date: r?.matched_slot?.date,
            hour: r?.matched_slot?.hour,
            restaurantName: r?.restaurant?.name,
            memberCount: r?.member_count,
          });
          setRoomTitleText(`${main} ${count}`.trim());
        } else if (!cancelled) {
          setRoomTitleText('채팅방');
        }

        // ✅ 2) Sendbird connect + channel attach
        await ensureSendbirdConnected(me.id, me.name);
        const sb = getSendbirdInstance();
        const channel = await sb.groupChannel.getChannel(roomId);

        if (cancelled) return;
        roomRef.current = channel;

        try {
          channel.markAsRead?.();
        } catch {}
      } catch (e) {
        console.error('Failed to prepare chat room:', e);
        if (!cancelled) setRoomTitleText('채팅방');
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id, me?.name, roomId]);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;

    const room = roomRef.current;
    if (!room) return;

    try {
      const result = room.sendUserMessage({ message: text });

      if (result && typeof (result as any).onSucceeded === 'function') {
        (result as any)
          .onSucceeded(() => {
            setMessage('');
            window.dispatchEvent(new Event('chat:refresh'));
          })
          .onFailed((e: any) => console.error(e));
      } else {
        await Promise.resolve(result);
        setMessage('');
        window.dispatchEvent(new Event('chat:refresh'));
      }
    } catch (e) {
      console.error('메시지 전송 실패:', e);
    }
  };

  return (
    <>
      <Header>
        <BackButton onClick={() => window.history.back()}>
          <img src="/svgs/chat/chevron-back.svg" alt="back" />
        </BackButton>

        <RoomName>{roomTitleText}</RoomName>

        <RightSlot />
      </Header>

      <Content style={{ marginBottom: '15px' }}>{children}</Content>

      {!hideChatBar && (
        <ChatInputContainer>
          <ChatInput
            type="text"
            placeholder="채팅을 보내세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <SendButton onClick={sendMessage}>
            <img src="/svgs/chat/send.svg" alt="send" />
          </SendButton>
        </ChatInputContainer>
      )}
    </>
  );
}

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: auto 1fr 40px;
  align-items: center;
  padding-left: 24px;
  padding-block: 15px;
  background-color: #fdfdfd;
`;

const BackButton = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
`;

const RoomName = styled.p`
  font-size: 16px;
  font-weight: 500;
  justify-self: center;
  text-align: center;
`;

const RightSlot = styled.div`
  width: 40px;
`;

const Content = styled.div`
  padding-inline: 24px;
  padding-bottom: 80px;
`;

const ChatInputContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 5px 32px 42px;
  background-color: #fafafa;
`;

const ChatInput = styled.input`
  flex: 1;
  height: 54px;
  background-color: #ffffff;
  color: #000000;
  border: none;
  border-radius: 30px;
  padding-left: 23px;
  font-size: 14px;
  font-weight: 500;

  &::placeholder {
    color: #8a8a8a;
  }

  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  margin-left: 12px;
  border: none;
  background-color: transparent;
`;
