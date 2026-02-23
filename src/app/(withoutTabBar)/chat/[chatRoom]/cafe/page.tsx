'use client';

import styled from 'styled-components';
import type { RestaurantPayload } from '@/components/chat/ChatMessage';
import RestaurantCard from '@/components/chat/RestaurantCard';
import { useEffect, useState } from 'react';
import RestaurantModal from '@/components/chat/RestaurantModal';
import { getRestaurantById, getRestaurants } from '@/api/application';
import { useSearchParams } from 'next/navigation';

type ApiRestaurant = {
  id: string;
  name: string;
  category: string;
  menu_items?: string[];
  image_url?: string;
};

function pickMenuText(menuItems: any): string {
  if (!menuItems) return '';
  const first = Array.isArray(menuItems) ? menuItems[0] : menuItems;

  return String(first.name ?? '');
}

async function toRestaurantPayload(
  r: ApiRestaurant,
): Promise<RestaurantPayload> {
  const restaurant = await getRestaurantById(r.id);
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    benefit: restaurant.promotion ?? '',
    menu: pickMenuText((r as any).menu_items),
    imageUrl: r.image_url?.trim() ? r.image_url : 'images/chat/placeholder.png',
  };
}

function formatTimeKST(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function addHours(d: Date, hours: number) {
  return new Date(d.getTime() + hours * 60 * 60 * 1000);
}

export default function CafeList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cafes, setCafes] = useState<RestaurantPayload[]>([]);

  const searchParams = useSearchParams();
  const appointmentAt = searchParams.get('appointmentAt'); // ISO string
  const appointmentDate = appointmentAt ? new Date(appointmentAt) : null;

  const discountStart = appointmentDate
    ? formatTimeKST(appointmentDate)
    : '--:--';
  const discountEnd = appointmentDate
    ? formatTimeKST(addHours(appointmentDate, 2))
    : '--:--';

  const [selectedCafe, setSelectedCafe] = useState<RestaurantPayload | null>(
    null,
  );
  const [isCafeModalVisible, setIsCafeModalVisible] = useState(false);

  // 카페 목록 가져오기
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const list = (await getRestaurants()) as ApiRestaurant[];

        const cafeOnly = (list ?? []).filter(
          (r) => String(r.category).toLowerCase() === '카페',
        );

        const payloads = await Promise.all(
          cafeOnly.map((r) => toRestaurantPayload(r)),
        );

        if (!cancelled) setCafes(payloads);
      } catch (error) {
        console.error('카페 목록을 가져오는 중 오류 발생:', error);
        setError('카페 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Header>
        <CafeListTitle>2차 카페 리스트</CafeListTitle>
        <img src="/svgs/chat/cafe.svg" alt="cafe" />
        <TimeBox>
          <TimeBoxItem>
            <TimeBoxLabel>할인 시작</TimeBoxLabel>
            <TimeBoxTime>{discountStart}</TimeBoxTime>
          </TimeBoxItem>
          <TimeBoxItem>
            <TimeBoxLabel>할인 마감</TimeBoxLabel>
            <TimeBoxTime>{discountEnd}</TimeBoxTime>
          </TimeBoxItem>
        </TimeBox>
      </Header>
      <CafeListContainer>
        {loading && <div>불러오는 중...</div>}
        {error && <div>{error}</div>}

        {!loading &&
          !error &&
          cafes.map((cafe) => (
            <RestaurantCard
              key={cafe.id}
              payload={cafe}
              width="75%"
              onClick={() => {
                setSelectedCafe(cafe);
                // setIsCafeModalVisible(true);
              }}
            />
          ))}
      </CafeListContainer>
      <RestaurantModal
        isOpen={isCafeModalVisible}
        onClose={() => setIsCafeModalVisible(false)}
        restaurant={selectedCafe}
      />
    </div>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  margin-bottom: 70px;
`;

const CafeListTitle = styled.h2`
  flex: 1;
  font-size: 21px;
  font-weight: 600;
  text-align: center;
`;

const TimeBox = styled.div`
  position: absolute;
  top: 200px;
  display: flex;
  padding: 10px;
  gap: 40px;
  background-color: #fbfbfb;
  border-radius: 14px;
  border: 1px solid #f0f0f0;
  width: 310px;
  justify-content: center;
`;

const TimeBoxItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimeBoxLabel = styled.span`
  font-size: 12px;
  color: #707070;
`;

const TimeBoxTime = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #232323;
`;

const CafeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;
