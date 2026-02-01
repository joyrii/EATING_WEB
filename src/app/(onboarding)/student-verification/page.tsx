'use client';

import { Container, TextWrapper } from './style';
import { useId, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Button from '@/components/BaseButton';

type Option = 'FRESHMAN' | 'ENROLLED';

function VerificationOption() {
  const option = useId();
  const [value, setValue] = useState<Option>();
  const router = useRouter();

  return (
    <Group role="radiogroup" aria-label="학생 구분">
      <HiddenRadio
        type="radio"
        id={`${option}-enrolled`}
        name="student-option"
        value="ENROLLED"
        checked={value === 'ENROLLED'}
        onChange={() => setValue('ENROLLED')}
      />
      <OptionLabel
        htmlFor={`${option}-enrolled`}
        $selected={value === 'ENROLLED'}
      >
        재학생
        <OptionSubLabel>모바일 학생증 캡쳐본</OptionSubLabel>
      </OptionLabel>
      <HiddenRadio
        type="radio"
        id={`${option}-freshman`}
        name="student-option"
        value="FRESHMAN"
        checked={value === 'FRESHMAN'}
        onChange={() => setValue('FRESHMAN')}
      />
      <OptionLabel
        htmlFor={`${option}-freshman`}
        $selected={value === 'FRESHMAN'}
      >
        신입생
        <OptionSubLabel>합격 증명서 캡쳐본</OptionSubLabel>
      </OptionLabel>
      <div style={{ position: 'fixed', bottom: 45, left: 23, right: 23 }}>
        <Button
          disabled={!value}
          label="동의하기"
          onClick={() => {
            if (value === 'FRESHMAN') {
              router.push('/student-verification/freshman');
            } else if (value === 'ENROLLED') {
              router.push('/student-verification/enrolled');
            }
          }}
        />
      </div>
    </Group>
  );
}

export default function StudentVerification() {
  return (
    <Container>
      <TextWrapper>
        <div
          style={{ height: 36, display: 'flex', justifyContent: 'center' }}
        />
        <h1>이대생 신원 인증을 시작합니다!</h1>
        <p>인증할 수 있는 수단을 선택해주세요.</p>
      </TextWrapper>
      <OptionContainer>
        <VerificationOption />
      </OptionContainer>
    </Container>
  );
}

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 130px;
`;

const OptionLabel = styled.label<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 20px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 18px;

  border: 1px solid ${({ $selected }) => ($selected ? '#FF7A33' : '#D6D6D6')};
  background-color: ${({ $selected }) =>
    $selected ? '#FFDECC' : 'transparent'};
`;

const OptionSubLabel = styled.span`
  font-size: 12px;
  color: #3d3d3d;
`;
