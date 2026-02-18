'use client';

import styled from 'styled-components';
import TermsItem from '@/components/terms/TermsItem';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import Button from '@/components/BaseButton';
import { useRouter } from 'next/navigation';
import { agreeToTerms, getTerms } from '@/api/terms';
import toast from 'react-hot-toast';

// 약관 목록
const TERM_DEPS = [
  {
    id: 'term1',
    title: '만 14세 이상입니다.',
    is_required: true,
    url: null,
  },
] as const;

export default function TermsIndex() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const [serverTerms, setServerTerms] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 서버 데이터 호출
  useEffect(() => {
    (async () => {
      const data = await getTerms();
      console.log('약관 데이터:', data);
      setServerTerms(data);
      setReady(true);
    })();
  }, []);

  // 서버에서 받은 약관과 기본 약관을 병합하여 ID를 보장
  const mergedTerms = useMemo(() => {
    const serverTermsWithId = serverTerms.map((term) => ({
      id: term.id,
      key: term.id,
      label: term.title,
      required: term.is_required,
      detailHref: term.url,
    }));
    const defaultTermsWithId = TERM_DEPS.map((term) => ({
      id: term.id,
      key: term.id,
      label: term.title,
      required: term.is_required,
      detailHref: term.url,
    }));
    const allTerms = [...defaultTermsWithId, ...serverTermsWithId];
    const uniqueTerms = allTerms.reduce(
      (acc, term) => {
        if (!acc.some((t) => t.id === term.id)) {
          acc.push(term);
        }
        return acc;
      },
      [] as typeof serverTermsWithId,
    );
    return uniqueTerms;
  }, [serverTerms]);

  // 약관 ID별 체크 상태 관리
  const [checkedById, setCheckedById] = useState<Record<string, boolean>>({});

  // 약관 ID들을 문자열로 병합하여 변경 감지
  const mergedIdsKey = useMemo(
    () => mergedTerms.map((term) => term.id).join(','),
    [mergedTerms],
  );

  // 약관 목록이 변경될 때마다 체크 상태 초기화
  useEffect(() => {
    setCheckedById((prev) => {
      const updated: Record<string, boolean> = {};
      mergedTerms.forEach((term) => {
        updated[term.id] = prev[term.id] ?? false;
      });
      return updated;
    });
  }, [mergedIdsKey, mergedTerms]);

  // 전체 동의 체크 여부
  const termAllChecked = useMemo(
    () => mergedTerms.every((term) => checkedById[term.id]),
    [checkedById, mergedTerms],
  );

  // 필수 약관 동의 체크 여부
  const requiredTermsChecked = useMemo(
    () =>
      mergedTerms
        .filter((term) => term.required)
        .every((term) => checkedById[term.id]),
    [checkedById, mergedTerms],
  );

  // 단일 약관 토글
  const toggle = (id: string) => {
    setCheckedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 전체 약관 토글
  const handleAllToggle = () => {
    const next = !termAllChecked;
    const updated: Record<string, boolean> = {};
    mergedTerms.forEach((t) => (updated[t.id] = next));
    setCheckedById(updated);
  };

  // 약관 동의 제출
  const onAgree = async () => {
    if (!requiredTermsChecked) {
      toast.error('필수 약관에 모두 동의해 주세요.');
      return;
    }

    // 서버로 보낼 값만 추출
    const termIds = mergedTerms
      .filter((term) => term.key !== 'term1')
      .filter((term) => checkedById[term.id])
      .map((term) => term.id);

    try {
      setIsSubmitting(true);
      console.log('동의한 약관 ID:', termIds);
      const data = await agreeToTerms(termIds);
      router.replace('/student-verification');
    } catch (error) {
      console.error('약관 동의 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready)
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );

  return (
    <Page>
      <div>
        <Title>
          잇팅 이용약관에
          <br />
          동의해 주세요
        </Title>
      </div>
      <div style={{ marginTop: 50 }}>
        <TermsItem
          id="termAll"
          label="전체 동의"
          checked={termAllChecked}
          handler={() => {
            handleAllToggle();
          }}
        />
        {mergedTerms.map((term) => (
          <TermsItem
            key={term.id}
            id={term.id}
            label={
              term.required ? `[필수] ${term.label}` : `[선택] ${term.label}`
            }
            checked={!!checkedById[term.id]}
            handler={() => {
              toggle(term.id);
            }}
            detailHref={term.detailHref}
          />
        ))}
      </div>
      <div style={{ marginTop: 'auto', marginBottom: 45 }}>
        <Button
          disabled={isSubmitting}
          label={isSubmitting ? '처리 중...' : '동의하기'}
          onClick={onAgree}
        />
      </div>
    </Page>
  );
}

const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  padding-inline: 25px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  white-space: pre-line;
`;

// loading spinner
const LoadingWrapper = styled.div`
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #ff5900;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
