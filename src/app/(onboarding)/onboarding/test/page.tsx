'use client';

import Image from 'next/image';
import {
  ButtonWrapper,
  ImageWrapper,
  SkipButton,
  SkipButtonWrapper,
  SkipButtonText,
  StepText,
  SubText,
  TextWrapper,
  TitleText,
  TestButton,
} from '../style';
import { IoChevronForward } from 'react-icons/io5';
import Button from '@/components/BaseButton';

export default function OnboardingTest() {
  return (
    <div>
      <SkipButtonWrapper>
        <SkipButton>
          <SkipButtonText>건너뛰기</SkipButtonText>
          <IoChevronForward size={24} color="#a3a3a3" />
        </SkipButton>
      </SkipButtonWrapper>
      <TextWrapper style={{ marginTop: '6px', marginBottom: '40px' }}>
        <StepText>03</StepText>
        <TitleText>성향 테스트 결과를 알려주세요.</TitleText>
        <SubText>
          완료하지 않으셨다면, 배포 전 처음 배포한 테스트에 참여해보세요!
        </SubText>
      </TextWrapper>
      <ImageWrapper>
        <Image
          src="/svgs/tendency-test.svg"
          alt="tendency-test"
          width={316}
          height={316}
        />
      </ImageWrapper>
      <ButtonWrapper
        style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}
      >
        <TestButton
          href="https://eating-survey.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          테스트 하러가기
        </TestButton>
        <Button label="정보 가져오기" onClick={() => {}} />
      </ButtonWrapper>
    </div>
  );
}
