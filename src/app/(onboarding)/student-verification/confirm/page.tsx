'use client';

import styled from 'styled-components';
import Button from '@/components/BaseButton';
import { Container, TextWrapper } from '../style';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

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

function ConfirmInner() {
  const router = useRouter();
  const isKeyboardOpen = useKeyboardOpen();

  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const desc =
    from === 'enrolled'
      ? '모바일 학생증과 정보가 동일해야해요'
      : '합격증명서와 정보가 동일해야해요';

  const [studentNo, setStudentNo] = useState<string>('');
  const [department, setDepartment] = useState<string>('');

  useEffect(() => {
    if (from === 'enrolled') {
      setStudentNo(sessionStorage.getItem('studentNo') ?? '');
      setDepartment(sessionStorage.getItem('department') ?? '');
    } else {
      setStudentNo('26');
      setDepartment(sessionStorage.getItem('department') ?? '');
    }
  }, [from]);

  return (
    <Container>
      <Content>
        <TextWrapper>
          <h1>
            주연님!
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
              value={studentNo}
              onChange={(e) => setStudentNo(e.target.value)}
              style={{ height: '60px' }}
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
          label="확인"
          onClick={() => {
            sessionStorage.setItem('studentNo', studentNo);
            sessionStorage.setItem('department', department);
            router.push('/onboarding/mbti');
          }}
        />
      </ButtonWrapper>
    </Container>
  );
}

export default function StudentVerificationConfirm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmInner />
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
