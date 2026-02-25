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
    // 서버사이드 API route를 통해 제출 (인앱 브라우저 세션 문제 우회)
    const res = await fetch('/api/verification/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error submitting verification:', error);
    throw error;
  }
};
