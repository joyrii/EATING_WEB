import { Body, Container, Content, Header, Text } from './style';

export default function MatchingGuideStep4() {
  return (
    <Container>
      <Header>
        <Text>
          최적의 매칭을 위해 관심사,
          <br />
          가능한 날짜·시간 등을 입력해주세요
        </Text>
      </Header>
      <Body>
        <Content $width="100vw" src="/svgs/guide/guide-4.svg" alt="guide-4" />
      </Body>
    </Container>
  );
}
