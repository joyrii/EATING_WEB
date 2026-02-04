import styled from 'styled-components';

type SenderType = 'user' | 'other' | 'system';

type ChatMessageProps = {
  roomId: number;
  senderType: SenderType;
  senderId?: number; // 'user' 또는 'other'인 경우에만 필요
  senderName?: string; // 'other'인 경우에만 필요
  profileImageUrl?: string; // 'other'인 경우에만 필요
  content: string;
  createdAt: string;
};

const ChatMessage = (props: ChatMessageProps) => {
  switch (props.senderType) {
    case 'user':
      return (
        <UserMessage content={props.content} createdAt={props.createdAt} />
      );
    case 'other':
      return (
        <OtherMessage
          content={props.content}
          createdAt={props.createdAt}
          senderName={props.senderName!}
          profileImageUrl={props.profileImageUrl}
        />
      );
    case 'system':
      return (
        <SystemMessage content={props.content} createdAt={props.createdAt} />
      );
    default:
      return null;
  }
};

export default ChatMessage;

function UserMessage({
  content,
  createdAt,
}: {
  content: string;
  createdAt: string;
}) {
  return (
    <MessageContainer style={{ justifyContent: 'flex-end' }}>
      <CreatedAtText>{createdAt}</CreatedAtText>
      <MessageText $senderType="user">{content}</MessageText>
    </MessageContainer>
  );
}

function OtherMessage({
  content,
  createdAt,
  senderName,
  profileImageUrl,
}: {
  content: string;
  createdAt: string;
  senderName: string;
  profileImageUrl?: string;
}) {
  return (
    <MessageContainer>
      <ProfileImage src={profileImageUrl} alt="profile" />
      <MessageBubble>
        <MessageSenderName>{senderName}</MessageSenderName>
        <MessageText $senderType="other">{content}</MessageText>
      </MessageBubble>
      <CreatedAtText>{createdAt}</CreatedAtText>
    </MessageContainer>
  );
}

function SystemMessage({
  content,
  createdAt,
}: {
  content: string;
  createdAt: string;
}) {
  return (
    <MessageContainer>
      <ProfileImage src="/images/chat/profile-image-1.jpeg" alt="profile" />
      <MessageBubbleContainer>
        <MessageBubble>
          <MessageSenderName>잇팅</MessageSenderName>
          <MessageText $senderType="system">{content}</MessageText>
        </MessageBubble>
        <CreatedAtText>{createdAt}</CreatedAtText>
      </MessageBubbleContainer>
    </MessageContainer>
  );
}

const MessageContainer = styled.div`
  width: auto;
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 12px;
`;

const ProfileImage = styled.img`
  width: 41px;
  height: 41px;
  border-radius: 17px;
  object-fit: cover;
`;

const MessageBubbleContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  gap: 2px;
`;

const MessageBubble = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 4px;
  margin-right: 7px;
`;

const MessageSenderName = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #000000;
`;

const MessageText = styled.p<{ $senderType: SenderType }>`
  font-size: 14px;
  font-weight: 500;
  background-color: ${(props) =>
    props.$senderType === 'system'
      ? '#FFEDE6'
      : props.$senderType === 'other'
        ? '#ffffff'
        : '#ff5900'};
  padding: 10px 14px;
  border-radius: 14px;
  ${(props) =>
    props.$senderType === 'other' || props.$senderType === 'system'
      ? `color: #000000;
      border-top-left-radius: 0;`
      : `color: #ffffff;
      border-top-right-radius: 0;`}
  max-width: 250px;
  white-space: pre-line;
`;

const CreatedAtText = styled.p`
  font-size: 9px;
  font-weight: 400;
  color: #8a8a8a;
  align-self: flex-end;
`;
