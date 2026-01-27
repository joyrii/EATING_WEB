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

export const ModalButtonWrapper = styled.div`
  width: 128px;
  display: flex;
  justify-content: center;
`;

export const SkipButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const RestaurantListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 100px;
`;

export const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: #fafafa;
  padding: 45px 23px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 45px;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
  color: #232323;
`;

export const ClassWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  text-align: center;
`;

export const Textarea = styled.input`
  width: 100%;
  height: 68px;
  border: 1px solid #d6d6d6;
  border-radius: 15px;
  padding: 23px 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
  color: #000000;

  &::placeholder {
    color: #bdbdbd;
  }
`;
