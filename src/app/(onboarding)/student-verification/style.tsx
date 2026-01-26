import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  padding-inline: 23px;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-bottom: 15px;
`;

export const TextWrapper = styled.div`
  justify-content: center;
  text-align: center;

  h1 {
    font-size: 24px;
    font-weight: 700;
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
  margin-top: 107px;
  justify-content: center;
  align-items: center;
  gap: 33px;
`;

export const ButtonWrapper = styled.div`
  padding: 16px 0 45px;
  background: #fafafa;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 57px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  label {
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0;
  }

  input {
    width: 100%;
    height: 70px;
    border: 1px solid #d6d6d6;
    border-radius: 15px;
    padding: 23px 24px;
    font-size: 16px;
    font-weight: 500;
    line-height: 145%;
    letter-spacing: -0.01em;
  }
`;
