"use client";

import { MatchingContext, matchingStatusList } from "./context";
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
import { MatchingStatus } from "./context";
import { useState } from "react";
import { matchingSectionConfig } from "@/constants/MATCHING";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStatus, setCurrentStatus] = useState<MatchingStatus>("before");

  console.log("currentStatus:", currentStatus);

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
            <MatchingButtonArea>
              <MatchingButton
                onClick={() => {
                  // (임의) 매칭 상태 변경
                  if (currentStatus === "before")
                    setCurrentStatus("inProgress");
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
