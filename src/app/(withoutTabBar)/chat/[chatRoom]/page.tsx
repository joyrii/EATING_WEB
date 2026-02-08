import ChatRoomClient from './ChatRoomClient';

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ chatRoom: string }>;
}) {
  const { chatRoom } = await params;
  const roomId = Number(chatRoom);

  return <ChatRoomClient roomId={roomId} />;
}
