import styled from 'styled-components';

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: auto 1fr 40px;
  align-items: center;
  padding-left: 10px;
  padding-block: 15px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
`;

export const BackButton = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
`;

export const HeaderText = styled.h1`
  justify-self: center;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
`;

export const ServiceRate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 55px;
`;

export const ServiceRateLabel = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 15px;
  background: #ff5900;
  color: #fff;
  padding: 10px 30px;
  border-radius: 10px;
`;

export const Stars = styled.div`
  display: flex;
  gap: 4px;
`;

export const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  padding: 0 10px;
  padding-bottom: 40px;
  border-bottom: 1px solid #f0f0f0;
`;

export const SectionTitle = styled.h2`
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  color: #232323;
  margin-bottom: 3px;
  text-align: left;
`;

export const SectionDescription = styled.p`
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: #a3a3a3;
  text-align: left;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 16px;
  width: 100%;
`;

export const Button = styled.button<{ selected?: boolean }>`
  width: calc(50% - 9px);
  padding-block: 15px;
  background: none;
  border: 1px solid ${({ selected }) => (selected ? '#ff5900' : '#a3a3a3')};
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ selected }) => (selected ? '#ff5900' : '#a3a3a3')};
  cursor: pointer;
`;

export const Input = styled.textarea`
  width: 100%;
  height: 100px;
  margin-top: 16px;
  padding: 12px 16px;
  border: 1px solid #f5f5f5;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #000000;

  &::placeholder {
    color: #bdbdbd;
  }
`;

export const SubmitButton = styled.button`
  width: calc(100% - 20px);
  margin: 30px 10px;
  padding-block: 15px;
  background: #ff5900;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
`;

export const UserList = styled.div`
  margin-top: 16px;
  margin-inline: 9px;
  display: flex;
  gap: 17px;
  width: calc(100% - 18px);
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;
