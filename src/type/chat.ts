export type ChatRoomsResponse = {
  notice: string;
  rooms: ChatRoomFromApi[];
};

export type ChatRoomFromApi = {
  group_id: string;
  channel_url: string;
  chat_code: string;
  matched_slot: {
    date: string; // "YYYY-MM-DD"
    hour: number; // 0~23
  };
  restaurant: {
    id: string;
    name: string;
  };
  member_count: number;
  members: {
    user_id: string;
    name: string;
    profile_image: string | null;
  }[];
  status: string;
  created_at: string; // ISO
};
