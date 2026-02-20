'use client';

import { MatchingContext } from './context';
import { MatchingStatus } from '@/constants/MATCHING';
import { useEffect, useMemo, useState } from 'react';
import { getMatchingSectionText } from '@/constants/MATCHING';
import styled from 'styled-components';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { getMatchingStatus } from '@/api/application';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';

const PRE_REGISTERED_END_AT_KST = '2026-02-23'; // 이 시각(KST 00:00) 이후 pre_registered 폐기

function kstMidnightToUtcDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, -9, 0)); // KST 00:00 -> UTC
}

function isPreFeatureEnabled(now = new Date()) {
  return now < kstMidnightToUtcDate(PRE_REGISTERED_END_AT_KST);
}

// week_start(KST 월요일 00:00) 기준으로 특정 요일/시각(KST)을 UTC Date로
function atKstFromWeekStart(
  weekStart: string,
  addDays: number,
  hh: number,
  mm: number,
) {
  const base = kstMidnightToUtcDate(weekStart); // weekStart KST 00:00
  const moved = new Date(base.getTime() + addDays * 24 * 60 * 60 * 1000);
  return new Date(moved.getTime() + (hh * 60 + mm) * 60 * 1000);
}

function calcUiStatus(params: {
  canApply: boolean;
  isPreRegistered: boolean;
  weekStart: string;
  now?: Date;
}): MatchingStatus {
  const { canApply, isPreRegistered, weekStart, now = new Date() } = params;

  // pre_registered는 첫 주차만 사용(이후 폐기)
  const effectivePre = isPreFeatureEnabled(now) ? isPreRegistered : false;

  // 일요일->월요일 자정(다음 주 월요일 00:00 KST) 되면 무조건 before (pre 없음)
  const nextMon0 = atKstFromWeekStart(weekStart, 7, 0, 0);
  if (now >= nextMon0) return 'before';

  // 금요일 17:00(KST) 이후 completed
  const fri17 = atKstFromWeekStart(weekStart, 4, 17, 0);
  if (now >= fri17) return 'completed';

  // 신청해서 can_apply=false면 inProgress
  if (!canApply) return 'inProgress';

  // 신청 가능하면: (첫 주만) 사전신청자면 pre_registered, 아니면 before
  return effectivePre ? 'pre_registered' : 'before';
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

  const { me } = useUser();
  const name = me?.name ?? '회원';
  const onboardingStep = me?.onboarding_step ?? null;
  const isPreRegistered = me?.is_pre_registered;

  const [currentStatus, setCurrentStatus] = useState<MatchingStatus>(
    isPreRegistered ? 'pre_registered' : 'before',
  );

  const isFirstPreInProgress =
    currentStatus === 'inProgress' &&
    !!me?.is_pre_registered &&
    isPreFeatureEnabled();

  const text = getMatchingSectionText(currentStatus, name, {
    isFirstPreInProgress,
  });

  console.log('canApply', currentStatus, {
    isPreRegistered,
    isFirstPreInProgress,
  });

  useEffect(() => {
    if (!me) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      try {
        const res = await getMatchingStatus();
        const weekStart: string | undefined = res.rounds?.[0]?.week_start;

        if (!weekStart) {
          setCurrentStatus('before');
          setReady(true);
          return;
        }

        const hasAppliedAnyRound = (res.rounds ?? []).some(
          (r: any) => r.has_applied === true,
        );

        const effectiveCanApply = !hasAppliedAnyRound;

        const now = new Date();
        const uiStatus = calcUiStatus({
          canApply: effectiveCanApply, // 매칭 신청 가능 여부
          isPreRegistered: !!me.is_pre_registered, // 사전 등록 여부
          weekStart, // 이번 라운드 시작
          now, // 현재 시각
        });

        setCurrentStatus(uiStatus);
        setReady(true);

        // 다음 전환 시각(금 17시 or 월 0시)으로 재계산 예약
        const fri17 = atKstFromWeekStart(weekStart, 4, 17, 0);
        const nextMon0 = atKstFromWeekStart(weekStart, 7, 0, 0);
        const next = now < fri17 ? fri17 : now < nextMon0 ? nextMon0 : null;

        if (next) {
          const delay = Math.max(0, next.getTime() - now.getTime());
          timer = setTimeout(() => run(), delay + 200);
        }
      } catch (e) {
        console.error('Failed to init home', e);
        setCurrentStatus('before');
        setReady(true);
      }
    };

    run();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [me]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session fetch error:', error);
        return;
      }

      console.log('session:', session);
      console.log('access_token:', session?.access_token);
      console.log('refresh_token:', session?.refresh_token);
      console.log('user:', session?.user);
    };

    checkSession();
  }, []);

  const banner = banners.find((b) => b.display_order === 1);

  if (!ready) return <LoadingSpinner />;

  return (
    <MatchingContext.Provider value={{ currentStatus, setCurrentStatus }}>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header $variant="logo">
          <HeaderText>잇팅</HeaderText>
          <LogoCharacter alt="logo-character" />
        </Header>
        <Body>
          {banner && (
            <TipBanner>
              <TipBannerTextWrapper>
                <TipMainText>{banner?.title}</TipMainText>
                <TipSubText>{banner?.subtitle}</TipSubText>
              </TipBannerTextWrapper>
              <TipBannerImage
                src={banner?.image_url}
                alt="banner-character"
                width={80}
              />
            </TipBanner>
          )}
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
                  if (currentStatus === 'pre_registered') {
                    router.push('/pre/schedule');
                    return;
                  }

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
                style={{
                  cursor:
                    currentStatus === 'inProgress' ? 'default' : 'pointer',
                }}
              >
                {currentStatus === 'pre_registered'
                  ? '사전 매칭 신청하러 가기'
                  : currentStatus === 'inProgress'
                    ? '매칭 진행 중...'
                    : '매칭 신청하러 가기'}
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
  margin-bottom: 20px;
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
  margin-top: 20px;
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
  width: ${({ $currentStatus }) =>
    $currentStatus === 'pre_registered' ? '225px' : '170px'};
  height: 50px;
  border-radius: 10px;
  background-color: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '#f0f0f0' : '#ff5900'};
  color: ${({ $currentStatus }) =>
    $currentStatus === 'inProgress' ? '#d6d6d6' : '#ffffff'};
  font-size: 16px;
  font-weight: 700;
  line-height: 145%;
  border: none;
`;
