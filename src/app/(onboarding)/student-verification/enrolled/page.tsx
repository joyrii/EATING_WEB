'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Button from '@/components/BaseButton';
import { useRouter } from 'next/navigation';
import { Container, TextWrapper } from '../style';
import { useRef, useState } from 'react';
import { tesseractModule } from '@/lib/tesseract/tesseractModule';
import parseStudentIdText from '@/lib/tesseract/parseStudentId';
import { uploadVerificationImage } from '../uploadVerificationImage';
import { supabase } from '@/lib/supabase/client';

export default function EnrolledStudentVerification() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async (e) => {
      const result = reader.result;
      if (typeof result !== 'string') return;

      setImgSrc(result);

      setLoading(true);
      setProgress(0);
      setErrorMsg('');

      try {
        // OCR 처리
        const text = await tesseractModule(result, setProgress);
        const parsed = parseStudentIdText(text);

        const studentId = parsed.studentId ?? '';
        const department = parsed.department ?? '';

        if (!studentId || !department) {
          setErrorMsg('인증에 실패하였습니다!');
          setLoading(false);
          return;
        }

        // supabase 업로드
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const userId = user.id;
        const { path, imageUrl } = await uploadVerificationImage({
          file,
          userId,
        });

        sessionStorage.setItem('studentIdImg', result);
        sessionStorage.setItem('studentIdText', text);
        sessionStorage.setItem('studentId', studentId);
        sessionStorage.setItem('department', department);
        sessionStorage.setItem('studentIdImgPath', path);
        sessionStorage.setItem('studentIdImgUrl', imageUrl);
        console.log('Image uploaded to Supabase at path:', imageUrl);

        router.push('/student-verification/confirm?from=enrolled');
      } catch (error) {
        setErrorMsg('인증에 실패하였습니다!');
      } finally {
        setLoading(false);
      }
    };

    e.target.value = '';
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
          {errorMsg ? errorMsg : '모바일 학생증을 캡쳐해주세요!'}
        </h1>

        <p>
          {errorMsg
            ? '헤이영 캠퍼스 홈화면을 다시 캡처해주세요'
            : '헤이영 캠퍼스 홈화면을 캡쳐해주세요'}
        </p>
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

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {loading && <Status>이미지 인식 중... {progress}%</Status>}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <div style={{ position: 'absolute', bottom: 45, left: 23, right: 23 }}>
        <Button label="사진 등록하기" onClick={handlePickImage} />
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
