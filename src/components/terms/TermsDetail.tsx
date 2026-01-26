import { Content, Title, Page } from '@/app/(onboarding)/terms/style';

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
