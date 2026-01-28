import { CategoryChip } from './style';
import styled from 'styled-components';
import Check from '../Checkbox';

interface RestaurantListItemProps {
  name: string;
  category: string;
  benefit: string;
  menu: string;
  imageUrl?: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function RestaurantListItem({
  name,
  category,
  benefit,
  menu,
  imageUrl,
  checked,
  onCheckedChange,
}: RestaurantListItemProps) {
  const checkboxLabel = `레스토랑 선택: ${name}`;
  return (
    <RestaurantListItemWrapper $checked={checked}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{ width: '87px', height: '87px' }}
          />
        ) : (
          // Placeholder for missing image
          <div
            style={{
              width: '87px',
              height: '87px',
              backgroundColor: '#e0e0e0',
              borderRadius: '8px',
            }}
          />
        )}
        <RestaurantInfoWrapper>
          <CategoryChip $checked={checked}>{category}</CategoryChip>
          <RestaurantName $checked={checked}>{name}</RestaurantName>
          <RestaurantInfo>
            <RestaurantDetailText $checked={checked}>
              혜택<span>{benefit}</span>
            </RestaurantDetailText>
            <RestaurantDetailText $checked={checked}>
              메뉴<span>{menu}</span>
            </RestaurantDetailText>
          </RestaurantInfo>
        </RestaurantInfoWrapper>
      </div>
      <Check
        checked={checked}
        handler={(next) => onCheckedChange?.(next)}
        ariaLabel={checkboxLabel}
      />
    </RestaurantListItemWrapper>
  );
}

const RestaurantListItemWrapper = styled.div<{ $checked?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border: 1px solid ${({ $checked }) => ($checked ? '#ff5900' : '#f0f0f0')};
  border-radius: 10px;
  margin-bottom: 16px;
  width: 90%;
  background-color: #ffffff;
`;

const RestaurantImage = styled.img`
  width: 87px;
  height: 87px;
  object-fit: cover;
  border-radius: 8px;
`;

const RestaurantInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13px;
  gap: 5px;
`;

const RestaurantName = styled.h2<{ $checked?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $checked }) => ($checked ? '#FF5900' : '#3d3d3d')};
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RestaurantDetailText = styled.p<{ $checked?: boolean }>`
  font-size: 10px;
  font-weight: 500;
  color: ${({ $checked }) => ($checked ? '#FFBAA5' : '#d6d6d6')};

  span {
    color: ${({ $checked }) => ($checked ? '#ff5900' : '#8a8a8a')};
    margin-left: 6px;
  }
`;
