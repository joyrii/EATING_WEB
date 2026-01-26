import { GuideCardContainer, GuideCardTitle } from "./style";

export default function GuideCard({
  title,
  bg,
}: {
  title: string;
  bg: string;
}) {
  return (
    <GuideCardContainer $bg={bg}>
      <GuideCardTitle>{title}</GuideCardTitle>
    </GuideCardContainer>
  );
}
