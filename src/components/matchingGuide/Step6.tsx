import { Body, Container, Content, Header, Text } from './style';

export default function MatchingGuideStep6() {
  return (
    <Container>
      <Header>
        <Text>
          채팅방에서 받은 할인코드로
          <br />
          QR 인증을 하면 혜택을 받을 수 있어요
        </Text>
      </Header>
      <Body>
        <Content $width="75vw" src="/svgs/guide/guide-6.svg" alt="guide-6" />
      </Body>
    </Container>
  );
}
