'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Button from '@/components/BaseButton';
import { useRouter } from 'next/navigation';
import { Container, TextWrapper } from '../style';

export default function FreshStudentVerification() {
  const router = useRouter();
  return (
    <Container>
      <TextWrapper>
        <h1>합격증명서를 캡쳐해주세요!</h1>
        <p>이름, 생년월일, 모집단위가 포함되어 있어야 해요</p>
      </TextWrapper>
      <ImageWrapper>
        <Image
          src="/svgs/student-verification/admission-certificate.svg"
          alt="admission-certificate"
          width={162}
          height={251}
        />
        <Image
          src="/svgs/student-verification/camera.svg"
          alt="camera"
          width={84}
          height={60}
        />
      </ImageWrapper>
      <div style={{ position: 'absolute', bottom: 45, left: 23, right: 23 }}>
        <Button
          disabled={false}
          label="사진 등록하기"
          onClick={() => router.push('/student-verification/confirm')}
        />
      </div>
    </Container>
  );
}

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 107px;
  justify-content: center;
  align-items: center;
  gap: 33px;
`;
