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
