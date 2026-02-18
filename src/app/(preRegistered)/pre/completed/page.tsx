import styled from 'styled-components';
import Image from 'next/image';

export default function PreCompleted() {
  return (
    <Wrapper>
      <CompleteSection>
        <Image
          src="/svgs/complete.svg"
          alt="completed"
          width={48}
          height={48}
        />
        <MainText>매칭 신청 완료!</MainText>
        <SubText>잇팅에 관심을 가져주셔서 감사합니다!</SubText>
      </CompleteSection>
      <Announcement>
        <Date>2월 22일 오후 5시</Date>
        <Content>매칭 결과를 카카오톡으로 발송해드립니다!</Content>
      </Announcement>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
`;

const CompleteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MainText = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-top: 11px;
  text-align: center;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #a3a3a3;
  margin-top: 7px;
  text-align: center;
`;

const Announcement = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fffaf8;
  padding: 10px;
  border-radius: 10px;
`;

const Date = styled.span`
  font-size: 21px;
  font-weight: 700;
  color: #ff5900;
  text-align: center;
  text-decoration: underline;
`;

const Content = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #000;
  margin-top: 8px;
  text-align: center;
`;
