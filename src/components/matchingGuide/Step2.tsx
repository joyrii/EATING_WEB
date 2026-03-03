import { Body, Container, Content, Header, Text } from './style';

export default function MatchingGuideStep2() {
  return (
    <Container>
      <Header>
        <Text>
          잇팅이 공강 시간과 성향을 바탕으로,
          <br />
          같이 밥이나 카페 갈 벗을 매칭해드려요!
        </Text>
      </Header>
      <Body>
        <Content src="/svgs/guide/guide-2.svg" alt="guide-2" />
      </Body>
    </Container>
  );
}
