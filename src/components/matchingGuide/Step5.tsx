import { Body, Container, Content, Header, Text } from './style';

export default function MatchingGuideStep5() {
  return (
    <Container>
      <Header>
        <Text>
          매주 <b>금요일 오후 5시</b>에<br />
          잇팅 채팅방이 열려요
        </Text>
      </Header>
      <Body>
        <Content src="/svgs/guide/guide-5.svg" alt="guide-5" />
      </Body>
    </Container>
  );
}
