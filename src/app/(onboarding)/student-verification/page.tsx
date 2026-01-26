'use client';

import Image from 'next/image';
import Button from '@/components/BaseButton';
import { Container, ImageWrapper, TextWrapper } from './style';
import { useRouter } from 'next/navigation';

export default function StudentVerification() {
  const router = useRouter();
  return (
    <Container>
      <TextWrapper>
        <h1>
          모바일 학생증을
          <br />
          캡쳐해주세요!
        </h1>
        <p>헤이영 캠퍼스 홈화면을 캡쳐해주세요</p>
      </TextWrapper>
      <ImageWrapper>
        <Image
          src="/svgs/student-verification/student-id.svg"
          alt="student-id"
          width={150}
          height={206}
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
