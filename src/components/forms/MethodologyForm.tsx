
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const MethodologyForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Procedimentos Metodológicos" 
      isActive={currentStep === 6}
      description="Métodos e estratégias de ensino."
    >
      <div className="form-section">
        <label htmlFor="methodology" className="input-label">Procedimentos Metodológicos</label>
        <textarea
          id="methodology"
          className="input-field min-h-[200px]"
          value={plan.data.methodology}
          onChange={(e) => updateField('data.methodology', e.target.value)}
          placeholder="Descreva os procedimentos metodológicos..."
        ></textarea>
      </div>
    </FormStepWrapper>
  );
};

export default MethodologyForm;
