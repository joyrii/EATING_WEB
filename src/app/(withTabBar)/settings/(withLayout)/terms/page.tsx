'use client';

import { useEffect, useState } from 'react';
import { Section, SectionItem, SectionTitle } from '../../style';
import { getTerms } from '@/api/terms';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyTerms() {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const terms = await getTerms();
        setTerms(terms);
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    })();
  }, []);

  return (
    <>
      <SectionTitle>이용약관</SectionTitle>
      <Section style={{ marginTop: '24px' }}>
        {terms.map((term) => (
          <Link href={term.url} key={term.id}>
            <SectionItem>{term.title}</SectionItem>
          </Link>
        ))}
      </Section>
    </>
  );
}
