import styled from 'styled-components';

interface UserItemProps {
  name: string;
  profileImage: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function UserItem({
  name,
  profileImage,
  selected = false,
  onClick,
}: UserItemProps & { selected?: boolean; onClick?: () => void }) {
  return (
    <UserItemContainer selected={selected} onClick={onClick}>
      <ProfileImage src={profileImage} alt="사용자 프로필 이미지" />
      <Username selected={selected}>{name}</Username>
    </UserItemContainer>
  );
}

const UserItemContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ selected }) => (selected ? '#ffeee5' : '#f8f8f8')};
  border-radius: 10px;
  padding: 10px 23px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 15px;
  object-fit: cover;
`;

const Username = styled.p<{ selected?: boolean }>`
  margin-top: 9px;
  font-size: 12px;
  color: ${({ selected }) => (selected ? '#ff5900' : '#232323')};
`;
