import styled from 'styled-components';

export const TimeGridContainer = styled.div`
  margin-top: 21px;
`;

export const TimeGridWrapper = styled.div`
  display: grid;
  gap: 6px;
  user-select: none;
  touch-action: none;
`;

export const DayHeader = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #707070;
  line-height: 145%;
  text-align: center;
  letter-spacing: -0.01em;
`;

export const TimeLabel = styled.div`
  text-align: right;
  font-size: 10px;
  color: #d6d6d6;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
`;

export const TimeCell = styled.div<{ active: boolean }>`
  height: 30px;
  border: 1px solid #d6d6d6;
  background-color: ${({ active }) => (active ? '#ff5900' : '#ffffff')};
`;
