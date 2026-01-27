import { CategoryChip } from './style';

export default function RestaurantCategoryChip({
  label,
  checked,
}: {
  label: string;
  checked?: boolean;
}) {
  return <CategoryChip checked={checked}>{label}</CategoryChip>;
}
