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
import { applyMatching, getRestaurants } from '@/api/application';
import { useMatchingDraftByWeek } from '@/context/matchingDraft';

export default function PreDining() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDraft = useMatchingDraftByWeek((s) => s.getDraft);
  const activeWeekKey = useMatchingDraftByWeek((s) => s.activeWeekKey);

  const setExcludedRestaurantIds = useMatchingDraftByWeek(
    (s) => s.setExcludedRestaurantIds,
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (e) {
        console.error('Failed to load restaurants', e);
        setRestaurants([]);
      }
    })();
  }, []);

  useEffect(() => {
    const draft = getDraft();
    const ids = draft.excluded_restaurant_ids ?? [];
    setCheckedIds(new Set(ids));
  }, [getDraft, activeWeekKey]);

  const toggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      setExcludedRestaurantIds(Array.from(next));
      return next;
    });
  };

  const submit = async (excludedIds: string[]) => {
    if (!activeWeekKey) {
      alert('주차 정보가 설정되지 않았어요. 이전 단계부터 다시 진행해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      setExcludedRestaurantIds(excludedIds);
      const draft = getDraft();

      const payload = {
        available_slots: draft.available_slots,
        excluded_restaurant_ids: excludedIds,
        preferred_years: draft.preferred_years ?? [],
        excluded_mbti: draft.excluded_mbti ?? [],
      };

      console.log('매칭 신청 payload:', payload);

      await applyMatching(payload);

      router.push('/pre/completed');
    } catch (e: any) {
      const status = e?.response?.status;

      if (status === 400) alert('현재 매칭 신청 기간이 아닙니다.');
      else if (status === 403) alert('사전신청자 전용 기간입니다.');
      else if (status === 409) alert('이미 모든 라운드에 신청하셨습니다.');
      else alert('매칭 신청에 실패했습니다.');

      router.push('/pre/completed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SkipButtonWrapper style={{ justifyContent: 'space-between' }}>
        <StepText>02</StepText>
        <SkipButton
          disabled={isSubmitting}
          onClick={() => submit([])} // ✅ 건너뛰기도 전송
        >
          <span>건너뛰기</span>
        </SkipButton>
      </SkipButtonWrapper>

      <TextWrapper>
        <TitleText>'죽어도 못간다!' 싶은 식당을 선택해주세요!</TitleText>
        <SubText>2개 이상 선택할 시 매칭 확률이 낮아집니다.</SubText>
      </TextWrapper>

      <RestaurantListContainer>
        {restaurants.map((restaurant) => (
          <RestaurantListItem
            key={restaurant.id}
            imageUrl={restaurant.image_url}
            name={restaurant.name}
            category={restaurant.category}
            menu={restaurant.menu_items
              .slice(0, 2)
              .map((m: any) => m.name)
              .join(', ')}
            checked={checkedIds.has(restaurant.id)}
            onCheckedChange={() => toggle(restaurant.id)}
          />
        ))}
      </RestaurantListContainer>

      <ButtonWrapper>
        <Button
          label={isSubmitting ? '제출 중...' : '다음'}
          disabled={isSubmitting || checkedIds.size === 0}
          onClick={() => {
            submit(Array.from(checkedIds));
          }}
        />
      </ButtonWrapper>
    </div>
  );
}
