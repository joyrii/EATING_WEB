import ChatRoomClient from './ChatRoomClient';
import { ChatRoomInfo } from '@/type/chat';

export default function ChatRoomPage({ roomInfo }: { roomInfo: ChatRoomInfo }) {
  return <ChatRoomClient roomInfo={roomInfo} />;
}
