import { api } from '@/api/axios-client';

// 배너 가져오기
export async function getBanners() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch banners');
  }
  return res.json();
}

// 온보딩 상태 가져오기
export async function getOnboardingStatus() {
  try {
    const res = await api.get(`/users/me`);
    return res.data.onboarding_step;
  } catch (error) {
    console.error('Failed to fetch onboarding status', error);
    throw error;
  }
}

// 이름 가져오기
export async function getMe() {
  try {
    const res = await api.get(`/users/me`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch user info', error);
    throw error;
  }
}
