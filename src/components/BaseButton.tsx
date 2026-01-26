import { Button, ButtonText } from './style';

export default function BaseButton({
  disabled,
  label,
}: {
  disabled?: boolean;
  label: string;
}) {
  return (
    <Button disabled={disabled}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
}
