export type ChatRoomsResponse = {
  notice: string;
  rooms: ChatRoomInfo[];
};

// 채팅방 정보
export type ChatRoomInfo = {
  group_id: string;
  channel_url: string;
  chat_code: string;
  matched_slot: { date: string; hour: number };
  restaurant: { id: string; name: string };
  member_count: number;
  members: Array<{ user_id: string; name: string }>;
  status: string;
  created_at: string;
};

// 프로필 정보
export type OtherUserProfile = {
  user_id: string;
  name: string;
  department: string;
  student_id: string;
  is_verified: boolean;
  mbti: string;
  pre_test_result: string;
  interests: any[];
};
