import { CheckboxWrapper, Checkbox, Label } from "./style";

interface TermsItemProps {
  id: string;
  label: string;
  checked: boolean;
  handler: (checked: boolean) => void;
}

const TermsItem = ({ id, label, checked, handler }: TermsItemProps) => {
  return (
    <CheckboxWrapper $checked={checked}>
      <Checkbox
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={(e) => handler(e.target.checked)}
      />
      <Label htmlFor={id}>{label}</Label>
    </CheckboxWrapper>
  );
};

export default TermsItem;
