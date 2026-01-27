import { ClassChipStyle } from './style';

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
    <ClassChipStyle checked={checked} onClick={onClick}>
      {label}
    </ClassChipStyle>
  );
}
