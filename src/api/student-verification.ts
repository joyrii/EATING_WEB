import { api } from './axios-client';

// 사용자 이름 조회
export const fetchUsername = async (): Promise<string> => {
  try {
    const res = await api.get('/users/me');
    return res.data.name;
  } catch (error) {
    console.error('Error fetching username:', error);
    throw error;
  }
};

// 학생 인증 정보 제출
export type StudentType = 'enrolled' | 'freshman';

export type VerificationData = {
  student_type: StudentType;
  name: string;
  student_id: string | null; // 신입생은 학번 없음
  department: string;
};

export const submitVerification = async (
  verificationData: VerificationData,
) => {
  try {
    const res = await api.post('/verification/submit', verificationData);
    return res.data;
  } catch (error) {
    console.error('Error submitting verification:', error);
    throw error;
  }
};
