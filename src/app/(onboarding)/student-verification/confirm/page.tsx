import styled from 'styled-components';
import Button from '@/components/BaseButton';
import { Container, TextWrapper } from '../style';

function isTextInput(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    (el as HTMLElement).isContentEditable
  );
}

export default function StudentVerificationConfirm() {
  return (
    <Container>
      <Content>
        <TextWrapper>
          <h1>
            주연님!
            <br />
            정보가 맞는지 확인해주세요!
          </h1>
          <p>모바일 학생증과 정보가 동일해야해요</p>
        </TextWrapper>
        <FormWrapper>
          <InputWrapper>
            <label htmlFor="studentId">학번</label>
            <input id="studentId" name="studentId" />
          </InputWrapper>
          <InputWrapper>
            <label htmlFor="department">학과</label>
            <input id="department" name="department" />
          </InputWrapper>
        </FormWrapper>
      </Content>
      <ButtonWrapper>
        <Button disabled={false} label="확인" />
      </ButtonWrapper>
    </Container>
  );
}

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-bottom: 15px;
`;

const ButtonWrapper = styled.div`
  padding: 16px 0 45px;
  background: #fafafa;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 57px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  label {
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0;
  }

  input {
    width: 100%;
    height: 70px;
    border: 1px solid #d6d6d6;
    border-radius: 15px;
    padding: 23px 24px;
    font-size: 16px;
    font-weight: 500;
    line-height: 145%;
    letter-spacing: -0.01em;
  }
`;
