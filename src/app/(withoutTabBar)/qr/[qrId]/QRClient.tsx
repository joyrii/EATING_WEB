'use client';

import { getQRInfo } from '@/api/qr';
import BaseButton from '@/components/BaseButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function QRPage({ qrId }: { qrId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [qrInfo, setQRInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await getQRInfo(qrId);
        setQRInfo(res);
      } catch (e: any) {
        const status = e?.response?.status;

        if (status === 403) {
          alert('로그인이 필요합니다.');
          const currentUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
          router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
          return;
        }

        console.error('QR fetch error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQR();
  }, [qrId, router]);

  if (isLoading) {
    return (
      <LoadingPage>
        <Spinner />
        <LoadingMainText>쿠폰 발급 중입니다...</LoadingMainText>
        <LoadingSubText>조금만 기다려주세요!</LoadingSubText>
      </LoadingPage>
    );
  }

  if (!qrInfo) {
    return null;
  }

  return (
    <Wrapper>
      <Background src="/svgs/qr/bg.svg" />
      <TextWrapper>
        <MainText>쿠폰 활성화!</MainText>
        <SubText>사장님께 쿠폰을 보여드리고 서비스를 제공 받으세요!</SubText>
      </TextWrapper>
      <ImageWrapper>
        <img
          src={qrInfo?.coupon_image_url}
          alt="coupon"
          width={217}
          height={270}
        />
      </ImageWrapper>
      <Description>
        해당 쿠폰은 1회성 쿠폰이며, 가게 내부에서만
        <br />
        사용 가능합니다. 즐거운 잇팅 되세요!
      </Description>
      <ButtonWrapper>
        <BaseButton label="완료" onClick={() => router.push('/home')} />
      </ButtonWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.img`
  width: 100%;
  position: absolute;
  top: -130px;
  z-index: -1;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 120px;
`;

const MainText = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #000;
`;

const SubText = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #000;
  margin-top: 2px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 23px;
`;

const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #8a8a8a;
  text-align: center;
  margin-top: 14px;
`;

const ButtonWrapper = styled.div`
  width: 85%;
  margin-top: auto;
  margin-bottom: 30px;
`;

const LoadingPage = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #ff5900;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingMainText = styled.h1`
  font-size: 26px;
  font-weight: 600;
  margin-top: 12px;
  margin-bottom: 7px;
`;

const LoadingSubText = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #a3a3a3;
`;
