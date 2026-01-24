"use client";

import { MatchingContext, MatchingStatus } from "./context";
import {
  Body,
  Header,
  HeaderText,
  LogoCharacter,
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
} from "./style";
import { useState } from "react";
import { matchingSectionConfig } from "@/constants/MATCHING";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStatus, setCurrentStatus] = useState<MatchingStatus>("before");

  return (
    <MatchingContext.Provider value={{ currentStatus, setCurrentStatus }}>
      <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
        <Header>
          <HeaderText>잇팅</HeaderText>
          <LogoCharacter alt="logo-character" />
        </Header>
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
                {matchingSectionConfig[currentStatus].title}
              </SectionTitle>
              <MatchingDescription $currentStatus={currentStatus}>
                {matchingSectionConfig[currentStatus].description}
              </MatchingDescription>
            </MatchingText>
            <MatchingButtonArea $currentStatus={currentStatus}>
              <MatchingButton
                onClick={() => {
                  // (임의) 매칭 상태 변경
                  if (currentStatus === "before")
                    setCurrentStatus("inProgress");
                  else if (currentStatus === "inProgress")
                    setCurrentStatus("completed");
                  else setCurrentStatus("before");
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
