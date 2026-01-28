import styled from 'styled-components';

export default function ClassChip({
  label,
  onClick,
  checked,
}: {
  label: string;
  onClick: () => void;
  checked: boolean;
}) {
  return (
    <ClassChipStyle $checked={checked} onClick={onClick}>
      {label}
    </ClassChipStyle>
  );
}

const ClassChipStyle = styled.button<{ $checked: boolean }>`
  width: 65px;
  height: 65px;
  border: 1px solid ${({ $checked }) => ($checked ? '#ff5900' : '#d6d6d6')};
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 5px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ $checked }) => ($checked ? '#ff5900' : '#8a8a8a')};
  background-color: ${({ $checked }) => ($checked ? '#FFDECC' : 'transparent')};
  cursor: pointer;
`;
