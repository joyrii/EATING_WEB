import styled from 'styled-components';

export const TimeGridContainer = styled.div`
  margin-top: 21px;
  margin-bottom: 100px;
`;

export const TimeGridWrapper = styled.div`
  display: grid;
  gap: 6px;
  user-select: none;
  touch-action: none;
`;

export const DayHeader = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #707070;
  line-height: 145%;
  text-align: center;
  letter-spacing: -0.01em;
`;

export const TimeLabel = styled.div`
  text-align: right;
  font-size: 10px;
  color: #d6d6d6;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
`;

export const TimeCell = styled.div<{ $active: boolean }>`
  height: 30px;
  border: 1px solid #d6d6d6;
  background-color: ${({ $active }) => ($active ? '#ff5900' : '#ffffff')};
`;

export const RestaurantListItemWrapper = styled.div<{ checked?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border: 1px solid ${({ checked }) => (checked ? '#ff5900' : '#f0f0f0')};
  border-radius: 10px;
  margin-bottom: 16px;
  width: 90%;
  background-color: #ffffff;
`;

export const RestaurantImage = styled.img`
  width: 87px;
  height: 87px;
  object-fit: cover;
  border-radius: 8px;
`;

export const RestaurantInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13px;
`;

export const CategoryChip = styled.div<{ checked?: boolean }>`
  width: fit-content;
  padding: 4px 8px;
  background-color: ${({ checked }) => (checked ? '#FFEEE5' : '#FCFCFC')};
  border-radius: 30px;
  font-size: 8px;
  font-weight: 500;
  color: ${({ checked }) => (checked ? '#FF5900' : '#B0AFB2')};
`;

export const RestaurantName = styled.h2<{ checked?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ checked }) => (checked ? '#FF5900' : '#3d3d3d')};
`;

export const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const RestaurantDetailText = styled.p<{ checked?: boolean }>`
  font-size: 10px;
  font-weight: 500;
  color: ${({ checked }) => (checked ? '#FFBAA5' : '#d6d6d6')};

  span {
    color: ${({ checked }) => (checked ? '#ff5900' : '#8a8a8a')};
    margin-left: 6px;
  }
`;

export const ClassChipStyle = styled.div<{ checked: boolean }>`
  width: 65px;
  height: 65px;
  border: 1px solid ${({ checked }) => (checked ? '#ff5900' : '#d6d6d6')};
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: ${({ checked }) => (checked ? '#ff5900' : '#8a8a8a')};
  background-color: ${({ checked }) => (checked ? '#FFDECC' : 'transparent')};
`;
