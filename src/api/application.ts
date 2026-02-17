import { api } from '@/api/axios-client';

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
