import styled from 'styled-components';
import BaseChip from '../BaseChip';
import SYSTEM_CARD from '@/constants/SYSTEM_CARD';
import RestaurantCard from './RestaurantCard';

export type SenderType = 'user' | 'other' | 'system';

export type MessageType =
  | 'text'
  | 'restaurant'
  | 'couponCode'
  | 'noShowReport'
  | 'cafeList'
  | 'feedback';

export type RestaurantPayload = {
  id: number;
  name: string;
  category: string;
  benefit: string;
  menu: string;
  imageUrl: string;
};

export type CouponCodePayload = {
  code: string;
};

export type ChatMessageData = {
  id: string;
  senderType: SenderType;
  messageType: MessageType;

  senderId?: number; // user/other일 때만
  senderName?: string; // other일 때만
  profileImageUrl?: string; // other일 때만

  content?: string;
  createdAt: string; // ISO 원본

  payload?: RestaurantPayload | CouponCodePayload;
};

export type ChatAction =
  | { type: 'OPEN_RESTAURANT'; payload: RestaurantPayload }
  | { type: 'OPEN_NO_SHOW' }
  | { type: 'OPEN_CAFE_LIST' }
  | { type: 'OPEN_FEEDBACK' };

export type ChatMessageProps = ChatMessageData & {
  roomId: number; // 페이지에서 주입
  createdAtText: string; // "12:00 PM" 표시용
  showCreatedAt: boolean; // 마지막만 true
  showSenderName?: boolean; // other/system일 때만
  showProfileImage?: boolean; // other/system일 때만

  onAction?: (action: ChatAction) => void;
};

const ChatMessage = (props: ChatMessageProps) => {
  if (props.messageType !== 'text') {
    return <SystemBlockMessage {...props} />;
  }

  const content = props.content || '';
  switch (props.senderType) {
    case 'user':
      return (
        <UserMessage
          content={content}
          createdAt={props.createdAtText}
          showCreatedAt={props.showCreatedAt}
        />
      );
    case 'other':
      return (
        <OtherMessage
          content={content}
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
          content={content}
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

function SystemBlockMessage(props: ChatMessageProps) {
  const name = '잇팅';

  return (
    <MessageContainer>
      {props.showProfileImage ? (
        <ProfileImage src="/images/chat/profile-image-1.jpeg" alt="profile" />
      ) : (
        <ProfileImagePlaceholder />
      )}

      <MessageBubbleContainer>
        <MessageBubble>
          {props.showSenderName && (
            <MessageSenderName>{name}</MessageSenderName>
          )}
          {renderSystemBlock(props)}
        </MessageBubble>

        {props.showCreatedAt && (
          <CreatedAtText>{props.createdAtText}</CreatedAtText>
        )}
      </MessageBubbleContainer>
    </MessageContainer>
  );
}

function renderSystemBlock(props: ChatMessageProps) {
  switch (props.messageType) {
    case 'restaurant': {
      const payload = props.payload as RestaurantPayload;
      return (
        <RestaurantCard
          payload={payload}
          onClick={() => props.onAction?.({ type: 'OPEN_RESTAURANT', payload })}
        />
      );
    }

    case 'couponCode': {
      const code = (props.payload as CouponCodePayload).code;
      return (
        <CouponRow>
          {code.split('').map((d, i) => (
            <Digit key={`${d}-${i}`}>{d}</Digit>
          ))}
        </CouponRow>
      );
    }

    case 'noShowReport':
      return (
        <ActionCard
          $width={184}
          onClick={() => props.onAction?.({ type: 'OPEN_NO_SHOW' })}
        >
          <ActionTitleWrapper>
            <img src="/svgs/chat/noshow-caution.svg" alt="caution" />
            <ActionTitle>{SYSTEM_CARD.noShowTitle}</ActionTitle>
          </ActionTitleWrapper>
          <ActionDesc>{SYSTEM_CARD.noShowDesc}</ActionDesc>
          <ActionButton>
            <ActionButtonText>노쇼 신고하기</ActionButtonText>
          </ActionButton>
        </ActionCard>
      );

    case 'cafeList':
      return (
        <ActionCard
          $width={160}
          onClick={() => props.onAction?.({ type: 'OPEN_CAFE_LIST' })}
        >
          <ActionTitle>제휴 카페 리스트</ActionTitle>
          <ActionDescItem>
            <img src="/svgs/chat/cafe-count.svg" alt="cafe count" />
            <ActionDescShort>3곳</ActionDescShort>
          </ActionDescItem>
          <ActionDescItem>
            <img src="/svgs/chat/cafe-list.svg" alt="cafe list" />
            <ActionDescShort>다방방, 주디, 마마마마마마마</ActionDescShort>
          </ActionDescItem>
          <ActionButton>
            <ActionButtonText>카페 보기</ActionButtonText>
          </ActionButton>
        </ActionCard>
      );

    case 'feedback':
      return (
        <ActionCard
          $width={160}
          onClick={() => props.onAction?.({ type: 'OPEN_FEEDBACK' })}
        >
          <ActionTitle>
            <img src="/svgs/chat/feedback.svg" alt="feedback" />
            오늘의 잇팅 피드백
          </ActionTitle>
          <ActionDesc>{SYSTEM_CARD.feedbackDesc}</ActionDesc>
          <ActionButton>
            <ActionButtonText>피드백하기</ActionButtonText>
          </ActionButton>
        </ActionCard>
      );

    default:
      return null;
  }
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

const CouponRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const Digit = styled.div`
  width: 50px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  border: 1.2px solid #f0f0f0;
  border-radius: 12px;
  background-color: #ffffff;
`;

const ActionCard = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px;
  background-color: #ffffff;
  border: none;
  border-radius: 10px;
  width: ${(props) => props.$width}px;
  gap: 10px;
`;

const ActionTitleWrapper = styled.div`
  display: flex;
  gap: 5px;
  justify-content: left;
`;

const ActionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #232323;
  display: flex;
  align-items: center;
  gap: 2px;
  text-align: left;
`;

const ActionDesc = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #707070;
  text-align: left;

  strong {
    font-weight: 700;
  }
`;

const ActionDescItem = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  width: 100%;
`;

const ActionDescShort = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #707070;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1;
`;

const ActionButton = styled.button`
  width: 100%;
  padding-block: 6px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButtonText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #232323;
`;
