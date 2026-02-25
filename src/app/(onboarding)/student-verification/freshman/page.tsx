'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Button from '@/components/BaseButton';
import { useRouter } from 'next/navigation';
import { Container, TextWrapper } from '../style';
import { useRef, useState } from 'react';
import { serverOcr } from '@/lib/ocr/serverOcr';
import { downscaleImage } from '@/lib/image/downscaleImage';

export default function FreshStudentVerification() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요!');
      return;
    }

    e.target.value = '';
    setLoading(true);
    setErrorMsg('');

    let department = '';

    try {
      const optimizedFile = await downscaleImage(file);

      try {
        const result = await serverOcr(optimizedFile, 'freshman');
        department = result.department;
        sessionStorage.setItem('studentIdText', result.raw);
      } catch (ocrError) {
        console.warn('OCR failed, proceeding with manual input:', ocrError);
      }

      sessionStorage.setItem('department', department);

      router.push('/student-verification/confirm?from=freshman');
    } catch (error) {
      console.error(error);
      setErrorMsg('인증에 실패하였습니다!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <TextWrapper>
        <div style={{ height: 36, display: 'flex', justifyContent: 'center' }}>
          {errorMsg && (
            <Image
              src="/svgs/caution.svg"
              alt="caution"
              width={36}
              height={36}
            />
          )}
        </div>
        <h1 style={errorMsg ? { color: '#FF5900' } : undefined}>
          {errorMsg ? errorMsg : '합격 증명서를 캡쳐해주세요!'}
        </h1>
        <p>이름, 생년월일, 모집단위가 포함되어있어야해요.</p>
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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {loading && <Status>이미지 인식 중...</Status>}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <div style={{ position: 'absolute', bottom: 45, left: 23, right: 23 }}>
        <Button
          disabled={false}
          label="사진 등록하기"
          onClick={handlePickImage}
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

const Status = styled.p`
  margin-top: 12px;
  padding: 0 23px;
  font-size: 14px;
  color: #555555;
`;
