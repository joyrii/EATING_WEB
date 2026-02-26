'use client';

import {
  Description,
  Title,
  TitleContainer,
  UserGrid,
  SubmitButton,
} from '../../../style';
import { useState } from 'react';
import UserItem from '@/components/feedback/UserItem';
import { useRouter } from 'next/navigation';

export default function Inappropriate() {
  const router = useRouter();
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
        <Title>취지와 다른 목적으로 접근한 사람이 있었나요?</Title>
        <Description>전도, 홍보 등으로 느껴진 경우 골라주세요</Description>
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
        onClick={() => {
          router.push(`/home`);
        }}
      >
        제출하기
      </SubmitButton>
    </>
  );
}
