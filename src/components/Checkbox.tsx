import styled from 'styled-components';

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

// 체크박스
const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: #fcfcfc;
  cursor: pointer;

  background-image: url('/svgs/check-gray.svg');
  background-repeat: no-repeat;
  background-position: center;

  &:checked {
    background-image: url('/svgs/check.svg');
    background-color: #ff5900;
  }
`;
