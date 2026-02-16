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
    <InterestsChip $selected={$selected} onClick={onClick}>
      {label}
    </InterestsChip>
  );
}

const InterestsChip = styled.button<{
  $selected?: boolean;
}>`
  cursor: pointer;
  width: fit-content;
  height: 37px;
  border: 1px solid ${({ $selected }) => ($selected ? '#ff5900' : '#bdbdbd')};
  color: ${({ $selected }) => ($selected ? '#ff5900' : '#707070')};
  text-align: center;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: #ffffff;
  padding: 10px;
`;
