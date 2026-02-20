import styled from 'styled-components';

export default function Ready2() {
  return (
    <Page>
      <LogoCharacter
        src="/svgs/home/eating-logo-character.svg"
        alt="로고 캐릭터"
      />
      <MainText>준비 중인 페이지입니다.</MainText>
      <SubText>매칭이 이루어진 후에 이용할 수 있습니다.</SubText>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200px;
  height: 100vh;
`;

const LogoCharacter = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

const MainText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #ff5900;
`;

const SubText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #707070;
`;
