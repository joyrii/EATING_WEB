import styled from "styled-components";

export const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  padding-inline: 25px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  white-space: pre-line;
`;

export const Content = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #575757;
  line-height: 1.8;
  letter-spacing: -0.01em;
`;

export const AgreeButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 55px;
  background-color: #ff5900;
  border-radius: 10px;
  padding-block: 18px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const AgreeButtonText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;
