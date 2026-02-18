'use client';

import { getQRInfo } from '@/api/qr';
import BaseButton from '@/components/BaseButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function QRPage({ qrId }: { qrId: string }) {
  const router = useRouter();
  const [qrInfo, setQRInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await getQRInfo(qrId);
      setQRInfo(res);
    })();
  }, [qrId]);

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
  top: -200px;
  z-index: -1;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
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
