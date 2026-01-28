'use client';

import {
  TextWrapper,
  StepText,
  TitleText,
  SubText,
} from '@/app/(onboarding)/onboarding/style';
import { useRouter } from 'next/navigation';
import { ButtonWrapper, RestaurantListContainer } from '../style';
import RestaurantListItem from '@/components/application/RestaurantListItem';
import Button from '@/components/BaseButton';
import { useState } from 'react';

export default function Dining() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  return (
    <div>
      <TextWrapper>
        <StepText>02</StepText>
        <TitleText>'죽어도 못간다!' 싶은 식당을 선택해주세요!</TitleText>
        <SubText>2개 이상 선택할 시 매칭 확률이 낮아집니다.</SubText>
      </TextWrapper>
      <RestaurantListContainer>
        <RestaurantListItem
          name="다방방"
          category="한식"
          benefit="10% 할인"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.includes('다방방')}
          onCheckedChange={() => {
            if (checkedItems.includes('다방방')) {
              setCheckedItems(checkedItems.filter((item) => item !== '다방방'));
            } else {
              setCheckedItems([...checkedItems, '다방방']);
            }
          }}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          benefit="10% 할인"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.includes('다방방')}
          onCheckedChange={() => {
            if (checkedItems.includes('다방방')) {
              setCheckedItems(checkedItems.filter((item) => item !== '다방방'));
            } else {
              setCheckedItems([...checkedItems, '다방방']);
            }
          }}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          benefit="10% 할인"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.includes('다방방')}
          onCheckedChange={() => {
            if (checkedItems.includes('다방방')) {
              setCheckedItems(checkedItems.filter((item) => item !== '다방방'));
            } else {
              setCheckedItems([...checkedItems, '다방방']);
            }
          }}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          benefit="10% 할인"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.includes('다방방')}
          onCheckedChange={() => {
            if (checkedItems.includes('다방방')) {
              setCheckedItems(checkedItems.filter((item) => item !== '다방방'));
            } else {
              setCheckedItems([...checkedItems, '다방방']);
            }
          }}
        />
        <RestaurantListItem
          name="다방방"
          category="한식"
          benefit="10% 할인"
          menu="쌍화커피, 쌍화라떼"
          checked={checkedItems.includes('다방방')}
          onCheckedChange={() => {
            if (checkedItems.includes('다방방')) {
              setCheckedItems(checkedItems.filter((item) => item !== '다방방'));
            } else {
              setCheckedItems([...checkedItems, '다방방']);
            }
          }}
        />
      </RestaurantListContainer>
      <ButtonWrapper>
        <Button
          label="다음"
          disabled={checkedItems.length === 0}
          onClick={() => router.push('/application/additional')}
        />
      </ButtonWrapper>
    </div>
  );
}
