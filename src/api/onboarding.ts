import { api } from './axios-client';

// 관심사 목록 가져오기
export async function getInterests() {
  try {
    const res = await api.get(`/interests`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch interests:', error);
    throw error;
  }
}

// mbti 저장
export async function updateMbti(mbti: string) {
  try {
    const res = await api.put(`/users/me`, {
      mbti: mbti,
    });
    return res.data;
  } catch (error) {
    console.error('Failed to update MBTI:', error);
    throw error;
  }
}

// 관심사 저장
export async function updateInterests(interestIds: string[]) {
  try {
    const res = await api.put(`/users/me/interests`, {
      interest_ids: interestIds,
    });
    return res.data;
  } catch (error) {
    console.error('Failed to update interests:', error);
    throw error;
  }
}
