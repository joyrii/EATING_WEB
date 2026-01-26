import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 35px 23px 45px;
`;

export const StepIndicator = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

export const Segment = styled.div<{ $active?: boolean }>`
  width: 33%;
  height: 5px;
  background-color: ${(props) => (props.$active ? '#D6D6D6' : '#f0f0f0')};
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease;
`;

export const TextWrapper = styled.div`
  margin-top: 37px;
  margin-bottom: 113px;
`;

export const StepText = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #232323;
`;

export const TitleText = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #232323;
`;

export const SubText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  letter-spacing: -0.01em;
  color: #707070;
`;

export const OptionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 45px;
  left: 23px;
  right: 23px;
`;
