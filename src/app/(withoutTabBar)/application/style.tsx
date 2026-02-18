import styled from 'styled-components';

export const TextWrapper = styled.div`
  margin-top: 5px;
`;

export const SkipButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
`;

export const SkipButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #3d3d3d;
`;

export const DateBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border: 1px solid #a3a3a3;
  border-radius: 15px;
  padding-block: 14px;
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

export const RestaurantListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 30px auto 100px auto;
`;

export const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: #fafafa;
  padding: 10px 23px 45px 23px;
`;
