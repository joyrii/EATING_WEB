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
