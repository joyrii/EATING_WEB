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
`;

export const Character = styled.img`
  width: 100px;
  height: 80px;
  z-index: 1;
  position: absolute;
  left: 22px;
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
  right: 24px;
`;
