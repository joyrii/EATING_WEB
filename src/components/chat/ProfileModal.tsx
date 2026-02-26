import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

type UserInfo = {
  user_id: string;
  name: string;
  department: string;
  student_id: string;
  is_verified: boolean;
  mbti: string;
  pre_test_result: string;
  interests: any[];
};

export default function ProfileModal({
  isOpen,
  onClose,
  userInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Bar />
        {!userInfo ? (
          <LoadingText>사용자 정보를 불러오는 중입니다...</LoadingText>
        ) : (
          <>
            <UserInfo>
              <ProfileImage
                src="/images/chat/profile-default-3.png"
                alt="Profile Image"
              />
              <UserInfoDetails>
                <UserNameWrapper>
                  <UserName>{userInfo?.name}</UserName>
                  {userInfo?.is_verified && (
                    <VerificationChip>
                      <VerificationMark
                        src="/svgs/chat/verification-mark.svg"
                        alt="Verification Mark"
                      />
                      학교 인증
                    </VerificationChip>
                  )}
                </UserNameWrapper>
                <UserDetail>
                  {userInfo?.department}{' '}
                  {userInfo?.student_id.slice(0, 2) || '26'}
                  학번
                </UserDetail>
                <UserDetail>{userInfo?.mbti}</UserDetail>
              </UserInfoDetails>
            </UserInfo>
            <InterestsWrapper>
              <InterestsTitle>관심사</InterestsTitle>
              <InterestsList>
                {userInfo?.interests.map((interest, index) => (
                  <InterestChip key={index}>#{interest}</InterestChip>
                ))}
              </InterestsList>
            </InterestsWrapper>
          </>
        )}
      </Modal>
    </Overlay>,
    document.body,
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1001;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 16px 45px 70px 45px;
`;

const Bar = styled.div`
  width: 50px;
  height: 4px;
  background: #d9d9d9;
  border-radius: 17px;
  margin: 0 auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 45px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 40px;
  object-fit: cover;
  margin-right: 25px;
`;

const UserInfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
`;

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 500;
`;

const VerificationChip = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0, 100, 62, 0.08);
  border-radius: 30px;
  color: #00643e;
  font-size: 8px;
  font-weight: 500;
  padding: 5px 8px;
  margin-left: 5px;
`;

const VerificationMark = styled.img`
  width: 10px;
  height: 12px;
`;

const UserDetail = styled.p`
  font-size: 14px;
  font-weight: 400;
`;

const InterestsWrapper = styled.div`
  margin-top: 30px;
  gap: 12px;
  display: flex;
  flex-direction: column;
`;

const InterestsTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const InterestChip = styled.span`
  font-size: 12px;
  color: #707070;
  background: #fafafa;
  padding: 10px;
  border-radius: 30px;
  margin-right: 11px;
  margin-bottom: 10px;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #707070;
  text-align: center;
  margin-top: 40px;
`;
