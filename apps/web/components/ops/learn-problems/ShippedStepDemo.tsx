'use client';

import { useCallback, useState } from 'react';
import { LearnStepView } from '@/components/learn/LearnStepView';
import { Button } from '@/components/ui/Button';
import type { LearnStep } from '@/data/learn/types';
import { getDefaultResolvedLearningSettings } from '@/lib/learn/learning-preferences';
import { clearLearnModuleStepStorage } from '@/lib/learn/step-storage';

const OPS_MODULE_ID = 'ops-learn-problems-showcase';

interface ShippedStepDemoProps {
  step: LearnStep;
  previousStep?: LearnStep;
}

export function ShippedStepDemo({ step, previousStep }: ShippedStepDemoProps) {
  const [resetKey, setResetKey] = useState(0);
  const learningSettings = getDefaultResolvedLearningSettings();

  const handleReset = useCallback(() => {
    clearLearnModuleStepStorage(OPS_MODULE_ID);
    setResetKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 sm:p-6">
        <LearnStepView
          key={`${step.id}-${resetKey}`}
          step={step}
          moduleId={OPS_MODULE_ID}
          onComplete={() => {}}
          isActive
          isCompleted={false}
          previousStep={previousStep}
          learningSettings={learningSettings}
        />
      </div>
      <Button variant="secondary" onClick={handleReset}>
        Reset demo
      </Button>
    </div>
  );
}
