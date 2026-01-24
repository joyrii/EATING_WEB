import Link from "next/link";
import styled from "styled-components";

// 가이드 카드
export const GuideCardContainer = styled.div<{ $bg: string }>`
  background-color: #ffffff;
  width: 160px;
  height: 200px;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(164, 164, 164, 0.25);
  background-image: url(${(props) => props.$bg});
  background-size: 110%;
  background-repeat: no-repeat;
  background-position: center bottom -10px;
  padding: 20px;
  flex: 0 0 auto;
`;

export const GuideCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  line-height: 145%;
  color: #3d3d3d;
  white-space: pre-line;
`;

// 섹션 타이틀
export const SectionTitle = styled.h2`
  font-size: 21px;
  font-weight: 600;
  line-height: 150%;
  color: #232323;
  span {
    color: #ff5900;
  }
`;

// 섹션
export const Section = styled.div`
  margin-top: 44px;
  gap: 16px;
`;

// 가이드 섹션
export const GuideScroll = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

// 매칭 리스트 섹션
export const MatchingList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::after {
    content: "";
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    height: 150px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(250, 250, 250, 1)
    );
  }
`;

export const MatchingListItemContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding-top: 25px;
  padding-bottom: 20px;
  padding-inline: 20px;
`;

export const ParticipantsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Participants = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 145%;
  color: #3d3d3d;
`;

export const DateTimeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
`;

export const DateTime = styled.h3`
  font-size: 21px;
  font-weight: 600;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
`;

export const Button = styled.button<{ $variant: "detail" | "chat" }>`
  width: 155px;
  height: 45px;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;

  ${(props) =>
    props.$variant === "detail"
      ? `background-color: #f0f0f0;
      color: #707070;
      `
      : `background-color: #FFEEE5;
      color: #FF5900;
      `}
`;
