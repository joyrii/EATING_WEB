'use client';

import MatchingListItem from '@/components/home/MatchingListItem';
import { Description, Title, TitleContainer, MatchingList } from '../style';
import { useRouter } from 'next/navigation';

export default function NoshowStore() {
  const router = useRouter();

  const matchings = [
    { id: 1, title: '매칭 1' },
    { id: 2, title: '매칭 2' },
    { id: 3, title: '매칭 3' },
    { id: 4, title: '매칭 4' },
  ];

  return (
    <>
      <TitleContainer>
        <Title>노쇼가 있었던 매칭을 선택해주세요</Title>
        <Description>처단하자! 노쇼!</Description>
      </TitleContainer>
      <MatchingList>
        {matchings.map((matching) => (
          <MatchingListItem
            key={matching.id}
            clickable
            onClick={() => router.push(`/noshow/matching/${matching.id}/user`)}
          />
        ))}
      </MatchingList>
    </>
  );
}
