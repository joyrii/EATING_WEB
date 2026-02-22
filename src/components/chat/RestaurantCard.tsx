import styled from 'styled-components';
import { RestaurantPayload } from './ChatMessage';

type Props = {
  payload: RestaurantPayload;
  onClick?: (payload: RestaurantPayload) => void;
};

export default function RestaurantCard({
  payload,
  onClick,
  width,
}: Props & { width?: string }) {
  return (
    <Container onClick={() => onClick?.(payload)} $width={width}>
      <Thumbnail src={payload.imageUrl} alt={payload.name} />

      <Content>
        <CategoryChip>{payload.category}</CategoryChip>
        <Title>{payload.name}</Title>

        <Sub>
          <span>혜택</span>
          {payload.benefit}
        </Sub>

        <Sub>
          <span>메뉴</span>
          {payload.menu}
        </Sub>
      </Content>

      <Arrow>
        <img src="/svgs/chat/chevron-right.svg" alt="arrow" />
      </Arrow>
    </Container>
  );
}

const Container = styled.div<{ $width?: string }>`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: #ffffff;
  border-radius: 10px;
  width: ${(props) => (props.$width ? props.$width : '100%')};
  border: 1px solid #f0f0f0;
`;

const Thumbnail = styled.img`
  width: 87px;
  height: 87px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const CategoryChip = styled.div`
  width: fit-content;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 30px;
  font-size: 8px;
  font-weight: 500;
  color: #b0afb2;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13px;
  flex-grow: 1;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #3d3d3d;
  margin: 5px 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sub = styled.p`
  font-size: 10px;
  color: #8a8a8a;

  span {
    color: #d6d6d6;
    margin-right: 6px;
  }
`;

const Arrow = styled.div`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
