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
} from "./style";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
        {children}
      </Body>
    </div>
  );
}
