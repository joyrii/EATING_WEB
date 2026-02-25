'use client';

import { getChatRooms } from '@/api/matching';
import { formatRoomTitle } from '@/app/(withTabBar)/matching/page';
import { useUser } from '@/context/userContext';
import {
  ensureSendbirdConnected,
  getSendbirdInstance,
} from '@/lib/sendbird/client';
import { useParams, usePathname } from 'next/navigation';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { ChatRoomInfo } from '@/type/chat';

type RoomTitleState = { main: string; count: string };

export default function ChatRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ chatRoom: string }>();
  const roomId = params?.chatRoom ? decodeURIComponent(params.chatRoom) : '';
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null);

  const { me, isLoaded } = useUser();

  const [message, setMessage] = useState('');
  const roomRef = useRef<any>(null);

  const hideChatBar = pathname.endsWith('/cafe');

  // main / count 분리 상태
  const [roomTitle, setRoomTitle] = useState<RoomTitleState>({
    main: '채팅방',
    count: '',
  });

  useEffect(() => {
    if (!isLoaded || !me?.id || !roomId) return;

    let cancelled = false;

    const run = async () => {
      try {
        // 1) /chat/rooms로 제목 세팅
        const res = await getChatRooms();
        const r = (res.rooms ?? []).find((x: any) => x.channel_url === roomId);

        if (!cancelled && r) {
          setRoomInfo(r);
          const { main, count } = formatRoomTitle({
            date: r?.matched_slot?.date,
            hour: r?.matched_slot?.hour,
            restaurantName: r?.restaurant?.name,
            memberCount: r?.member_count,
          });

          setRoomTitle({ main, count });
        } else if (!cancelled) {
          setRoomTitle({ main: '채팅방', count: '' });
        }

        // 2) Sendbird connect + channel attach
        await ensureSendbirdConnected(me.id, me.name);
        const sb = getSendbirdInstance();
        const channel = await sb.groupChannel.getChannel(roomId);

        if (cancelled) return;
        roomRef.current = channel;
      } catch (e) {
        console.error('Failed to prepare chat room:', e);
        if (!cancelled) setRoomTitle({ main: '채팅방', count: '' });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, me?.id, me?.name, roomId]);

  const childrenWithProps = isValidElement(children)
    ? cloneElement(children as any, { roomInfo })
    : children;

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;

    const room = roomRef.current;
    if (!room) return;

    try {
      const result = room.sendUserMessage({ message: text });

      if (result && typeof (result as any).onSucceeded === 'function') {
        (result as any)
          .onSucceeded((msg: any) => {
            setMessage('');
            window.dispatchEvent(
              new CustomEvent('chat:new-message', { detail: { message: msg } }),
            );
          })
          .onFailed((e: any) => console.error(e));
      } else {
        const sent = await Promise.resolve(result);
        setMessage('');
        window.dispatchEvent(
          new CustomEvent('chat:new-message', { detail: { message: sent } }),
        );
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

        <RoomName>
          <RoomTitleText>{roomTitle.main}</RoomTitleText>
          {roomTitle.count ? <CountText>{roomTitle.count}</CountText> : null}
        </RoomName>

        <RightSlot />
      </Header>

      <Content style={{ marginBottom: '15px' }}>{childrenWithProps}</Content>

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
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.79002 2.62477C2.82702 2.16477 1.76902 3.04477 2.04402 4.07577L4.06002 11.6088C4.11054 11.7981 4.21557 11.9684 4.36207 12.0985C4.50856 12.2287 4.69006 12.3129 4.88402 12.3408L14.768 13.7528C15.054 13.7928 15.054 14.2068 14.768 14.2478L4.88502 15.6588C4.69106 15.6866 4.50956 15.7709 4.36307 15.901C4.21657 16.0311 4.11154 16.2014 4.06102 16.3908L2.04402 23.9278C1.76902 24.9578 2.82702 25.8378 3.79002 25.3788L25.288 15.1298C26.237 14.6778 26.237 13.3258 25.288 12.8728L3.79002 2.62477Z"
                fill={message.trim() ? '#FF5900' : '#F0F0F0'}
              />
            </svg>
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
  margin: 0;
`;

const RoomTitleText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
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

const CountText = styled.span`
  color: #ff5900;
  margin-left: 4px;
  font-weight: 600;
`;
