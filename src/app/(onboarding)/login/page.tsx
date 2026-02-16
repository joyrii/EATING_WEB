'use client';

import styled from 'styled-components';
import localFont from 'next/font/local';
import { supabase } from '@/lib/supabase/client';

export default function Login() {
  async function kakaoLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <MainContainer>
      <LogoContainer>
        <LogoText>잇팅</LogoText>
        <LogoCharacter alt="logo-character" />
      </LogoContainer>
      <TitleText>매칭으로 친구 사귀고 다같이 모여 할인 받자</TitleText>
      <KakaoLoginButton onClick={kakaoLogin}>
        <KakaoLogo alt="kakao-logo" />
        <KaKaoLoginButtonText>카카오 로그인</KaKaoLoginButtonText>
      </KakaoLoginButton>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-inline: 51px;
  align-items: center;
  justify-content: center;
`;

const LogoFont = localFont({
  src: '../../fonts/Hakgyoansim-Dunggeunmiso-OTF-R.otf',
  weight: '400',
});

const LogoText = styled.h1`
  font-size: 65px;
  font-weight: 400;
  color: #ff5900;
`;

const LogoCharacter = styled.img.attrs({
  src: '/svgs/home/eating-logo-character.svg',
  width: 80,
  height: 90,
})`
  margin-left: 4px;
`;

const LogoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-family: ${LogoFont.style.fontFamily};
`;

const TitleText = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: #3d3d3d;
  letter-spacing: -0.01px;
  margin-top: 7px;
  text-align: center;
`;

const KakaoLogo = styled.img.attrs({
  src: '/svgs/home/kakao-logo.svg',
  width: 18,
  height: 18,
})``;

const KakaoLoginButton = styled.button`
  margin-top: 95px;
  width: 300px;
  height: 45px;
  background-color: #fee500;
  border: none;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  margin-bottom: 50px;
`;

const KaKaoLoginButtonText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 auto;
`;
