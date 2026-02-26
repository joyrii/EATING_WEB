import styled from 'styled-components';

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: auto 1fr 40px;
  align-items: center;
  padding-left: 10px;
  padding-block: 15px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
`;

export const BackButton = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
`;

export const HeaderText = styled.h1`
  justify-self: center;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

export const ListItem = styled.button`
  border: none;
  background-color: transparent;
  padding-block: 22px;
  padding-left: 33px;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  color: #232323;
`;

export const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative;
  width: 100%;
`;

export const Character = styled.img`
  width: 100px;
  height: 80px;
  z-index: 1;
  position: absolute;
  left: calc(50% - 160px);
`;

export const DescriptionText = styled.p`
  width: 250px;
  font-size: 12px;
  color: #707070;
  text-align: center;
  background-color: #fbfbfb;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding: 10px 15px;
  position: absolute;
  right: calc(50% - 160px);
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #232323;
  margin-bottom: 2px;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #707070;
`;

export const MatchingList = styled.div`
  margin-top: 27px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-inline: 24px;
  padding-bottom: 50px;
`;

export const UserGrid = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin: 45px auto 0;
  max-width: calc(2 * 105px + 18px);
`;

export const SubmitButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  background-color: #ff5900;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 0;
  font-size: 16px;
  font-weight: 700;
`;
