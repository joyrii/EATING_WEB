import { ReactNode } from "react";

export type MatchingStatus = "before" | "inProgress" | "completed";

type matchingSectionText = {
  title: ReactNode;
  description: string;
};

export const matchingSectionText: Record<MatchingStatus, matchingSectionText> =
  {
    before: {
      title: (
        <>
          주연님께 <span>딱!</span> 맞는 친구들을
          <br />
          매칭해드릴게요
        </>
      ),
      description:
        "맞춤 성향 알고리즘을 통해 최적의 매칭 결과를 받아보실 수 있어요!",
    },
    inProgress: {
      title: <>매칭이 진행 중입니다..</>,
      description: "이번주 금요일 오후 5시에 결과가 발표됩니다!",
    },
    completed: {
      title: <>다음주 매칭을 신청해보세요!</>,
      description:
        "빠르게 신청할수록 자신과 관심사가 비슷한 사람과 만날 기회가 높아져요!",
    },
  };
