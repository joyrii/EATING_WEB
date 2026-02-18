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
} from '@/app/(withoutTabBar)/application/style';
import RestaurantListItem from '@/components/application/RestaurantListItem';
import Button from '@/components/BaseButton';
import { useEffect, useState } from 'react';
import { getRestaurants } from '@/api/application';
import { useMatchingDraftByWeek } from '@/context/matchingDraft';

export default function PreDining() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const setExcludedRestaurantsIds = useMatchingDraftByWeek(
    (state) => state.setExcludedRestaurantIds,
  );

  useEffect(() => {
    (async () => {
      const data = await getRestaurants();
      setRestaurants(data);
    })();
  }, []);

  const toggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <SkipButtonWrapper style={{ justifyContent: 'space-between' }}>
        <StepText>02</StepText>
        <SkipButton onClick={() => router.push('/pre/completed')}>
          <span>건너뛰기</span>
        </SkipButton>
      </SkipButtonWrapper>
      <TextWrapper>
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
            checked={checkedIds.has(restaurant.id)}
            onCheckedChange={() => toggle(restaurant.id)}
          />
        ))}
      </RestaurantListContainer>
      <ButtonWrapper>
        <Button
          label="다음"
          disabled={checkedIds.size === 0}
          onClick={() => {
            setExcludedRestaurantsIds(Array.from(checkedIds));
            console.log('선택된 식당 ID 목록:', Array.from(checkedIds));
            router.push('/pre/completed');
          }}
        />
      </ButtonWrapper>
    </div>
  );
}
