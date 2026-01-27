'use client';

import {
  TextWrapper,
  StepText,
  TitleText,
  SubText,
  ButtonWrapper,
} from '@/app/(onboarding)/onboarding/style';
import { CautionWrapper, DateBox, ModalContent } from '../style';
import TimeGrid from '@/components/application/TimeGrid';
import Button from '@/components/BaseButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseModal } from '@/components/BaseModal';
import Image from 'next/image';
import { ModalButtonWrapper } from '../style';

export default function Schedule() {
  const router = useRouter();
  const [hasSelection, setHasSelection] = useState(false); // 선택된 셀이 있어야 다음으로
  const [isModalVisible, setIsModalVisible] = useState(false); // 확인 모달

  return (
    <>
      <div>
        <TextWrapper>
          <StepText>01</StepText>
          <TitleText>매칭 가능한 일정을 알려주세요.</TitleText>
          <SubText>
            꼭 나갈 수 있는 시간만 스크롤해서 선택해주세요!
            <br />
            <span>최대 2개</span>의 방이 생성될 수 있어요
          </SubText>
        </TextWrapper>
        <DateBox>1월 12일 ~ 1월 18일</DateBox>
        <TimeGrid onChange={(count) => setHasSelection(count > 0)} />
        <ButtonWrapper>
          <Button
            label="다음"
            disabled={!hasSelection}
            onClick={() => setIsModalVisible(true)}
          />
        </ButtonWrapper>
      </div>
      <BaseModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        padding="20px 21px"
      >
        <ModalContent>
          <CautionWrapper>
            <Image
              src="/svgs/caution.svg"
              alt="caution"
              width={36}
              height={36}
            />
            <p>
              방이 생성된 후 약속을 파투낼 시<br />
              노쇼 페널티가 부과됩니다
            </p>
          </CautionWrapper>
          <ModalButtonWrapper>
            <Button
              label="확인"
              onClick={() => router.push('/application/dining')}
            />
          </ModalButtonWrapper>
        </ModalContent>
      </BaseModal>
    </>
  );
}
