'use client';

import { useState } from 'react';
import styled from 'styled-components';

export default function ChatRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim() === '') return;
    // 메시지 전송 로직 추가
    setMessage('');
  };

  return (
    <>
      {/* 헤더 */}
      <Header>
        <BackButton>
          <img src="/svgs/chat/chevron-back.svg" alt="back" />
        </BackButton>
        <RoomName>
          3/2 오후 4시 진미당 <Participant>(4)</Participant>
        </RoomName>
      </Header>
      {/* 채팅 내용 */}
      <Content>{children}</Content>
      {/* 채팅 입력창 */}
      <ChatInputContainer>
        <ChatInput
          type="text"
          placeholder="채팅을 보내세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <SendButton onClick={sendMessage}>
          <img src="/svgs/chat/send.svg" alt="send" />
        </SendButton>
      </ChatInputContainer>
    </>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
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
  margin: auto;
`;

const Participant = styled.span`
  color: #ff5900;
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
