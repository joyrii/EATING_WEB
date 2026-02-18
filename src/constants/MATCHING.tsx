import { ReactNode } from 'react';

export type MatchingStatus =
  | 'pre_registered'
  | 'before'
  | 'inProgress'
  | 'completed';

type MatchingSectionText = {
  title: ReactNode;
  description: string;
};

export const getMatchingSectionText = (
  status: MatchingStatus,
  name: string,
): MatchingSectionText => {
  const texts: Record<MatchingStatus, MatchingSectionText> = {
    pre_registered: {
      title: <>사전신청해주신 {name}님 반가워요!</>,
      description: '매칭 성사를 위해 아래 버튼을 눌러 진행해주세요',
    },
    before: {
      title: (
        <>
          {name}님께 <span>딱!</span> 맞는 친구들을
          <br />
          매칭해드릴게요
        </>
      ),
      description:
        '맞춤 성향 알고리즘을 통해 최적의 매칭 결과를 받아보실 수 있어요!',
    },
    inProgress: {
      title: (
        <>
          금요일 <span>오후 5시</span>에 결과가 발표됩니다!
        </>
      ),
      description: '최적의 매칭 상대를 찾는 중...',
    },
    completed: {
      title: <>다음주 매칭을 신청해보세요!</>,
      description:
        '빠르게 신청할수록 자신과 관심사가 비슷한 사람과 만날 기회가 높아져요!',
    },
  };

  return texts[status];
};
