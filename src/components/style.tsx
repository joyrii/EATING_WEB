import Link from "next/link";
import styled from "styled-components";

// 탭바
export const NavBar = styled.nav`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 245px;
  height: 68px;
  background-color: #ffeee5;
  border-radius: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
`;

export const NavTab = styled(Link)<{ $active?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => (props.$active ? "#ff5900" : "transparent")};
  background-color: ${(props) => (props.$active ? "#ffffff" : "transparent")};
  padding: 12px 20px;
  border-radius: 32px;

  transition: background-color 0.2s;
`;

export const TabLabel = styled.span<{ $active?: boolean }>``;
