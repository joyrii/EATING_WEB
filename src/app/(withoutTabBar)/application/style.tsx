import styled from 'styled-components';

export const DateBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border: 1px solid #a3a3a3;
  border-radius: 15px;
  padding-block: 23px;
  font-size: 16px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
  color: #707070;
  margin-top: 20px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CautionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 45px;

  p {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }
`;

export const ButtonWrapper = styled.div`
  width: 128px;
  display: flex;
  justify-content: center;
`;
