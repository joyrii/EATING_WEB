'use client';

import { MatchingContext } from './context';
import { MatchingStatus } from '@/constants/MATCHING';
import {
  Body,
  Header,
  HeaderText,
  LogoCharacter,
  LogoTitle,
  AdBanner,
  AdBannerIcon,
  AdBannerUpperText,
  AdBannerLowerText,
  AdBannerTextContainer,
  MatchingSection,
  MatchingText,
  SectionTitle,
  MatchingDescription,
  MatchingButtonArea,
  MatchingButton,
} from './style';
import { useState } from 'react';
import { matchingSectionText } from '@/constants/MATCHING';
import { IoChevronForward } from 'react-icons/io5';

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
