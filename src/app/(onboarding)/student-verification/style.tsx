import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 120px;
  padding-inline: 24px;
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
