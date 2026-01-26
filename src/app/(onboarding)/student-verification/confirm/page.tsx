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
            <p>학번</p>
            <input />
          </InputWrapper>
          <InputWrapper>
            <p>학과</p>
            <input />
          </InputWrapper>
        </FormWrapper>
      </Content>
      <ButtonWrapper>
        <Button disabled={false} label="확인" />
      </ButtonWrapper>
    </Container>
  );
}
