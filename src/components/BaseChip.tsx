import { Chip } from './style';

const BaseChip = ({
  label,
  className,
  ...props
}: {
  label: string;
  className?: string;
}) => {
  return (
    <Chip className={className} {...props}>
      {label}
    </Chip>
  );
};

export default BaseChip;
