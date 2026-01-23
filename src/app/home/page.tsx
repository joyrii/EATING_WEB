import {
  MatchingDescription,
  MatchingSection,
  MatchingButton,
  MatchingTitle,
  MatchingButtonArea,
  MatchingText,
} from "./style";

export default function Home() {
  return (
    <>
      <MatchingSection>
        <MatchingText>
          <MatchingTitle>
            주연님께 <span>딱!</span> 맞는 친구들을
            <br />
            매칭해드릴게요
          </MatchingTitle>
          <MatchingDescription>
            맞춤 성향 알고리즘을 통해 최적의 매칭 결과를 받아보실 수 있어요!
          </MatchingDescription>
        </MatchingText>
        <MatchingButtonArea>
          <MatchingButton>매칭 신청하러 가기</MatchingButton>
        </MatchingButtonArea>
      </MatchingSection>
    </>
  );
}
