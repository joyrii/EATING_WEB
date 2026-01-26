import {
  ButtonWrapper,
  Container,
  Content,
  FormWrapper,
  InputWrapper,
  TextWrapper,
} from '../style';
import Button from '@/components/BaseButton';

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
