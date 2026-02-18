import styled from 'styled-components';
import GuideCard from '@/components/home/GuideCard';
import { Section, SectionTitle } from './style';
import { useRouter } from 'next/navigation';

export default function GuideSection() {
  const router = useRouter();

  return (
    <Section>
      <SectionTitle>잇팅 가이드</SectionTitle>
      <GuideScroll>
        <GuideCard
          title={'잇팅\n신청 과정에 대해\n알아봐요!'}
          bg="/svgs/home/guide-card-bg-1.svg"
          onClick={() => {
            router.push('/matching-guide/1');
          }}
        />
        <GuideCard
          title={'이대 메일 계정\n만드는 법에 대해\n알려드릴게요'}
          bg="/svgs/home/guide-card-bg-2.svg"
        />
      </GuideScroll>
    </Section>
  );
}

// 가이드 섹션
const GuideScroll = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 120px;
`;
