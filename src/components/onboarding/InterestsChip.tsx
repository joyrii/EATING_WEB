import styled from 'styled-components';

export default function InterestsOption({
  label,
  $selected,
  onClick,
  width,
}: {
  label: string;
  $selected?: boolean;
  onClick?: () => void;
  width?: string;
}) {
  return (
    <InterestsChip $selected={$selected} onClick={onClick} width={width}>
      {label}
    </InterestsChip>
  );
}

const InterestsChip = styled.button<{
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
