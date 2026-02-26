'use client';

import styled from 'styled-components';
import BaseButton from '@/components/BaseButton';
import { useRouter } from 'next/navigation';

export default function NoshowComplete() {
  const router = useRouter();

  return (
    <Container>
      <TextWrapper>
        <img src="/svgs/feedback/complete.svg" alt="complete" width={50} />
        <Title>제출 완료</Title>
        <Description>의견을 제출해주셔서 감사합니다!</Description>
      </TextWrapper>
      <ButtonWrapper>
        <BaseButton label="완료" onClick={() => router.replace('/home')} />
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  margin-top: 12px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #a3a3a3;
  margin-top: 7px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 20px;
  position: fixed;
  bottom: 20px;
`;
