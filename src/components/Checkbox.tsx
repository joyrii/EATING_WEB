import { Checkbox } from './style';

export default function Check({
  checked,
  handler,
  onClick,
}: {
  checked: boolean;
  handler: (checked: boolean) => void;
  onClick?: () => void;
}) {
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => handler(e.target.checked)}
      onClick={onClick}
    />
  );
}
