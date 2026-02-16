import { Header, BackButton, HeaderText } from './style';

export default function NoshowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header>
        <BackButton>
          <img src="/svgs/back.svg" alt="뒤로가기" />
        </BackButton>
        <HeaderText>신고하기</HeaderText>
      </Header>
      {children}
    </>
  );
}
