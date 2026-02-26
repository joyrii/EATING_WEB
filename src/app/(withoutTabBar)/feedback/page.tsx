'use client';

import UserItem from '@/components/feedback/UserItem';
import {
  Header,
  BackButton,
  HeaderText,
  ServiceRate,
  ServiceRateLabel,
  Stars,
  FeedbackSection,
  SectionTitle,
  SectionDescription,
  ButtonWrapper,
  Button,
  SubmitButton,
  Input,
  UserList,
} from './style';
import { useState } from 'react';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hasExcludeUser, setHasExcludeUser] = useState(null);
  const [hasInappropriateUser, setHasInappropriateUser] = useState(null);

  const [selectedExcludeUserId, setSelectedExcludeUserId] = useState<number[]>(
    [],
  );
  const [selectedInappropriateUserId, setSelectedInappropriateUserId] =
    useState<number[]>([]);

  const users = [
    { id: 1, name: '홍길동', image: '/images/chat/profile-image-1.jpeg' },
    { id: 2, name: '김철수', image: '/images/chat/profile-image-2.jpeg' },
    { id: 3, name: '이영희', image: '/images/chat/profile-image-3.jpeg' },
    { id: 4, name: '박민수', image: '/images/chat/profile-image-4.jpeg' },
    { id: 5, name: '최수진', image: '/images/chat/profile-image-1.jpeg' },
  ];

  return (
    <>
      <Header>
        <BackButton>
          <img src="/svgs/back.svg" alt="뒤로가기" />
        </BackButton>
        <HeaderText>오늘의 잇팅 피드백</HeaderText>
      </Header>
      <ServiceRate>
        <ServiceRateLabel>서비스 평점</ServiceRateLabel>
        <Stars>
          {[1, 2, 3, 4, 5].map((star) => (
            <img
              key={star}
              src={
                star <= rating
                  ? '/svgs/feedback/star-filled.svg'
                  : '/svgs/feedback/star-empty.svg'
              }
              alt={`${star}점`}
              width={30}
              height={30}
              style={{ cursor: 'pointer' }}
              onClick={() => setRating(star)}
            />
          ))}
        </Stars>
      </ServiceRate>
      <FeedbackSection>
        <SectionTitle>다음 매칭에서 제외하고 싶은 사람이 있나요?</SectionTitle>
        <SectionDescription>
          선택한 사람은 이후 매장에서 만나지 않아요!
        </SectionDescription>
        <ButtonWrapper>
          <Button
            selected={hasExcludeUser === true}
            onClick={() => setHasExcludeUser(true)}
          >
            네
          </Button>
          <Button
            selected={hasExcludeUser === false}
            onClick={() => setHasExcludeUser(false)}
          >
            아니요
          </Button>
        </ButtonWrapper>
        {hasExcludeUser === true && (
          <UserList>
            {users.map((user) => (
              <UserItem
                key={user.id}
                name={user.name}
                profileImage={user.image}
                selected={selectedExcludeUserId.includes(user.id)}
                onClick={() => {
                  setSelectedExcludeUserId((prev) =>
                    prev.includes(user.id)
                      ? prev.filter((id) => id !== user.id)
                      : [...prev, user.id],
                  );
                }}
              />
            ))}
          </UserList>
        )}
      </FeedbackSection>
      <FeedbackSection>
        <SectionTitle>
          취지와 다른 목적으로 접근한 사람이 있었나요?
        </SectionTitle>
        <SectionDescription>
          전도, 홍보 등 친구 사귀기 외의 목적으로 접근했다면 알려주세요
        </SectionDescription>
        <ButtonWrapper>
          <Button
            selected={hasInappropriateUser === true}
            onClick={() => setHasInappropriateUser(true)}
          >
            네
          </Button>
          <Button
            selected={hasInappropriateUser === false}
            onClick={() => setHasInappropriateUser(false)}
          >
            아니요
          </Button>
        </ButtonWrapper>
        {hasInappropriateUser === true && (
          <>
            <UserList>
              {users.map((user) => (
                <UserItem
                  key={user.id}
                  name={user.name}
                  profileImage={user.image}
                  selected={selectedInappropriateUserId.includes(user.id)}
                  onClick={() => {
                    setSelectedInappropriateUserId((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((id) => id !== user.id)
                        : [...prev, user.id],
                    );
                  }}
                />
              ))}
            </UserList>
            <Input placeholder="친구 사귀기 외의 목적(전도, 홍보 등)으로 느껴진 경우 어떤 상황이었는지 작성해주세요!" />
          </>
        )}
      </FeedbackSection>
      <FeedbackSection style={{ borderBottom: 'none' }}>
        <SectionTitle>
          서비스에 대한 의견이나 제안이 있다면 편하게 작성해주세요
        </SectionTitle>
        <Input placeholder="입력해주세요" />
      </FeedbackSection>
      <SubmitButton type="submit">제출하기</SubmitButton>
    </>
  );
}
