import styled from 'styled-components';

export default function MbtiOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Option aria-pressed={selected} selected={selected} onClick={onClick}>
      {label}
    </Option>
  );
}

const Option = styled.button<{ selected: boolean }>`
  width: 70px;
  height: 70px;
  border: 1px solid ${({ selected }) => (selected ? '#ff5900' : '#f0f0f0')};
  border-radius: 10px;
  text-align: center;
  align-content: center;
  background-color: ${({ selected }) => (selected ? '#FFEEE5' : '#f0f0f0')};
  color: ${({ selected }) => (selected ? '#ff5900' : '#ffeee5')};
  font-size: 36px;
  font-weight: 600;
`;
