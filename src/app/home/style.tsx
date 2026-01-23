import localFont from "next/font/local";
import styled from "styled-components";

// 헤더
export const HeaderFont = localFont({
  src: "../fonts/Hakgyoansim-Dunggeunmiso-OTF-R.otf",
  weight: "400",
});

export const Header = styled.header`
  font-family: ${HeaderFont.style.fontFamily};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-block: 8px;
  padding-left: 24px;
`;

export const HeaderText = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 36px;
  color: #ff5900;
`;

export const LogoCharacter = styled.img.attrs({
  src: "/svgs/home/eating-logo-character.svg",
  width: 40,
  height: 44,
})`
  margin-left: 4px;
`;

// 광고 배너
export const AdBanner = styled.div`
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

export const AdBannerIcon = styled.img.attrs({
  src: "/svgs/home/ad-banner-icon.svg",
  width: 46,
  height: 44,
})``;

export const AdBannerTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const AdBannerUpperText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #575757;
  line-height: 150%;
`;

export const AdBannerLowerText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #575757;
  line-height: 145%;
`;

// 바디
export const Body = styled.main`
  padding-inline: 27px;
`;

// 매칭 섹션
export const MatchingSection = styled.div`
  margin-top: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px 20px;
  border: 1px solid #f0f0f0;
`;

export const MatchingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SectionTitle = styled.p`
  font-size: 21px;
  font-weight: 600;
  line-height: 150%;
  color: #232323;
  span {
    color: #ff5900;
  }
`;

export const MatchingDescription = styled.p`
  font-size: 10px;
  font-weight: 500;
  line-height: 145%;
  color: #a3a3a3;
  letter-spacing: -0.01em;
`;

export const MatchingButtonArea = styled.div`
  margin-top: 45px;
  display: flex;
  justify-content: flex-end;
`;

export const MatchingButton = styled.button`
  width: 170px;
  height: 50px;
  border-radius: 10px;
  background-color: #ff5900;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  line-height: 145%;
  font-style: bold;
  border: none;
`;

// 가이드 섹션
export const GuideSection = styled.div`
  margin-top: 44px;
  gap: 16px;
`;

export const GuideScroll = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;
