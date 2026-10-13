import React, { useReducer, useState } from 'react';
import { Steps, Alert } from 'antd';
import { steps } from '../../steps';
import { wizardReducer, initialState } from '../../reducer';
import { StepPanel } from './StepPanel';

interface OnboardingWizardProps {
  fhirBaseURL: string; 
}

export const OnboardingWizard = (props: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStepConfig = steps[currentStep];

  const handleNext = async (drafts: unknown[]) => {}

  return (
    <div>
      <Steps
        current={currentStep}
        items={steps.map((s) => ({ title: s.title }))}
        style={{ padding: '1rem' }}
      />
      {error && <Alert type="error" message={error} style={{ marginTop: 16 }} />}

      <div>
        <StepPanel
          key={currentStepConfig.key} 
          stepConfig={currentStepConfig}
          commonProps={{
            fhirBaseURL: props.fhirBaseURL
          }}
          onNext={handleNext}
          onBack={() => setCurrentStep((s) => Math.max(0, s - 1))}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
          submitting={submitting}
        />
      </div>
    </div>
  );
};
