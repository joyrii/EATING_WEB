import localFont from "next/font/local";
import styled from "styled-components";

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
  src: "/svgs/eating-logo-character.svg",
  width: 40,
  height: 44,
})`
  margin-left: 4px;
`;
