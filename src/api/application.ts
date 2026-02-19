import { api } from '@/api/axios-client';

// 매칭 라운드 및 신청 여부 조회
export async function getMatchingStatus() {
  try {
    const res = await api.get(`/matching/status`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch matching status:', error);
    throw error;
  }
}

// 식당 정보 불러오기
export async function getRestaurants() {
  try {
    const res = await api.get(`/restaurants`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    throw error;
  }
}

// 신청서 제출
type ApiSlot = { date: string; hour: number };
type ApplyMatchingPayload = {
  available_slots: ApiSlot[];
  excluded_restaurant_ids: string[];
  preferred_years: number[];
  excluded_mbti: string[];
};

export async function applyMatching(payload: ApplyMatchingPayload) {
  try {
    const res = await api.post(`/matching/apply`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to apply for matching:', error);
    throw error;
  }
}
