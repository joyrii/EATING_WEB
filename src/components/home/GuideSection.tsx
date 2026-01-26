import GuideCard from "@/components/home/GuideCard";
import { GuideScroll, Section, SectionTitle } from "./style";

export default function GuideSection() {
  return (
    <Section>
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
    </Section>
  );
}
