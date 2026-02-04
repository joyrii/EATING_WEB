import styled from 'styled-components';

export default function ChatRoomLayout() {
  return (
    <>
      {/* 헤더 */}
      <Header>
        <img src="/svgs/chat/chevron-back.svg" alt="back" />
        <RoomName>
          3/2 오후 4시 진미당 <Participant>(4)</Participant>
        </RoomName>
      </Header>
      {/* 채팅 입력창 */}
      <ChatInputContainer>
        <ChatInput type="text" placeholder="채팅을 보내세요" />
        <SendButton>
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

const RoomName = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: auto;
`;

const Participant = styled.span`
  color: #ff5900;
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
