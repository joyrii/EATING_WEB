import {
  TextWrapper,
  StepText,
  TitleText,
  SubText,
} from '@/app/(onboarding)/onboarding/style';
import { DateBox } from '../style';
import TimeGrid from '@/components/application/TimeGrid';

export default function Schedule() {
  return (
    <div>
      <TextWrapper>
        <StepText>01</StepText>
        <TitleText>매칭 가능한 일정을 알려주세요.</TitleText>
        <SubText>
          꼭 나갈 수 있는 시간만 스크롤해서 선택해주세요!
          <br />
          <span>최대 2개</span>의 방이 생성될 수 있어요
        </SubText>
      </TextWrapper>
      <DateBox>1월 12일 ~ 1월 18일</DateBox>
      <TimeGrid />
    </div>
  );
}
