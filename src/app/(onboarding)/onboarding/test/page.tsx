'use client';

import styled from 'styled-components';
import Image from 'next/image';
import {
  StepText,
  SubText,
  TextWrapper,
  TitleText,
  ButtonWrapper,
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

const SkipButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SkipButton = styled.button`
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
`;

const SkipButtonText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #a3a3a3;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TestButton = styled.a`
  display: flex;
  width: 100%;
  height: 55px;
  background-color: #ff5900;
  border: none;
  border-radius: 10px;
  padding-block: 18px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;

  &:visited {
    color: #ffffff;
  }
`;
