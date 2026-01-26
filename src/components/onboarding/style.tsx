import styled from 'styled-components';

export const Option = styled.div<{ selected: boolean }>`
  width: 70px;
  height: 70px;
  border: none;
  border-radius: 10px;
  text-align: center;
  align-content: center;
  background-color: ${({ selected }) => (selected ? '#ff5900' : '#f0f0f0')};
  color: #ffeee5;
  font-size: 36px;
  font-weight: 600;
`;
