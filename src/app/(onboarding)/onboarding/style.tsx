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

export const Segment = styled.div<{ active?: boolean }>`
  width: 33%;
  height: 5px;
  background-color: ${(props) => (props.active ? '#D6D6D6' : '#f0f0f0')};
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease;
`;
