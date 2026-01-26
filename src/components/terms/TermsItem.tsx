'use client';

import { CheckboxWrapper, Checkbox, Label } from './style';
import Link from 'next/link';

interface TermsItemProps {
  id: string;
  label: string;
  checked: boolean;
  handler: (checked: boolean) => void;
  detailHref?: string;
}

const TermsItem = ({
  id,
  label,
  checked,
  handler,
  detailHref,
}: TermsItemProps) => {
  return (
    <CheckboxWrapper $checked={checked}>
      <Checkbox
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={(e) => handler(e.target.checked)}
      />
      {detailHref ? (
        <Link href={detailHref}>
          <Label as="span" $clickable={true}>
            {label}
          </Label>
        </Link>
      ) : (
        <Label htmlFor={id} $clickable={false}>
          {label}
        </Label>
      )}
    </CheckboxWrapper>
  );
};

export default TermsItem;
