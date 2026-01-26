import Link from 'next/link';
import styled from 'styled-components';

// 탭바
export const NavBar = styled.nav`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);

  width: 245px;
  height: 68px;
  padding: 10px;

  background-color: #ffeee5;
  border-radius: 100px;

  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const Indicator = styled.div<{ $index: number; $count: number }>`
  position: absolute;
  top: 10px;
  left: 10px;

  height: calc(100% - 20px);
  width: calc((100% - 20px) / ${({ $count }) => $count});

  transform: translateX(calc(${(p) => p.$index} * 100%));
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);

  background-color: #ffffff;
  border-radius: 100px;

  pointer-events: none;
`;

export const NavTab = styled(Link)<{ $active: boolean }>`
  position: relative;
  z-index: 1;

  flex: 1;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;
  color: #ff5900;
`;

export const IconWrap = styled.span`
  width: 24px;
  height: 24px;
  flex: 0 0 24px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const TabLabelWrap = styled.span<{ $active: boolean }>`
  max-width: ${(p) => (p.$active ? '84px' : '0px')};
  overflow: hidden;
  white-space: nowrap;

  transition: max-width 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
`;

export const TabLabel = styled.span<{ $active: boolean }>`
  font-size: 12px;
  font-weight: 700;
  font-style: bold;
  line-height: 145%;
  letter-spacing: -0.01em;

  margin-left: 6px;
  white-space: nowrap;

  opacity: ${(p) => (p.$active ? 1 : 0)};
  transform: translateX(${(p) => (p.$active ? '0' : '-10px')});

  transition:
    opacity 180ms ease,
    transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
`;

// 모달
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div<{ width: string; padding?: string }>`
  background-color: #fcfcfc;
  border-radius: 10px;
  width: ${(p) => p.width};
  padding: ${(p) => p.padding};
`;

// 칩
export const Chip = styled.div`
  display: inline-block;
  padding: 6px 10px;
  background-color: #ffffff;
  border-radius: 30px;
  border: 1px solid #bdbdbd;
  font-size: 10px;
  font-weight: 500;
  color: #707070;
`;

// 버튼
export const Button = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 55px;
  background-color: #ff5900;
  border: none;
  border-radius: 10px;
  padding-block: 18px;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

export const ButtonText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;
