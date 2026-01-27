import { Checkbox } from './style';

export default function Check({
  checked,
  handler,
  onClick,
  ariaLabel,
}: {
  checked: boolean;
  handler: (checked: boolean) => void;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => handler(e.target.checked)}
      onClick={onClick}
      aria-label={ariaLabel}
    />
  );
}
