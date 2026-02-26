'use client';

import { useRouter } from 'next/navigation';
import {
  List,
  ListItem,
  DescriptionWrapper,
  Character,
  DescriptionText,
} from './style';

export default function Noshow() {
  const router = useRouter();

  return (
    <>
      <List>
        <ListItem onClick={() => router.push('/noshow/matching')}>
          노쇼한 사람이 있어요
        </ListItem>
        <ListItem onClick={() => router.push('/noshow/other')}>
          취지와 다른 목적으로 접근한 사람이 있어요
        </ListItem>
      </List>
      <DescriptionWrapper>
        <Character
          src="/svgs/feedback/feedback-character.svg"
          alt="신고 캐릭터"
        />
        <DescriptionText>
          신고 내용은 익명으로 처리되며,
          <br />
          신고자에게는 어떠한 영향도 없습니다
        </DescriptionText>
      </DescriptionWrapper>
    </>
  );
}
