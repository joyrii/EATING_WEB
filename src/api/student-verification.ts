import { api } from './axios-client';

// 학생 인증 정보 제출
export type StudentType = 'enrolled' | 'freshman';

export type VerificationData = {
  student_type: StudentType;
  name: string;
  student_id: string | null; // 신입생은 학번 없음
  department: string;
  image_url?: string | null; // 학생증 이미지 URL
};

export const submitVerification = async (
  verificationData: VerificationData,
) => {
  try {
    const res = await api.post('/verification/submit', verificationData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error submitting verification:', error);
    throw error;
  }
};
