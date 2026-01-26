import { Option } from './style';

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
    <Option selected={selected} onClick={onClick}>
      {label}
    </Option>
  );
}
