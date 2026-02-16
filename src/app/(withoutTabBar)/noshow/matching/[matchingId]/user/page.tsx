'use client';

import UserItem from '@/components/feedback/UserItem';
import {
  Description,
  Title,
  TitleContainer,
  UserGrid,
  SubmitButton,
} from '../../../style';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function NoshowUser() {
  const router = useRouter();
  const matchingId = useParams().matchingId; // URL에서 matchingId 추출
  const [selectedUserId, setSelectedUserId] = useState<number[]>([]);

  const users = [
    { id: 1, name: '홍길동', image: '/images/chat/profile-image-1.jpeg' },
    { id: 2, name: '김철수', image: '/images/chat/profile-image-2.jpeg' },
    { id: 3, name: '이영희', image: '/images/chat/profile-image-3.jpeg' },
    { id: 4, name: '박민수', image: '/images/chat/profile-image-4.jpeg' },
    { id: 5, name: '최수진', image: '/images/chat/profile-image-1.jpeg' },
  ];

  return (
    <>
      <TitleContainer>
        <Title>노쇼한 사람을 선택해주세요</Title>
        <Description>
          상대방에게 패널티가 적용되니 신중하게 선택해주세요
        </Description>
      </TitleContainer>
      <UserGrid>
        {users.map((user) => (
          <UserItem
            key={user.id}
            name={user.name}
            profileImage={user.image}
            selected={selectedUserId.includes(user.id)}
            onClick={() => {
              if (selectedUserId.includes(user.id)) {
                setSelectedUserId(
                  selectedUserId.filter((id) => id !== user.id),
                );
              } else {
                setSelectedUserId([...selectedUserId, user.id]);
              }
            }}
            width={105}
            height={80}
          />
        ))}
      </UserGrid>
      <SubmitButton
        disabled={selectedUserId.length === 0}
        onClick={() => {
          router.push(`/noshow/matching/${matchingId}/inappropriate`);
        }}
      >
        제출하기
      </SubmitButton>
    </>
  );
}
