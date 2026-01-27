'use client';

import {
  CategoryChip,
  RestaurantDetailText,
  RestaurantInfo,
  RestaurantInfoWrapper,
  RestaurantListItemWrapper,
  RestaurantName,
} from './style';
import Check from '../Checkbox';
import { useState } from 'react';

interface RestaurantListItemProps {
  name: string;
  category: string;
  benefit: string;
  menue: string;
  imageUrl?: string;
  checked?: boolean;
  onClick?: () => void;
}

export default function RestaurantListItem({
  name,
  category,
  benefit,
  menue,
  imageUrl,
  checked: initialChecked = false,
  onClick,
}: RestaurantListItemProps) {
  const [checked, setChecked] = useState(initialChecked);

  return (
    <RestaurantListItemWrapper checked={checked}>
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
        <CategoryChip checked={checked}>{category}</CategoryChip>
        <RestaurantName checked={checked}>{name}</RestaurantName>
        <RestaurantInfo>
          <RestaurantDetailText checked={checked}>
            혜택<span>{benefit}</span>
          </RestaurantDetailText>
          <RestaurantDetailText checked={checked}>
            메뉴<span>{menue}</span>
          </RestaurantDetailText>
        </RestaurantInfo>
      </RestaurantInfoWrapper>
      <Check checked={checked} handler={setChecked} onClick={onClick} />
    </RestaurantListItemWrapper>
  );
}
