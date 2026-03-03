import { Container, Text, SubText, Content, Header, Body } from './style';

export default function MatchingGuideStep7() {
  return (
    <Container>
      <Header>
        <Text>약속 30분 후, 2차 카페 리스트도 열려요</Text>
        <SubText>(동일한 할인코드로 사용 가능합니다)</SubText>
      </Header>
      <Body>
        <Content src="/svgs/guide/guide-7.svg" alt="guide-7" />
      </Body>
    </Container>
  );
}
