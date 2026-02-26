import { api } from '@/api/axios-client';

export const getMyProfile = async () => {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateInterests = async (interest_ids: string[]) => {
  try {
    const res = await api.put(`/users/me/interests`, { interest_ids });
    return res.data;
  } catch (error) {
    console.error('Error updating interests:', error);
    throw error;
  }
};
