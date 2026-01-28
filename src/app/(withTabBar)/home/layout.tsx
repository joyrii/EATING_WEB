'use client';

import { MatchingContext } from './context';
import { MatchingStatus } from '@/constants/MATCHING';
import { useState } from 'react';
import { matchingSectionText } from '@/constants/MATCHING';
import { IoChevronForward } from 'react-icons/io5';
import styled from 'styled-components';
import localFont from 'next/font/local';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStatus, setCurrentStatus] = useState<MatchingStatus>('before');

  return (
    <MatchingContext.Provider value={{ currentStatus, setCurrentStatus }}>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        {currentStatus === 'completed' ? (
          <>
            <Header $variant="title">
              <LogoTitle alt="logo-title" />
              <IoChevronForward size={24} color="#3D3D3D" />
            </Header>
          </>
        ) : (
          <Header $variant="logo">
            <HeaderText>잇팅</HeaderText>
            <LogoCharacter alt="logo-character" />
          </Header>
        )}
        <Body>
          <AdBanner>
            <AdBannerTextContainer>
              <AdBannerUpperText>광고 배너 으아아악</AdBannerUpperText>
              <AdBannerLowerText>블라블라블라블라</AdBannerLowerText>
            </AdBannerTextContainer>
            <AdBannerIcon alt="ad-banner-icon" />
          </AdBanner>
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

// 광고 배너
const AdBanner = styled.div`
  height: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 23px;
  margin-top: 8px;
  background-color: #f5f5f5;
  border-radius: 10px;
`;

const AdBannerIcon = styled.img.attrs({
  src: '/svgs/home/ad-banner-icon.svg',
  width: 46,
  height: 44,
})``;

const AdBannerTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AdBannerUpperText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #575757;
  line-height: 150%;
`;

const AdBannerLowerText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #575757;
  line-height: 145%;
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

// 가이드 섹션
const GuideSection = styled.div`
  margin-top: 44px;
  gap: 16px;
`;

const GuideScroll = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;
