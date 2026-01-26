import { Section, SectionTitle, MatchingList } from "./style";
import MatchingListItem from "./MatchingListItem";

export default function MatchingListSection() {
  return (
    <Section>
      <SectionTitle>
        이번주에 매칭된 방 <span>5개</span>
      </SectionTitle>
      <MatchingList>
        <MatchingListItem status="match" />
        <MatchingListItem status="default" />
        <MatchingListItem status="default" />
        <MatchingListItem status="default" />
        <MatchingListItem status="default" />
      </MatchingList>
    </Section>
  );
}
