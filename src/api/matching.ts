import { api } from '@/api/axios-client';

export type PendingMatch = {
  group_id: string; // 채팅방 입장 code
  round_id: string;
  matched_slot: { date: string; hour: number };
  restaurant_name: string;
  members: { user_id: string; name: string }[];
  has_reviewed: boolean;
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
