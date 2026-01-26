import { Button, ButtonText } from './style';

export default function BaseButton({
  disabled,
  label,
  onClick,
}: {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button disabled={disabled} onClick={onClick}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
}
