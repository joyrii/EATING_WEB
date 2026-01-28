export const INTERESTS_SECTION = [
  {
    options: [
      '알바',
      '과외',
      '스터디',
      '대학원',
      '방문학생/교환학생',
      '동아리',
    ],
  },
  {
    title: '뮤직',
    options: [
      '여자아이돌',
      '남자아이돌',
      'Kpop 밴드',
      '뮤지컬',
      '락밴드',
      '인디밴드',
    ],
  },
  {
    title: '뷰티',
    options: ['성형', '다이어트', '네일'],
  },
  {
    title: '게임',
    options: ['LCK', '닌텐도', 'PC 게임', '모바일 게임'],
  },
  {
    title: '스포츠',
    options: ['프로야구', '운동/헬스', 'F1'],
  },
  {
    title: '그 외',
    options: [
      '독서',
      '여행',
      '패션',
      '애니',
      '이성연애',
      'LGBTQ',
      '영화',
      '주식',
      '뜨개질',
      '장르소설',
      '드라마',
    ],
  },
];

export const INTERESTS_GROUPS = [
  { sectionTitle: '대학생활', items: [0] },
  { sectionTitle: '취미', items: [1, 2, 3, 4, 5] },
] as const;
