import styled from 'styled-components';

interface RestaurantListItemProps {
  name: string;
  category: string;
  menu: string;
  imageUrl?: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function RestaurantListItem({
  name,
  category,
  menu,
  imageUrl,
  checked,
  onCheckedChange,
}: RestaurantListItemProps) {
  return (
    <RestaurantListItemWrapper
      $checked={checked}
      onClick={() => {
        onCheckedChange?.(!checked);
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {imageUrl ? (
          <RestaurantImage src={imageUrl} alt={name} />
        ) : (
          // Placeholder for missing image
          <div
            style={{
              width: '150px',
              height: '100px',
              backgroundColor: '#e0e0e0',
              borderRadius: '8px',
            }}
          />
        )}
        <RestaurantInfoWrapper>
          <RestaurantName $checked={checked}>{name}</RestaurantName>
          <RestaurantInfo>
            <RestaurantDetailText $checked={checked}>
              종류<span>{category}</span>
            </RestaurantDetailText>
            <RestaurantDetailText $checked={checked}>
              메뉴<span>{menu}</span>
            </RestaurantDetailText>
          </RestaurantInfo>
        </RestaurantInfoWrapper>
      </div>
    </RestaurantListItemWrapper>
  );
}

const RestaurantListItemWrapper = styled.button<{ $checked?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border: 1px solid ${({ $checked }) => ($checked ? '#ff5900' : '#f0f0f0')};
  border-radius: 10px;
  margin-bottom: 16px;
  width: 170px;
  background-color: #ffffff;
`;

const RestaurantImage = styled.img`
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const RestaurantInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 5px;
  align-items: flex-start;
`;

const RestaurantName = styled.h2<{ $checked?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $checked }) => ($checked ? '#FF5900' : '#3d3d3d')};
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RestaurantDetailText = styled.p<{ $checked?: boolean }>`
  font-size: 10px;
  font-weight: 500;
  text-align: left;
  color: ${({ $checked }) => ($checked ? '#FFBAA5' : '#d6d6d6')};

  span {
    color: ${({ $checked }) => ($checked ? '#ff5900' : '#8a8a8a')};
    margin-left: 6px;
  }
`;
