import Link from "next/link";
import styled from "styled-components";

// 가이드 카드
export const GuideCardContainer = styled.div<{ bg: string }>`
  background-color: #ffffff;
  width: 160px;
  height: 200px;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(164, 164, 164, 0.25);
  background-image: url(${(props) => props.bg});
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
