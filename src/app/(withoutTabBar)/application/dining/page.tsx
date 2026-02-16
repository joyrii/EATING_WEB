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
import { useState } from 'react';

export default function Dining() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

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
        <RestaurantListItem
          name="다방방"
          category="한식"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.has(0)}
          onCheckedChange={() => toggle(0)}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.has(1)}
          onCheckedChange={() => toggle(1)}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.has(2)}
          onCheckedChange={() => toggle(2)}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.has(3)}
          onCheckedChange={() => toggle(3)}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.has(4)}
          onCheckedChange={() => toggle(4)}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.has(5)}
          onCheckedChange={() => toggle(5)}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.has(6)}
          onCheckedChange={() => toggle(6)}
        />
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
