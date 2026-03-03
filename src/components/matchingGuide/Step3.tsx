import { Container, Text, Content, Header, Body } from './style';

export default function MatchingGuideStep3() {
  return (
    <Container>
      <Header>
        <Text>
          회원가입 후<br />
          매칭 신청을 시작해주세요
        </Text>
      </Header>
      <Body>
        <Content src="/svgs/guide/guide-3.svg" alt="guide-3" />
      </Body>
    </Container>
  );
}
