'use client';

import UserItem from '@/components/feedback/UserItem';
import {
  Description,
  Title,
  TitleContainer,
  UserGrid,
  SubmitButton,
} from '../../../style';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getReportableRooms, submitReport } from '@/api/review';

export default function NoshowUser() {
  const router = useRouter();
  const matchingId = useParams().matchingId as string;
  const [members, setMembers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // 매칭 정보 가져오기
  useEffect(() => {
    (async () => {
      try {
        const res = await getReportableRooms();
        const found = res.find((room) => room.group_id === matchingId);
        if (found) {
          setMembers(found.members);
        }
      } catch (error) {
        console.error('Error fetching reportable rooms:', error);
      }
    })();
  });

  const handleSubmit = async () => {
    (async () => {
      try {
        await submitReport(
          matchingId,
          selectedUserIds.map((id) => ({
            user_id: id,
            report_type: 'no_show',
          })),
        );
        router.push('/noshow/complete');
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    })();
  };

  return (
    <>
      <TitleContainer>
        <Title>노쇼한 사람을 선택해주세요</Title>
        <Description>
          상대방에게 패널티가 적용되니 신중하게 선택해주세요
        </Description>
      </TitleContainer>
      <UserGrid>
        {members.map((user) => (
          <UserItem
            key={user.user_id}
            name={user.name}
            profileImage={`/images/chat/profile-default-3.png`}
            selected={selectedUserIds.includes(user.user_id)}
            onClick={() => {
              if (selectedUserIds.includes(user.user_id)) {
                setSelectedUserIds(
                  selectedUserIds.filter((id) => id !== user.user_id),
                );
              } else {
                setSelectedUserIds([...selectedUserIds, user.user_id]);
              }
            }}
            width={105}
            height={80}
          />
        ))}
      </UserGrid>
      <SubmitButton
        disabled={selectedUserIds.length === 0}
        onClick={() => handleSubmit()}
      >
        제출하기
      </SubmitButton>
    </>
  );
}
