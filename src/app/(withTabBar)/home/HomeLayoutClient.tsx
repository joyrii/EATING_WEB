'use client';

import { MatchingContext } from './context';
import { MatchingStatus } from '@/constants/MATCHING';
import { useState } from 'react';
import { matchingSectionText } from '@/constants/MATCHING';
import styled from 'styled-components';
import localFont from 'next/font/local';

export default function HomeLayoutClient({
  children,
  banners,
}: {
  banners: any[];
  children: React.ReactNode;
}) {
  const [currentStatus, setCurrentStatus] = useState<MatchingStatus>('before');

  const banner = banners[0];

  return (
    <MatchingContext.Provider value={{ currentStatus, setCurrentStatus }}>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header $variant="logo">
          <HeaderText>잇팅</HeaderText>
          <LogoCharacter alt="logo-character" />
        </Header>
        <Body>
          <TipBanner>
            <TipBannerTextWrapper>
              <TipMainText>{banner.title}</TipMainText>
              <TipSubText>{banner.subtitle}</TipSubText>
            </TipBannerTextWrapper>
            <TipBannerImage
              src={`/images/${banner.image_url}`}
              alt="banner-character"
              width={80}
            />
          </TipBanner>
          <MatchingSection>
            <MatchingText>
              <SectionTitle>
                {matchingSectionText[currentStatus].title}
              </SectionTitle>
              <MatchingDescription $currentStatus={currentStatus}>
                {matchingSectionText[currentStatus].description}
              </MatchingDescription>
            </MatchingText>
            <MatchingButtonArea $currentStatus={currentStatus}>
              <MatchingButton
                onClick={() => {
                  // (임의) 매칭 상태 변경
                  if (currentStatus === 'before')
                    setCurrentStatus('inProgress');
                  else if (currentStatus === 'inProgress')
                    setCurrentStatus('completed');
                  else setCurrentStatus('before');
                }}
                $currentStatus={currentStatus}
              >
                매칭 신청하러 가기
              </MatchingButton>
            </MatchingButtonArea>
          </MatchingSection>
          {children}
        </Body>
      </div>
    </MatchingContext.Provider>
  );
}

// 헤더
const HeaderFont = localFont({
  src: '../../fonts/Hakgyoansim-Dunggeunmiso-OTF-R.otf',
  weight: '400',
});

const Header = styled.header<{ $variant: 'logo' | 'title' }>`
  width: 100%;
  background-color: #fafafa;
  font-family: ${HeaderFont.style.fontFamily};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-block: 8px;
  padding-left: 24px;
  position: sticky;
  top: 0;

  ${({ $variant }) =>
    $variant === 'title'
      ? `justify-content: space-between;
      padding-block: 15px;
      padding-right: 24px;`
      : null}
`;

const HeaderText = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 36px;
  color: #ff5900;
`;

const LogoCharacter = styled.img.attrs({
  src: '/svgs/home/eating-logo-character.svg',
  width: 40,
  height: 44,
})`
  margin-left: 4px;
`;

const LogoTitle = styled.img.attrs({
  src: '/svgs/home/eating-logo-title.svg',
  width: 106,
  height: 28,
})`
  margin-block: 7px;
`;

// 팁 배너
const TipBanner = styled.button`
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 17px;
  margin-top: 15px;
`;

const TipBannerTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TipMainText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #3d3d3d;
  text-align: left;
`;

const TipSubText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #575757;
  text-align: left;
`;

const TipBannerImage = styled.img`
  margin-right: 5px;
`;

// 바디
const Body = styled.main`
  padding-inline: 27px;
`;

// 매칭 섹션
const MatchingSection = styled.div`
  margin-top: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px 20px;
  border: 1px solid #f0f0f0;
`;

const MatchingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 21px;
  font-weight: 600;
  line-height: 150%;
  color: #232323;
  span {
    color: #ff5900;
  }
`;

const MatchingDescription = styled.p<{ $currentStatus?: string }>`
  font-size: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '14px' : '10px'};
  font-weight: 400;
  line-height: 145%;
  color: #a3a3a3;
  letter-spacing: -0.01em;
`;

const MatchingButtonArea = styled.div<{ $currentStatus?: string }>`
  margin-top: ${({ $currentStatus }) =>
    $currentStatus === 'completed' ? '20px' : '45px'};
  display: flex;
  justify-content: flex-end;
`;

const MatchingButton = styled.button<{ $currentStatus?: string }>`
  width: 170px;
  height: 50px;
  border-radius: 10px;
  background-color: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '#F0F0F0' : '#ff5900'};
  color: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '#d6d6d6' : '#ffffff'};
  font-size: 16px;
  font-weight: 700;
  line-height: 145%;
  border: none;
`;
