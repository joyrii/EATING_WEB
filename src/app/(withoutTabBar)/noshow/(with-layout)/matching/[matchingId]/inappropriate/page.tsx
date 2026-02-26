'use client';

import styled from 'styled-components';
import {
  Description,
  Title,
  TitleContainer,
  UserGrid,
  SubmitButton,
} from '../../../style';
import { useEffect, useState } from 'react';
import UserItem from '@/components/feedback/UserItem';
import { useParams, useRouter } from 'next/navigation';
import { getReportableRooms, submitReport } from '@/api/review';

export default function Inappropriate() {
  const router = useRouter();
  const matchingId = useParams().matchingId as string;
  const [members, setMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<string[]>([]);
  const [reportText, setReportText] = useState('');

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
          selectedUserId.map((id) => ({
            user_id: id,
            report_type: 'inappropriate',
            report_text: reportText,
          })),
        );
        router.push('/noshow/complete');
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    })();
  };

  return (
    <div style={{ padding: '0 25px' }}>
      <TitleContainer>
        <Title>취지와 다른 목적으로 접근한 사람이 있었나요?</Title>
        <Description>전도, 홍보 등으로 느껴진 경우 골라주세요</Description>
      </TitleContainer>
      <UserGrid>
        {members.map((user) => (
          <UserItem
            key={user.user_id}
            name={user.name}
            profileImage={`/images/chat/profile-default-3.png`}
            selected={selectedUserId.includes(user.user_id)}
            onClick={() => {
              if (selectedUserId.includes(user.user_id)) {
                setSelectedUserId(
                  selectedUserId.filter((id) => id !== user.user_id),
                );
              } else {
                setSelectedUserId([...selectedUserId, user.user_id]);
              }
            }}
            width={105}
            height={80}
          />
        ))}
      </UserGrid>
      <ReportText
        placeholder="어떤 상황이었는지 자세히 작성해주세요!"
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
      />
      <SubmitButton
        disabled={selectedUserId.length === 0}
        onClick={() => {
          handleSubmit();
        }}
      >
        제출하기
      </SubmitButton>
    </div>
  );
}

const ReportText = styled.textarea`
  width: 100%;
  height: 100px;
  margin-top: 20px;
  padding: 12px 16px;
  border: 1px solid #f5f5f5;
  background-color: #fefefe;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;

  &::placeholder {
    color: #bdbdbd;
  }
`;
