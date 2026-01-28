import styled from 'styled-components';

export const CategoryChip = styled.div<{ $checked?: boolean }>`
  width: fit-content;
  padding: 4px 8px;
  background-color: ${({ $checked }) => ($checked ? '#FFEEE5' : '#FCFCFC')};
  border-radius: 30px;
  font-size: 8px;
  font-weight: 500;
  color: ${({ $checked }) => ($checked ? '#FF5900' : '#B0AFB2')};
`;
