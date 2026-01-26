import styled from 'styled-components';

export const Option = styled.button<{ selected: boolean }>`
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

export const InterestsChip = styled.button<{
  $selected?: boolean;
  width?: string;
}>`
  width: ${({ width }) => width || '75px'};
  height: 37px;
  border: 1px solid ${({ $selected }) => ($selected ? '#ff5900' : '#bdbdbd')};
  color: ${({ $selected }) => ($selected ? '#ff5900' : '#B0AFB2')};
  text-align: center;
  font-size: 12px;
  align-content: center;
  padding-inline: 0;
  border-radius: 30px;
`;
