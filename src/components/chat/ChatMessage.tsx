import styled from 'styled-components';

export type SenderType = 'user' | 'other' | 'system';

export type ChatMessageData = {
  senderType: SenderType;
  senderId?: number; // user/other일 때만
  senderName?: string; // other일 때만
  profileImageUrl?: string; // other일 때만
  content: string;
  createdAt: string; // ISO 원본
};

export type ChatMessageProps = ChatMessageData & {
  roomId: number; // 페이지에서 주입
  createdAtText: string; // "12:00 PM" 표시용
  showCreatedAt: boolean; // 마지막만 true
  showSenderName?: boolean; // other/system일 때만
  showProfileImage?: boolean; // other/system일 때만
};

const ChatMessage = (props: ChatMessageProps) => {
  switch (props.senderType) {
    case 'user':
      return (
        <UserMessage
          content={props.content}
          createdAt={props.createdAtText}
          showCreatedAt={props.showCreatedAt}
        />
      );
    case 'other':
      return (
        <OtherMessage
          content={props.content}
          createdAt={props.createdAtText}
          senderName={props.senderName!}
          showSenderName={props.showSenderName}
          profileImageUrl={props.profileImageUrl}
          showProfileImage={props.showProfileImage}
          showCreatedAt={props.showCreatedAt}
        />
      );
    case 'system':
      return (
        <SystemMessage
          content={props.content}
          createdAt={props.createdAtText}
          showSenderName={props.showSenderName}
          showProfileImage={props.showProfileImage}
          showCreatedAt={props.showCreatedAt}
        />
      );
    default:
      return null;
  }
};

export default ChatMessage;

function UserMessage({
  content,
  createdAt,
  showCreatedAt,
}: {
  content: string;
  createdAt: string;
  showCreatedAt?: boolean;
}) {
  return (
    <MessageContainer style={{ justifyContent: 'flex-end' }}>
      {showCreatedAt && <CreatedAtText>{createdAt}</CreatedAtText>}
      <MessageText $senderType="user">{content}</MessageText>
    </MessageContainer>
  );
}

function OtherMessage({
  content,
  createdAt,
  senderName,
  profileImageUrl,
  showCreatedAt,
  showSenderName,
  showProfileImage,
}: {
  content: string;
  createdAt: string;
  senderName: string;
  profileImageUrl?: string;
  showSenderName?: boolean;
  showCreatedAt?: boolean;
  showProfileImage?: boolean;
}) {
  return (
    <MessageContainer>
      {showProfileImage ? (
        <ProfileImage src={profileImageUrl} alt="profile" />
      ) : (
        <ProfileImagePlaceholder />
      )}
      <MessageBubble>
        {showSenderName && <MessageSenderName>{senderName}</MessageSenderName>}
        <MessageText $senderType="other">{content}</MessageText>
      </MessageBubble>
      {showCreatedAt && <CreatedAtText>{createdAt}</CreatedAtText>}
    </MessageContainer>
  );
}

function SystemMessage({
  content,
  createdAt,
  showCreatedAt,
  showSenderName,
  showProfileImage,
}: {
  content: string;
  createdAt: string;
  showCreatedAt?: boolean;
  showSenderName?: boolean;
  showProfileImage?: boolean;
}) {
  const name = '잇팅';

  return (
    <MessageContainer>
      {showProfileImage ? (
        <ProfileImage src="/images/chat/profile-image-1.jpeg" alt="profile" />
      ) : (
        <ProfileImagePlaceholder />
      )}
      <MessageBubbleContainer>
        <MessageBubble>
          {showSenderName && <MessageSenderName>{name}</MessageSenderName>}
          <MessageText $senderType="system">{content}</MessageText>
        </MessageBubble>
        {showCreatedAt && <CreatedAtText>{createdAt}</CreatedAtText>}
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

const ProfileImagePlaceholder = styled.div`
  width: 41px;
  height: 41px;
  background-color: transparent;
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
