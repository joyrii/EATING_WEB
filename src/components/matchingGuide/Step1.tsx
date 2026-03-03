import { Container, Text, Content, Body, Header } from './style';

export default function MatchingGuideStep1() {
  return (
    <Container>
      <Header>
        <Text>
          대학생활하며 새로운 친구를
          <br />
          사귀어보고 싶으신가요?
        </Text>
      </Header>
      <Body>
        <Content src="/svgs/guide/guide-1.svg" alt="guide-1" />
      </Body>
    </Container>
  );
}
