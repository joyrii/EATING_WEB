import styled from 'styled-components';

type TermsDetailProps = {
  title: string;
  content: string;
};

export default function TermsDetail({ title, content }: TermsDetailProps) {
  return (
    <Page>
      <div>
        <Title>{title}</Title>
      </div>
      <div style={{ marginTop: 15 }}>
        <Content>{content}</Content>
      </div>
    </Page>
  );
}

const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  padding-inline: 25px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  white-space: pre-line;
`;

const Content = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #575757;
  line-height: 1.8;
  letter-spacing: -0.01em;
`;
