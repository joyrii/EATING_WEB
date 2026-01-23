import GuideCard from "@/components/home/GuideCard";
import {
  MatchingDescription,
  MatchingSection,
  MatchingButton,
  SectionTitle,
  MatchingButtonArea,
  MatchingText,
  GuideSection,
  GuideScroll,
} from "./style";

export default function Home() {
  return (
    <>
      <MatchingSection>
        <MatchingText>
          <SectionTitle>
            주연님께 <span>딱!</span> 맞는 친구들을
            <br />
            매칭해드릴게요
          </SectionTitle>
          <MatchingDescription>
            맞춤 성향 알고리즘을 통해 최적의 매칭 결과를 받아보실 수 있어요!
          </MatchingDescription>
        </MatchingText>
        <MatchingButtonArea>
          <MatchingButton>매칭 신청하러 가기</MatchingButton>
        </MatchingButtonArea>
      </MatchingSection>
      <GuideSection>
        <SectionTitle>잇팅 가이드</SectionTitle>
        <GuideScroll>
          <GuideCard
            title={"잇팅 매칭\n신청 과정에 대해\n알아봐요!"}
            bg="/svgs/home/guide-card-bg-1.svg"
          />
          <GuideCard
            title={"이대 메일 계정\n만드는 법에 대해\n알려드릴게요"}
            bg="/svgs/home/guide-card-bg-2.svg"
          />
          <GuideCard
            title={"이대 메일 계정\n만드는 법에 대해\n알려드릴게요"}
            bg="/svgs/home/guide-card-bg-2.svg"
          />
        </GuideScroll>
      </GuideSection>
    </>
  );
}
