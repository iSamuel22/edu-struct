
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const ObjectivesForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Objetivos do Componente Curricular" 
      isActive={currentStep === 2}
      description="Definição dos objetivos gerais e específicos."
    >
      <div className="form-section">
        <label htmlFor="objectives" className="input-label">Objetivos</label>
        <textarea
          id="objectives"
          className="input-field min-h-[200px]"
          value={plan.data.objectives}
          onChange={(e) => updateField('data.objectives', e.target.value)}
          placeholder="Descreva os objetivos gerais e específicos..."
        ></textarea>
      </div>
    </FormStepWrapper>
  );
};

export default ObjectivesForm;
