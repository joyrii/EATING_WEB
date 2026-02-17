import { api } from './axios-client';

// 약관 목록 조회
export const getTerms = async () => {
  try {
    const res = await api.get('/terms');
    return res.data;
  } catch (error) {
    console.error('Error fetching terms:', error);
    throw error;
  }
};

// 약관 동의
export const agreeToTerms = async (termsIds: string[]) => {
  try {
    const res = await api.post('/terms/agree', {
      term_ids: termsIds,
    });
    return res.data;
  } catch (error) {
    console.error('Error agreeing to terms:', error);
    throw error;
  }
};
