import styled from 'styled-components';
import GuideCard from '@/components/home/GuideCard';
import { Section, SectionTitle } from './style';
import { useEffect, useState } from 'react';
import { getGuide } from '@/api/home';
import { useRouter } from 'next/navigation';

export default function GuideSection() {
  const router = useRouter();
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getGuide();
      setGuides(res);
    })();
  }, []);

  return (
    <Section>
      <SectionTitle>잇팅 가이드</SectionTitle>
      <GuideScroll>
        {guides.map((guide) => (
          <GuideCard
            key={guide.id}
            title={guide.name}
            bg={guide.image_url}
            onClick={() => router.push(`${guide.link_url}`)}
          />
        ))}
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
