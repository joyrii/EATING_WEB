import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 35px 23px 45px;
`;

export const IndicatorWrapper = styled.div`
  height: 40px;
  position: fixed;
  top: 0;
  left: 24px;
  right: 24px;
  z-index: 10;
  padding-top: 35px;
  padding-bottom: 10px;
  background-color: #fafafa;
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

export const MbtiOptionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const MbtiOptionWrapper = styled.div`
  margin-top: 113px;
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const InterestsMainTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
`;

export const InterestsSubTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 145%;
  letter-spacing: -0.01em;
`;

export const InterestsContent = styled.div`
  margin-top: 46px;
`;

export const InterestsWrapperLarge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 45px;
`;

export const InterestsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 45px;
`;

export const InterestsOptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 45px;
  left: 23px;
  right: 23px;
`;
