import styled from 'styled-components';

export const CheckboxWrapper = styled.label<{ $checked: boolean }>`
  height: 60px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 17px 0;
  padding-left: 20px;
  border: 1px solid ${({ $checked }) => ($checked ? '#ff7a33' : '#f0f0f0')};
  background-color: ${({ $checked }) => ($checked ? '#ffdecc' : '#ffffff')};
  border-radius: 10px;
  margin-bottom: 15px;
`;

export const Label = styled.label<{ $clickable?: boolean }>`
  color: #8a8a8a;
  font-size: 16px;
  text-decoration: underline;

  cursor: ${({ $clickable = true }) => ($clickable ? 'pointer' : 'default')};
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: #bdbdbd;
  cursor: pointer;

  background-image: url('/svgs/check.svg');
  background-repeat: no-repeat;
  background-position: center;

  &:checked {
    background-color: #ff5900;
  }

  &:checked + a ${Label}, &:checked + ${Label} {
    color: #3d3d3d;
  }
`;
