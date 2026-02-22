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
import { useEffect, useMemo, useState } from 'react';
import { getRestaurants, getMatchingStatus } from '@/api/application';
import { useMatchingDraftByWeek } from '@/context/matchingDraft';

export default function Dining() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // zustand
  const setActiveWeekKey = useMatchingDraftByWeek((s) => s.setActiveWeekKey);
  const getDraft = useMatchingDraftByWeek((s) => s.getDraft);
  const setExcludedRestaurantIds = useMatchingDraftByWeek(
    (s) => s.setExcludedRestaurantIds,
  );

  // 1) 레스토랑 목록 로드
  useEffect(() => {
    (async () => {
      const data = await getRestaurants();
      setRestaurants(data);
    })();
  }, []);

  // 2) activeWeekKey 보강 + 저장값 복원
  useEffect(() => {
    (async () => {
      try {
        // activeWeekKey가 이미 있으면 그걸로 복원
        // (주의: persist로 살아있을 수도 있어서 우선 store값을 사용)
        // activeWeekKey를 직접 읽기 위해 getState 사용
        const state = useMatchingDraftByWeek.getState();
        let wk = state.activeWeekKey;

        // wk가 없으면(직접 진입/새로고침) 서버에서 1주차 가져와서 세팅
        if (!wk) {
          const res = await getMatchingStatus();
          const first = res.rounds?.[0];
          if (first?.week_start) {
            wk = first.week_start;
            setActiveWeekKey(wk);
          }
        }

        if (!wk) return;

        const draft = getDraft(wk);
        const saved = draft.excluded_restaurant_ids ?? [];
        setCheckedIds(new Set(saved));
      } catch (e) {
        console.error('Dining 복원 실패:', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) 체크 변경 함수 + 즉시 store 저장
  const toggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      // ✅ 즉시 store에 저장 (뒤로가기/새로고침 복원)
      setExcludedRestaurantIds(Array.from(next));
      return next;
    });
  };

  // 4) 이동 직전에도 한번 더 저장(보험)
  const commit = () => {
    setExcludedRestaurantIds(Array.from(checkedIds));
  };

  const disabledNext = checkedIds.size === 0;

  return (
    <div>
      <SkipButtonWrapper>
        <SkipButton
          onClick={() => {
            commit();
            router.push('/application/additional');
          }}
        >
          <span>건너뛰기</span>
        </SkipButton>
      </SkipButtonWrapper>

      <TextWrapper>
        <StepText>02</StepText>
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
            menu={restaurant.menu_items.slice(0, 2).join(', ')}
            checked={checkedIds.has(restaurant.id)}
            onCheckedChange={() => toggle(restaurant.id)}
          />
        ))}
      </RestaurantListContainer>

      <ButtonWrapper>
        <Button
          label="다음"
          disabled={disabledNext}
          onClick={() => {
            commit();
            console.log('선택된 식당 ID 목록:', Array.from(checkedIds));
            router.push('/application/additional');
          }}
        />
      </ButtonWrapper>
    </div>
  );
}
