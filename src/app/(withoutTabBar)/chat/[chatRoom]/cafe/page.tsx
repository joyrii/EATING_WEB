'use client';

import styled from 'styled-components';
import type { RestaurantPayload } from '@/components/chat/ChatMessage';
import RestaurantCard from '@/components/chat/RestaurantCard';
import { useState } from 'react';
import RestaurantModal from '@/components/chat/RestaurantModal';

const RESTAURANTS: RestaurantPayload[] = [
  {
    id: 1,
    name: '진미당',
    category: '한식',
    benefit: '10% 할인',
    menu: '치즈불짜파게티',
    imageUrl: '/images/chat/placeholder.png',
  },
  {
    id: 2,
    name: '주디식당',
    category: '양식',
    benefit: '음료 1잔 무료',
    menu: '크림파스타',
    imageUrl: '/images/chat/placeholder.png',
  },
  {
    id: 3,
    name: '다방방',
    category: '카페',
    benefit: '아메리카노 1,000원 할인',
    menu: '아메리카노',
    imageUrl: '/images/chat/placeholder.png',
  },
  {
    id: 4,
    name: '다방방',
    category: '카페',
    benefit: '아메리카노 1,000원 할인',
    menu: '아메리카노',
    imageUrl: '/images/chat/placeholder.png',
  },
];

export default function CafeList() {
  const [isCafeModalVisible, setIsCafeModalVisible] = useState(false);

  return (
    <div>
      <Header>
        <CafeListTitle>2차 카페 리스트</CafeListTitle>
        <img src="/svgs/chat/cafe.svg" alt="cafe" />
        <TimeBox>
          <TimeBoxItem>
            <TimeBoxLabel>할인 시작</TimeBoxLabel>
            <TimeBoxTime>4:00 PM</TimeBoxTime>
          </TimeBoxItem>
          <TimeBoxItem>
            <TimeBoxLabel>할인 마감</TimeBoxLabel>
            <TimeBoxTime>6:00 PM</TimeBoxTime>
          </TimeBoxItem>
        </TimeBox>
      </Header>
      <CafeListContainer>
        {RESTAURANTS.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            payload={restaurant}
            width="75%"
            onClick={() => setIsCafeModalVisible(true)}
          />
        ))}
      </CafeListContainer>
      <RestaurantModal
        isOpen={isCafeModalVisible}
        onClose={() => setIsCafeModalVisible(false)}
        restaurant={null} // 정보 추가 필요
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
