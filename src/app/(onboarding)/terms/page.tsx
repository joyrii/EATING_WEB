'use client';

import TermsItem from '@/components/terms/TermsItem';
import { useState } from 'react';
import { AgreeButton, AgreeButtonText, Title, Page } from './style';
import { useMemo } from 'react';

// 필수 약관 키 목록
const REQUIRED_TERMS = ['term1', 'term2', 'term3', 'term4'] as const;
type RequiredTermKey = (typeof REQUIRED_TERMS)[number];

export default function TermsIndex() {
  const [terms, setTerms] = useState({
    term1: false, // 필수
    term2: false, // 필수
    term3: false, // 필수
    term4: false, // 필수
    term5: false, // 선택
  });

  // 전체 동의 체크 여부
  const termAllChecked = useMemo(() => {
    return Object.values(terms).every(Boolean);
  }, [terms]);

  // 필수 약관 동의 체크 여부
  const requiredTermsChecked = useMemo(() => {
    return REQUIRED_TERMS.every((key: RequiredTermKey) => terms[key]);
  }, [terms]);

  // 전체 약관 토글 함수
  const handleAllToggle = () => {
    const next = !termAllChecked;
    setTerms({
      term1: next,
      term2: next,
      term3: next,
      term4: next,
      term5: next,
    });
  };

  // 개별 약관 토글 함수
  const termToggle = (key: keyof typeof terms) => {
    setTerms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
        <TermsItem
          id="term1"
          label="[필수] 만 14세 이상입니다."
          checked={terms.term1}
          handler={() => termToggle('term1')}
        />
        <TermsItem
          id="term2"
          label="[필수] 서비스 이용약관 동의"
          checked={terms.term2}
          handler={() => termToggle('term2')}
          detailHref="/terms/service"
        />
        <TermsItem
          id="term3"
          label="[필수] 개인정보 수집 및 이용 동의"
          checked={terms.term3}
          handler={() => termToggle('term3')}
          detailHref="/terms/privacy"
        />
        <TermsItem
          id="term4"
          label="[필수] 개인정보 제3자 제공 동의"
          checked={terms.term4}
          handler={() => termToggle('term4')}
          detailHref="/terms/thirdParty"
        />
        <TermsItem
          id="term5"
          label="[선택] 마케팅 정보 수신 동의"
          checked={terms.term5}
          handler={() => termToggle('term5')}
          detailHref="/terms/marketing"
        />
      </div>
      <div style={{ marginTop: 'auto', marginBottom: 45 }}>
        <AgreeButton disabled={!requiredTermsChecked}>
          <AgreeButtonText>동의하기</AgreeButtonText>
        </AgreeButton>
      </div>
    </Page>
  );
}
