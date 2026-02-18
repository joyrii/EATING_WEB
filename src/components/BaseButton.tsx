import styled from 'styled-components';

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
    <Button type="button" disabled={disabled} onClick={onClick}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
}

const Button = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 55px;
  background-color: #ff5900;
  border: none;
  border-radius: 10px;
  padding-block: 18px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const ButtonText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;
