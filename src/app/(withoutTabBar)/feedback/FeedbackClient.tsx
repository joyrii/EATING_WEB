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
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPendingReviews, submitReview } from '@/api/review';

export default function Feedback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = useMemo(() => {
    const v = searchParams.get('group_id');
    return v ? String(v) : null;
  }, [searchParams]);

  const [rating, setRating] = useState(0);
  const [members, setMembers] = useState([]);
  const [hasExcludeUser, setHasExcludeUser] = useState(null);
  const [hasInappropriateUser, setHasInappropriateUser] = useState(null);
  const [selectedExcludeUserId, setSelectedExcludeUserId] = useState<string[]>(
    [],
  );
  const [selectedInappropriateUserId, setSelectedInappropriateUserId] =
    useState<string[]>([]);
  const [inappropriateFeedback, setInappropriateFeedback] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // 매칭 정보 가져오기
  useEffect(() => {
    if (!groupId) return;

    (async () => {
      const res = await getPendingReviews();
      const found = res.find((review) => review.group_id === groupId);

      if (found) {
        setMembers(found.members);
      }
    })();
  }, [groupId]);

  const handleSubmit = async () => {
    await submitReview(
      groupId,
      rating,
      selectedExcludeUserId,
      selectedInappropriateUserId,
      feedbackText,
    );
  };

  return (
    <>
      <Header>
        <BackButton onClick={() => router.back()}>
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
            {members.map((user) => (
              <UserItem
                key={user.user_id}
                name={user.name}
                profileImage={`/images/chat/profile-default-3.png`}
                selected={selectedExcludeUserId.includes(user.user_id)}
                onClick={() => {
                  setSelectedExcludeUserId((prev) =>
                    prev.includes(user.user_id)
                      ? prev.filter((id) => id !== user.user_id)
                      : [...prev, user.user_id],
                  );
                }}
                width={88}
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
              {members.map((user) => (
                <UserItem
                  key={user.user_id}
                  name={user.name}
                  profileImage={`/images/chat/profile-default-3.png`}
                  selected={selectedInappropriateUserId.includes(user.user_id)}
                  onClick={() => {
                    setSelectedInappropriateUserId((prev) =>
                      prev.includes(user.user_id)
                        ? prev.filter((id) => id !== user.user_id)
                        : [...prev, user.user_id],
                    );
                  }}
                />
              ))}
            </UserList>
            <Input
              placeholder="친구 사귀기 외의 목적(전도, 홍보 등)으로 느껴진 경우 어떤 상황이었는지 작성해주세요!"
              value={inappropriateFeedback}
              onChange={(e) => setInappropriateFeedback(e.target.value)}
            />
          </>
        )}
      </FeedbackSection>
      <FeedbackSection style={{ borderBottom: 'none' }}>
        <SectionTitle>
          서비스에 대한 의견이나 제안이 있다면 편하게 작성해주세요
        </SectionTitle>
        <Input
          placeholder="입력해주세요"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
      </FeedbackSection>
      <SubmitButton
        type="submit"
        onClick={async () => {
          await handleSubmit();
          router.replace('/home');
        }}
      >
        제출하기
      </SubmitButton>
    </>
  );
}
