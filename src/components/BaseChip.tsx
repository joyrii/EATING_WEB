import styled from 'styled-components';

const BaseChip = ({ label }: { label: string }) => {
  return <Chip>{label}</Chip>;
};

export default BaseChip;

const Chip = styled.div`
  display: inline-block;
  padding: 6px 10px;
  background-color: #ffffff;
  border-radius: 30px;
  border: 1px solid #bdbdbd;
  font-size: 10px;
  font-weight: 500;
  color: #707070;
`;
