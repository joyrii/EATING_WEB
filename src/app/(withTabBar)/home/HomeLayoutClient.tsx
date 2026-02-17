'use client';

import { MatchingContext } from './context';
import { MatchingStatus } from '@/constants/MATCHING';
import { useState, useEffect } from 'react';
import { getMatchingSectionText } from '@/constants/MATCHING';
import styled from 'styled-components';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { api } from '@/api/axios-client';
import { getOnboardingStatus, getMe } from '@/api/home';
import { useUser } from '@/context/userContext';

type MatchingStatusRes = {
  has_applied: boolean;
  round_id?: string;
  week_start?: string | null; // "YYYY-MM-DD" (월요일)
  week_end?: string | null; // "YYYY-MM-DD" (일요일)
};

const KST_OFFSET_MIN = 9 * 60;

function kstToUtcDate(y: number, m: number, d: number, hh = 0, mm = 0) {
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - KST_OFFSET_MIN * 60 * 1000;
  return new Date(utcMs);
}

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return { y, m, d };
}

function atKstFromWeekStart(
  weekStart: string,
  addDays: number,
  hh: number,
  mm: number,
) {
  const { y, m, d } = parseYmd(weekStart);

  // weekStart의 KST 00:00을 UTC Date로
  const base = kstToUtcDate(y, m, d, 0, 0);

  // addDays 만큼 이동
  const moved = new Date(base.getTime() + addDays * 24 * 60 * 60 * 1000);

  // moved를 KST 날짜로 환산해서 그 날짜의 hh:mm(KST)을 다시 UTC Date로 생성
  const movedKst = new Date(moved.getTime() + KST_OFFSET_MIN * 60 * 1000);
  const ny = movedKst.getUTCFullYear();
  const nm = movedKst.getUTCMonth() + 1;
  const nd = movedKst.getUTCDate();

  return kstToUtcDate(ny, nm, nd, hh, mm);
}

function calcUiStatus(ms: MatchingStatusRes, now = new Date()): MatchingStatus {
  if (!ms.round_id || !ms.week_start) return 'completed';

  // 금요일 17:00 = 월요일 + 4일 + 17:00
  const fri17 = atKstFromWeekStart(ms.week_start, 4, 17, 0);

  if (now >= fri17) return 'completed';
  return ms.has_applied ? 'inProgress' : 'before';
}

export default function HomeLayoutClient({
  children,
  banners,
}: {
  banners: any[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // 사용자 정보
  const { me } = useUser();
  const name = me?.name ?? '회원';
  const onboardingStep = me?.onboarding_step ?? null;
  // 매칭 상태
  const [currentStatus, setCurrentStatus] = useState<MatchingStatus>('before');
  const text = getMatchingSectionText(currentStatus, name);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const load = async () => {
      try {
        const [me, step, match] = await Promise.all([
          getMe(),
          getOnboardingStatus(),
          api.get<MatchingStatusRes>('/matching/status').then((r) => r.data),
        ]);

        setCurrentStatus(calcUiStatus(match));

        setReady(true);

        // 다음 전환 시각 예약
        if (match.week_start) {
          const now = new Date();
          const fri17 = atKstFromWeekStart(match.week_start, 4, 17, 0);
          const nextMon0 = atKstFromWeekStart(match.week_start, 7, 0, 0);
          const next = now < fri17 ? fri17 : now < nextMon0 ? nextMon0 : null;

          if (next) {
            const delay = Math.max(0, next.getTime() - now.getTime());
            timer = setTimeout(() => load(), delay + 200);
          }
        }
      } catch (e) {
        console.error('Failed to init home', e);
        setReady(true);
      }
    };

    load();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const banner = banners[0];

  if (!ready)
    return <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }} />;

  return (
    <MatchingContext.Provider value={{ currentStatus, setCurrentStatus }}>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header $variant="logo">
          <HeaderText>잇팅</HeaderText>
          <LogoCharacter alt="logo-character" />
        </Header>
        <Body>
          <TipBanner>
            <TipBannerTextWrapper>
              <TipMainText>{banner.title}</TipMainText>
              <TipSubText>{banner.subtitle}</TipSubText>
            </TipBannerTextWrapper>
            <TipBannerImage
              src={`/images/${banner.image_url}`}
              alt="banner-character"
              width={80}
            />
          </TipBanner>
          <MatchingSection>
            <MatchingText>
              <SectionTitle>{text.title}</SectionTitle>
              <MatchingDescription $currentStatus={currentStatus}>
                {text.description}
              </MatchingDescription>
            </MatchingText>
            <MatchingButtonArea $currentStatus={currentStatus}>
              <MatchingButton
                onClick={() => {
                  if (
                    currentStatus === 'before' ||
                    currentStatus === 'completed'
                  ) {
                    if (onboardingStep === 'completed')
                      router.push('/application/schedule');
                    else router.push('/onboarding/mbti');
                  }
                }}
                $currentStatus={currentStatus}
              >
                매칭 신청하러 가기
              </MatchingButton>
            </MatchingButtonArea>
          </MatchingSection>
          {children}
        </Body>
      </div>
    </MatchingContext.Provider>
  );
}

// 헤더
const HeaderFont = localFont({
  src: '../../fonts/Hakgyoansim-Dunggeunmiso-OTF-R.otf',
  weight: '400',
});

const Header = styled.header<{ $variant: 'logo' | 'title' }>`
  width: 100%;
  background-color: #fafafa;
  font-family: ${HeaderFont.style.fontFamily};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-block: 8px;
  padding-left: 24px;
  position: sticky;
  top: 0;

  ${({ $variant }) =>
    $variant === 'title'
      ? `justify-content: space-between;
      padding-block: 15px;
      padding-right: 24px;`
      : null}
`;

const HeaderText = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 36px;
  color: #ff5900;
`;

const LogoCharacter = styled.img.attrs({
  src: '/svgs/home/eating-logo-character.svg',
  width: 40,
  height: 44,
})`
  margin-left: 4px;
`;

const LogoTitle = styled.img.attrs({
  src: '/svgs/home/eating-logo-title.svg',
  width: 106,
  height: 28,
})`
  margin-block: 7px;
`;

// 팁 배너
const TipBanner = styled.button`
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 17px;
  margin-top: 15px;
`;

const TipBannerTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TipMainText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #3d3d3d;
  text-align: left;
`;

const TipSubText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #575757;
  text-align: left;
`;

const TipBannerImage = styled.img`
  margin-right: 5px;
`;

// 바디
const Body = styled.main`
  padding-inline: 27px;
`;

// 매칭 섹션
const MatchingSection = styled.div`
  margin-top: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px 20px;
  border: 1px solid #f0f0f0;
`;

const MatchingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 21px;
  font-weight: 600;
  line-height: 150%;
  color: #232323;
  span {
    color: #ff5900;
  }
`;

const MatchingDescription = styled.p<{ $currentStatus?: string }>`
  font-size: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '14px' : '10px'};
  font-weight: 400;
  line-height: 145%;
  color: #a3a3a3;
  letter-spacing: -0.01em;
`;

const MatchingButtonArea = styled.div<{ $currentStatus?: string }>`
  margin-top: ${({ $currentStatus }) =>
    $currentStatus === 'completed' ? '20px' : '45px'};
  display: flex;
  justify-content: flex-end;
`;

const MatchingButton = styled.button<{ $currentStatus?: string }>`
  width: 170px;
  height: 50px;
  border-radius: 10px;
  background-color: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '#F0F0F0' : '#ff5900'};
  color: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '#d6d6d6' : '#ffffff'};
  font-size: 16px;
  font-weight: 700;
  line-height: 145%;
  border: none;
`;
