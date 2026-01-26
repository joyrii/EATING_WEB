import { InterestsChip } from './style';

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
