import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  background-color: #fafafa;
`;

export const Header = styled.header<{ $variant?: 'logo' | 'title' }>`
  width: 100%;
  background-color: #fafafa;
  font-family: var(--font-header);
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-block: 8px;
  padding-left: 24px;
  position: sticky;
  top: 0;
  z-index: 10;

  ${({ $variant }) =>
    $variant === 'title'
      ? `justify-content: space-between;
      padding-block: 15px;
      padding-right: 24px;`
      : null}
`;

export const HeaderText = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 36px;
  color: #ff5900;
`;

export const LogoCharacter = styled.img.attrs({
  src: '/svgs/home/eating-logo-character.svg',
  width: 40,
  height: 44,
})`
  margin-left: 4px;
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-inline: 24px;
  margin-top: 20px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #232323;
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-left: 24px;
  margin-top: 70px;
  padding-bottom: 150px;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #a3a3a3;
`;

export const Infos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Info = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-weight: 400;
  color: #707070;

  & > span {
    font-weight: 500;
  }
`;

export const VerificationChip = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0, 100, 62, 0.08);
  border-radius: 30px;
  color: #00643e;
  font-size: 8px;
  font-weight: 500;
  padding: 5px 8px;
  margin-left: 5px;
`;

export const VerificationMark = styled.img`
  width: 10px;
  height: 12px;
`;

export const Profile = styled.div`
  display: flex;
  gap: 20px;
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 10px;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ProfileNameWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

export const ProfileName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #575757;
`;

export const ProfileInfoText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #575757;
`;

export const ChangeInterest = styled.button`
  margin-top: 20px;
  width: fit-content;
  color: #575757;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  background: none;
  padding: 0;
`;

export const CustomerServiceCenter = styled.button`
  display: flex;
  align-items: center;
  background: #ffeee5;
  border: none;
  cursor: pointer;
  height: 80px;
  border-radius: 10px;
`;

export const CustomerServiceCenterText = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #ff5900;
  justify-content: center;
  width: 100%;
`;

export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SectionItem = styled.button`
  width: 100%;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  color: #a3a3a3;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 24px;
  cursor: pointer;
`;
