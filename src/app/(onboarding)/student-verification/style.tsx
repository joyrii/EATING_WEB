import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  padding-inline: 23px;
`;

export const TextWrapper = styled.div`
  justify-content: center;
  text-align: center;

  h1 {
    font-size: 24px;
    font-weight: 700;
  }

  p {
    margin-top: 2px;
    font-size: 14px;
    font-weight: 400;
    line-height: 145%;
    letter-spacing: -0.01em;
  }
`;
