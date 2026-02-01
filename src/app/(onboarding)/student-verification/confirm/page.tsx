'use client';

import styled from 'styled-components';
import Button from '@/components/BaseButton';
import { Container, TextWrapper } from '../style';
import { useState, useEffect, useRef } from 'react';

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

export default function StudentVerificationConfirm() {
  const isKeyboardOpen = useKeyboardOpen();

  return (
    <Container>
      <Content>
        <TextWrapper>
          <h1>
            주연님!
            <br />
            정보가 맞는지 확인해주세요!
          </h1>
          <p>모바일 학생증과 정보가 동일해야해요</p>
        </TextWrapper>
        <FormWrapper>
          <InputWrapper>
            <label htmlFor="studentId">학번</label>
            <input id="studentId" name="studentId" />
          </InputWrapper>
          <InputWrapper>
            <label htmlFor="department">학과</label>
            <input id="department" name="department" />
          </InputWrapper>
        </FormWrapper>
      </Content>
      <ButtonWrapper $hidden={isKeyboardOpen}>
        <Button disabled={false} label="확인" />
      </ButtonWrapper>
    </Container>
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
  position: absolute;
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
