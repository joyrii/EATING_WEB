import Link from 'next/link';
import styled from 'styled-components';

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
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 매칭 리스트 섹션
export const MatchingList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::after {
    content: '';
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    height: 150px;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(250, 250, 250, 1)
    );
  }
`;

// 버튼
export const Button = styled.button<{
  $variant: 'detail' | 'chat' | 'review' | 'enter';
}>`
  flex: 1;
  min-width: 0;
  cursor: pointer;
  height: 45px;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;

  ${({ $variant }) => {
    switch ($variant) {
      case 'detail':
        return `background-color: #f0f0f0;
      color: #707070;
      `;
      case 'chat':
        return `background-color: #FFEEE5;
      color: #FF5900;
      `;
      case 'review':
        return `background-color: #F4F9ED;
      color: #7FB548;
      `;
      case 'enter':
        return `flex: none;
      width: 100%;
      height: 40px;
      background-color: #ff5900;
      color: #ffffff;
      font-size: 16px;
        `;
      default:
        return ``;
    }
  }}
`;
