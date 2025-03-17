
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const JustificationForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Justificativa da Modalidade de Ensino" 
      isActive={currentStep === 3}
      description="Motivação para a escolha da modalidade de ensino."
    >
      <div className="form-section">
        <label htmlFor="justification" className="input-label">Justificativa</label>
        <textarea
          id="justification"
          className="input-field min-h-[200px]"
          value={plan.data.justification}
          onChange={(e) => updateField('data.justification', e.target.value)}
          placeholder="Descreva a justificativa da modalidade de ensino..."
        ></textarea>
      </div>
    </FormStepWrapper>
  );
};

export default JustificationForm;
