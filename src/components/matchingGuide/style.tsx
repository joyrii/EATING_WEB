import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  min-height: 0;
  overflow: hidden;
`;

export const Header = styled.div`
  width: 100%;
  padding-top: clamp(16px, 4vh, 30px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 30px;
`;

export const Text = styled.h1`
  font-size: 20px;
  font-weight: 500;
  text-align: center;
`;

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  transform: translateY(calc((43px + 56px) / 2));
`;

export const Content = styled.img<{ $width?: string }>`
  display: block;
  width: ${({ $width }) => $width ?? '80vw'};
  height: 100%;
  object-fit: contain;
  object-position: top center;
`;

export const SubText = styled.p`
  font-family: var(--font-ownglyph);
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  color: #707070;
`;
