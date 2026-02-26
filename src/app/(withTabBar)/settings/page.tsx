'use client';

import { useEffect, useState } from 'react';
import {
  Header,
  HeaderText,
  LogoCharacter,
  Page,
  Contents,
  Section,
  SectionTitle,
  Footer,
  InfoLabel,
  Infos,
  Info,
  Profile,
  ProfileImage,
  ProfileInfo,
  ProfileNameWrapper,
  ProfileName,
  VerificationChip,
  VerificationMark,
  ProfileInfoText,
  Mention,
  ChangeInterest,
  CustomerServiceCenter,
  CustomerServiceCenterText,
  SectionItem,
  SectionList,
} from './style';
import { getMyProfile } from '@/api/settings';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Settings() {
  const router = useRouter();
  const params = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 프로필 가져오기
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 관심사 변경 시 토스트
  useEffect(() => {
    if (params.get('interestUpdated') === 'true') {
      toast.success('관심사가 변경되었습니다!', {
        id: 'interest-updated-toast',
      });
      router.replace('/settings');
    }
  }, [params]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Page>
      <Header>
        <HeaderText>잇팅</HeaderText>
        <LogoCharacter alt="logo-character" />
      </Header>
      <Contents>
        <Section>
          <SectionTitle>프로필 설정</SectionTitle>
          <Profile>
            <ProfileImage
              src="/images/chat/profile-default-3.png"
              alt="profile"
            />
            <ProfileInfo>
              <ProfileNameWrapper>
                <ProfileName>{profile?.name}</ProfileName>
                {profile?.is_verified && (
                  <VerificationChip>
                    <VerificationMark
                      src="/svgs/chat/verification-mark.svg"
                      alt="Verification Mark"
                    />
                    학교 인증
                  </VerificationChip>
                )}
              </ProfileNameWrapper>
              <Mention>힙합보단 사랑, 사랑보단 벗</Mention>
              <ProfileInfoText>
                {profile?.student_id || '26학번'}
              </ProfileInfoText>
              <ProfileInfoText>{profile?.department}</ProfileInfoText>
              <ChangeInterest onClick={() => router.push('/change-interests')}>
                관심사 변경하러 가기
              </ChangeInterest>
            </ProfileInfo>
          </Profile>
          <CustomerServiceCenter>
            <CustomerServiceCenterText>
              <img
                src="/svgs/service-center.svg"
                alt="customer-service-center"
              />
              <span>고객센터 바로 연결</span>
            </CustomerServiceCenterText>
          </CustomerServiceCenter>
        </Section>
        <Section>
          <SectionTitle>기본 설정</SectionTitle>
          <SectionList>
            <SectionItem>구글 이메일 인증</SectionItem>
            <SectionItem>알림 설정</SectionItem>
          </SectionList>
        </Section>
        <Section>
          <SectionTitle>고객 지원</SectionTitle>
          <SectionList>
            <SectionItem>신고하기</SectionItem>
            <SectionItem>페널티 기록</SectionItem>
            <SectionItem>이용약관</SectionItem>
            <SectionItem>로그아웃</SectionItem>
            <SectionItem>회원 탈퇴</SectionItem>
          </SectionList>
        </Section>
      </Contents>
      <Footer>
        <InfoLabel>잇팅(eating) 사업자 정보</InfoLabel>
        <Infos>
          <Info>
            <span>대표</span> 김주연
          </Info>
          <Info>
            <span>사업자 번호</span> 313-09-72010
          </Info>
          <Info>
            <span>주소</span> 서울시 강남구 영동대로 22 810-603
          </Info>
          <Info>
            <span>이메일</span> rwd4533@naver.com
          </Info>
        </Infos>
      </Footer>
    </Page>
  );
}
