import ChatMessage from '@/components/chat/ChatMessage';

export default async function ChatRoom({
  params,
}: {
  params: { chatRoom: string };
}) {
  const chatRoom = await params;
  const roomId = Number(chatRoom);

  return (
    <div>
      <ChatMessage
        roomId={roomId}
        senderType="system"
        content={`안녕하세요 팅팅이들 😆 \n 잇팅방에 들어오신 걸 환영합니다`}
        createdAt="6:00 PM"
      />
      <ChatMessage
        roomId={roomId}
        senderType="other"
        senderName="김방어"
        profileImageUrl="/images/chat/profile-image-3.jpeg"
        content="안녕하세요!! 저는 독문과 25학번 김방어입니다! 같이 푸파 맛있게 해용 ㅎㅎ"
        createdAt="6:05 PM"
      />
      <ChatMessage
        roomId={roomId}
        senderType="user"
        content="안녕하세요! 저는 불어불문 26학번 김이화라고 합니당~ 잘 부탁드려요!!"
        createdAt="6:10 PM"
      />
    </div>
  );
}
