'use client';

import {
  StepText,
  TitleText,
  SubText,
} from '@/app/(onboarding)/onboarding/style';
import { useRouter } from 'next/navigation';
import {
  ButtonWrapper,
  RestaurantListContainer,
  SkipButton,
  SkipButtonWrapper,
  TextWrapper,
} from '../style';
import RestaurantListItem from '@/components/application/RestaurantListItem';
import Button from '@/components/BaseButton';
import { useEffect, useState } from 'react';
import { getRestaurants } from '@/api/application';

export default function Dining() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    (async () => {
      const data = await getRestaurants();
      setRestaurants(data);
    })();
  }, []);

  const toggle = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div>
      <SkipButtonWrapper>
        <SkipButton onClick={() => router.push('/application/additional')}>
          <span>건너뛰기</span>
        </SkipButton>
      </SkipButtonWrapper>
      <TextWrapper>
        <StepText>02</StepText>
        <TitleText>'죽어도 못간다!' 싶은 식당을 선택해주세요!</TitleText>
        <SubText>2개 이상 선택할 시 매칭 확률이 낮아집니다.</SubText>
      </TextWrapper>
      <RestaurantListContainer>
        {restaurants.map((restaurant, index) => (
          <RestaurantListItem
            key={restaurant.id}
            imageUrl={restaurant.image_url}
            name={restaurant.name}
            category={restaurant.category}
            menu={restaurant.menu_items.slice(0, 2).join(', ')}
            checked={checkedItems.has(index)}
            onCheckedChange={() => toggle(index)}
          />
        ))}
      </RestaurantListContainer>
      <ButtonWrapper>
        <Button
          label="다음"
          disabled={checkedItems.size === 0}
          onClick={() => router.push('/application/additional')}
        />
      </ButtonWrapper>
    </div>
  );
}
