import styled from 'styled-components';
import BaseChip from '../BaseChip';

const InterestsOption = styled(BaseChip)<{
  $selected?: boolean;
  onClick?: () => void;
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
`;

export default InterestsOption;
