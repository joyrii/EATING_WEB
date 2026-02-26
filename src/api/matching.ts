import { api } from '@/api/axios-client';
import { ChatRoomsResponse } from '@/type/chat';

export type PendingMatch = {
  group_id: string; // 채팅방 입장 code
  round_id: string;
  matched_slot: { date: string; hour: number };
  restaurant_name: string;
  members: { user_id: string; name: string }[];
  has_reviewed: boolean;
  total_capacity: number;
  member_count: number;
  common_interests: string[];
  student_years_text: string;
  personality_text: string;
};

export async function fetchPendingMatches(): Promise<PendingMatch[]> {
  try {
    const res = await api.get(`/reviews/pending`);
    return res.data as PendingMatch[];
  } catch (error) {
    console.error('Failed to fetch pending matches', error);
    throw error;
  }
}

export type JoinChatReq = {
  code: string; // group_id
  user_id: string;
  nickname?: string;
};

export type JoinChatRes = {
  channel_url: string;
  is_new: boolean;
};

export async function joinChat(body: JoinChatReq): Promise<JoinChatRes> {
  try {
    const res = await api.post(`/chat/join`, body);
    return res.data as JoinChatRes;
  } catch (error) {
    console.error('Failed to join chat', error);
    throw error;
  }
}

// 채팅방 조회
export async function getChatRooms(): Promise<ChatRoomsResponse> {
  try {
    const res = await api.get(`/chat/rooms`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch chat rooms', error);
    throw error;
  }
}

// 아이스브레이킹
type IceBreakingQuestion = {
  id: number;
  question: string;
};

export async function getIceBreakingQuestions(): Promise<
  IceBreakingQuestion[]
> {
  try {
    const res = await api.get(`/chat/icebreakers`);
    return res.data.questions as IceBreakingQuestion[];
  } catch (error) {
    console.error('Failed to fetch ice-breaking questions', error);
    throw error;
  }
}

export async function getOtherUserProfile(userId: string) {
  try {
    const res = await api.get(`/users/${userId}/profile`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch other user profile', error);
    throw error;
  }
}
