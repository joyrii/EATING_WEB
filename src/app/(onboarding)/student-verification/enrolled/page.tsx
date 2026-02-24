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
import { useUser } from '@/context/userContext';

async function downscaleImage(
  file: File,
  maxWidth = 1000,
  quality = 0.82,
): Promise<File> {
  const img = document.createElement('img');
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;

  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = rej;
  });

  URL.revokeObjectURL(objectUrl);

  const scale = Math.min(1, maxWidth / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality),
  );

  return new File([blob], 'verification.jpg', { type: 'image/jpeg' });
}

export default function EnrolledStudentVerification() {
  const router = useRouter();
  const { me } = useUser();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    e.target.value = '';

    setLoading(true);
    setProgress(0);
    setErrorMsg('');

    try {
      const optimizedFile = await downscaleImage(file);
      const text = await tesseractModule(optimizedFile, setProgress);
      const parsed = parseStudentIdText(text);

      const studentId = parsed?.studentId ?? '';
      const department = parsed?.department ?? '';

      sessionStorage.setItem('studentId', studentId);
      sessionStorage.setItem('department', department);
      sessionStorage.setItem('studentIdText', text.slice(0, 2000));

      if (me?.id) {
        uploadVerificationImage({ file: optimizedFile, userId: me.id })
          .then(({ path, imageUrl }) => {
            sessionStorage.setItem('studentIdImgPath', path);
            sessionStorage.setItem('studentIdImgUrl', imageUrl);
          })
          .catch((e) => console.error('upload failed:', e));
      }

      router.push('/student-verification/confirm?from=enrolled');
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
