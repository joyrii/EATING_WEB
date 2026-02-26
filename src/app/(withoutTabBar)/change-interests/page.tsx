'use client';

import styled from 'styled-components';
import InterestsForm from '@/components/onboarding/InterestsForm';
import { useUser } from '@/context/userContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useState } from 'react';

export default function ChangeInterests() {
  const { me } = useUser();
  const name = me?.name || '';

  return (
    <Page>
      <InterestsForm
        stepText=""
        titleText={(name) => `${name}님의 관심사를 변경해주세요.`}
        nextLabel="완료"
        nextRoute="/settings"
        successQueryKey="interestUpdated"
      />
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-inline: 25px;
`;
