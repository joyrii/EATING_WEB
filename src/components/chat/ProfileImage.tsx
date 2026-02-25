import styled from 'styled-components';

type RoomProfileImageProps = {
  imageUrls: string[];
  size?: number;
};

export default function ProfileImage({
  imageUrls,
  size = 50,
}: RoomProfileImageProps) {
  const count = imageUrls.length;

  // 표시할 이미지 최대 4개까지
  const picked =
    count >= 4
      ? imageUrls.slice(0, 4)
      : count === 3
        ? imageUrls.slice(0, 3)
        : count === 2
          ? imageUrls.slice(0, 2)
          : imageUrls.slice(0, 1);

  // 케이스 결정
  const variant =
    count >= 4 ? 'four' : count === 3 ? 'three' : count === 2 ? 'two' : 'one';

  return (
    <ProfileImageWrapperWithPositions
      $size={size}
      $variant={variant}
      data-variant={variant}
    >
      {picked.map((src, index) => (
        <ProfileImg key={index} src={src} alt={`profile-${index}`} />
      ))}
    </ProfileImageWrapperWithPositions>
  );
}

const ProfileImageWrapper = styled.div<{ $size: number; $variant: string }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  position: relative;
`;

const ProfileImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #fcfcfc;
  box-sizing: border-box;
`;

const ProfileImageWrapperWithPositions = styled(ProfileImageWrapper)`
  &[data-variant='one'] ${ProfileImg} {
    width: 100%;
    height: 100%;
    position: relative;
  }

  &[data-variant='two'] ${ProfileImg} {
    position: absolute;
    width: 29px;
    height: 29px;
  }
  &[data-variant='two'] ${ProfileImg}:nth-child(1) {
    left: 0%;
    top: 0%;
    z-index: 1;
  }
  &[data-variant='two'] ${ProfileImg}:nth-child(2) {
    left: 40%;
    top: 40%;
    z-index: 2;
  }

  &[data-variant='three'] ${ProfileImg} {
    position: absolute;
    width: 24px;
    height: 24px;
  }
  &[data-variant='three'] ${ProfileImg}:nth-child(1) {
    left: 0%;
    top: 0%;
    z-index: 1;
  }
  &[data-variant='three'] ${ProfileImg}:nth-child(2) {
    left: 40%;
    top: 0%;
    z-index: 2;
  }
  &[data-variant='three'] ${ProfileImg}:nth-child(3) {
    left: 20%;
    top: 40%;
    z-index: 3;
  }

  &[data-variant='four'] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2px;
  }
  &[data-variant='four'] ${ProfileImg} {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;
