import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 70px;
  padding-bottom: 45px;
  padding-inline: 23px;
`;

export const TextWrapper = styled.div`
  justify-content: center;
  text-align: center;
  margin-bottom: 107px;

  h1 {
    font-size: 24px;
    font-weight: 700;
    font-style: bold;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 145%;
    letter-spacing: -0.01em;
  }
`;

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 33px;
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 45px;
  left: 23px;
  right: 23px;
`;
