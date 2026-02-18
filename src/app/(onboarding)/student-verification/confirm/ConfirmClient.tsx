'use client';

import styled from 'styled-components';
import Button from '@/components/BaseButton';
import { Container, TextWrapper } from '../style';
import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { submitVerification } from '@/api/student-verification';
import toast from 'react-hot-toast';

type Props = {
  name: string;
};

// 키보드 올라왔을 때 버튼 숨김
function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  const maxVhRef = useRef<number | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;

    const update = () => {
      if (vv) {
        maxVhRef.current = Math.max(maxVhRef.current ?? 0, vv.height);

        const ratio = vv.height / (maxVhRef.current || vv.height);
        setOpen(ratio < 0.85);
      } else {
        setOpen(window.innerHeight < window.screen.height * 0.75);
      }
    };

    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    window.addEventListener('resize', update);

    update();
    return () => {
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
      window.removeEventListener('resize', update);
    };
  }, []);

  return open;
}

function ConfirmInner({ name }: Props) {
  const router = useRouter();
  const isKeyboardOpen = useKeyboardOpen();

  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const isEnrolled = from === 'enrolled';
  const desc = isEnrolled
    ? '모바일 학생증과 정보가 동일해야해요'
    : '합격증명서와 정보가 동일해야해요';

  const [studentId, setStudentId] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 학과, 학번 불러오기
  useEffect(() => {
    setDepartment(sessionStorage.getItem('department') ?? '');
    if (isEnrolled) {
      setStudentId(sessionStorage.getItem('studentId') ?? '');
    } else {
      setStudentId('');
    }
  }, [isEnrolled]);

  // 제출 핸들러
  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (!department.trim()) return false;
    if (isEnrolled && !studentId.trim()) return false;
    return true;
  }, [department, studentId, isSubmitting, isEnrolled]);

  const onConfirm = async () => {
    if (!department.trim()) {
      toast.error('학과를 입력해주세요.');
      return;
    }

    if (isEnrolled && !studentId.trim()) {
      toast.error('학번을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      await submitVerification({
        student_type: isEnrolled ? 'enrolled' : 'freshman',
        name,
        student_id: isEnrolled ? studentId.trim() : null, // 신입생은 null
        department: department.trim(),
      });

      if (isEnrolled) sessionStorage.setItem('studentId', studentId.trim());
      sessionStorage.setItem('department', department.trim());

      router.push('/home');
    } catch (error) {
      console.log('Verification submission error:', error);
      toast.error('인증 정보 제출에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Content>
        <TextWrapper>
          <h1>
            {name}님!
            <br />
            정보가 맞는지 확인해주세요!
          </h1>
          <p>{desc}</p>
        </TextWrapper>
        <FormWrapper>
          <InputWrapper>
            <label htmlFor="studentId">학번</label>
            <input
              id="studentId"
              name="studentId"
              value={isEnrolled ? studentId : '26'}
              onChange={(e) => setStudentId(e.target.value)}
              style={{ height: '60px' }}
              disabled={!isEnrolled}
            />
          </InputWrapper>
          <InputWrapper>
            <label htmlFor="department">학과</label>
            <input
              id="department"
              name="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{ height: '60px' }}
            />
          </InputWrapper>
        </FormWrapper>
      </Content>
      <ButtonWrapper $hidden={isKeyboardOpen}>
        <Button
          label={isSubmitting ? '처리 중...' : '확인'}
          onClick={onConfirm}
          disabled={!canSubmit}
        />
      </ButtonWrapper>
    </Container>
  );
}

export default function StudentVerificationConfirm({ name }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmInner name={name} />
    </Suspense>
  );
}

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-bottom: 15px;
`;

const ButtonWrapper = styled.div<{ $hidden: boolean }>`
  position: fixed;
  bottom: 45px;
  left: 23px;
  right: 23px;
  display: ${({ $hidden }) => ($hidden ? 'none' : 'block')};
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 57px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  label {
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0;
  }

  input {
    width: 100%;
    height: 70px;
    border: 1px solid #d6d6d6;
    border-radius: 15px;
    padding: 23px 24px;
    font-size: 16px;
    font-weight: 500;
    line-height: 145%;
    letter-spacing: -0.01em;
  }
`;
