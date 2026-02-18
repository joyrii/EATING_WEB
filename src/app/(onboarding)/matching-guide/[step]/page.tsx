import { redirect } from 'next/navigation';
import MatchingGuideStep1 from '@/components/matchingGuide/Step1';
import MatchingGuideStep2 from '@/components/matchingGuide/Step2';
import MatchingGuideStep3 from '@/components/matchingGuide/Step3';
import MatchingGuideStep4 from '@/components/matchingGuide/Step4';
import MatchingGuideStep5 from '@/components/matchingGuide/Step5';
import MatchingGuideStep6 from '@/components/matchingGuide/Step6';
import MatchingGuideStep7 from '@/components/matchingGuide/Step7';
import MatchingGuideStep8 from '@/components/matchingGuide/Step8';
import StepShell from '@/components/matchingGuide/Shell';

const TOTAL_STEPS = 8;
function getStepComponent(step: number) {
  switch (step) {
    case 1:
      return MatchingGuideStep1;
    case 2:
      return MatchingGuideStep2;
    case 3:
      return MatchingGuideStep3;
    case 4:
      return MatchingGuideStep4;
    case 5:
      return MatchingGuideStep5;
    case 6:
      return MatchingGuideStep6;
    case 7:
      return MatchingGuideStep7;
    case 8:
      return MatchingGuideStep8;
    default:
      return MatchingGuideStep1;
  }
}

export default async function MatchingGuideStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const stepNum = Number(step);

  if (!Number.isInteger(stepNum) || stepNum < 1 || stepNum > TOTAL_STEPS) {
    redirect('/home');
  }

  const StepComponent = getStepComponent(stepNum);

  return (
    <StepShell step={stepNum} totalSteps={TOTAL_STEPS}>
      <StepComponent />
    </StepShell>
  );
}
