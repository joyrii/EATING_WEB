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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function OnboardingTest() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log('🔎 session:', session);
      console.log('🔎 access_token:', session?.access_token);
      console.log('🔎 expires_at:', session?.expires_at);

      if (error) {
        console.error('❌ session error:', error);
      }
    })();
  }, []);

  type UserState = 'beforeTest' | 'afterTest' | 'done';
  const currentState: UserState = 'done'; // This would be determined by actual user data

  type PrimaryAction =
    | { kind: 'link'; label: string; href: string }
    | { kind: 'complete'; label: string; onClick: () => void }
    | { kind: 'loading'; label: string };

  type StateUI = Record<
    UserState,
    {
      title: string;
      subtitle: string;
      primary: PrimaryAction;
    }
  >;

  const STATE_UI: StateUI = {
    beforeTest: {
      title: '성향 테스트 결과를 알려주세요.',
      subtitle:
        '완료하지 않으셨다면, 배포 전 처음 배포한 테스트에 참여해보세요!',
      primary: {
        kind: 'link',
        label: '테스트 하러가기',
        href: 'https://eating-survey.vercel.app/',
      },
    },
    afterTest: {
      title: '성향 테스트 결과를 연동해드릴게요!',
      subtitle: '이미 완료하신 결과를 자동으로 연결해드려요',
      primary: { kind: 'loading', label: '연동 중…' },
    },
    done: {
      title: '결과 연동이 완료되었습니다!',
      subtitle: '이제 사용자님의 성향 정보를 더 구체적으로 알 수 있어요',
      primary: {
        kind: 'complete',
        label: '완료',
        onClick: () => {
          router.push('/home');
        },
      },
    },
  };

  const ui = STATE_UI[currentState];

  const renderPrimary = () => {
    const p = ui.primary;
    if (p.kind === 'link') {
      return (
        <TestButton href={p.href} target="_blank" rel="noopener noreferrer">
          {p.label}
        </TestButton>
      );
    } else if (p.kind === 'complete') {
      return (
        <TestButtonAsButton type="button" onClick={p.onClick}>
          {p.label}
        </TestButtonAsButton>
      );
    } else if (p.kind === 'loading') {
      return (
        <TestButtonAsButton type="button" disabled>
          {p.label}
        </TestButtonAsButton>
      );
    }
  };

  return (
    <div>
      <SkipButtonWrapper>
        <SkipButton onClick={() => router.push('/home')}>
          <span>건너뛰기</span>
        </SkipButton>
      </SkipButtonWrapper>
      <TextWrapper style={{ marginTop: '6px', marginBottom: '40px' }}>
        <StepText>03</StepText>
        <TitleText>{ui.title}</TitleText>
        <SubText>{ui.subtitle}</SubText>
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
        {renderPrimary()}
      </ButtonWrapper>
    </div>
  );
}

const SkipButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
`;

const SkipButton = styled.button`
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #3d3d3d;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
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

const TestButtonAsButton = styled.button`
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
`;
