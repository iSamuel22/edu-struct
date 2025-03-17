
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const ResourcesForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Recursos e Infraestrutura" 
      isActive={currentStep === 7}
      description="Equipamentos, materiais e espaços necessários."
    >
      <div className="form-section">
        <label htmlFor="resources" className="input-label">Recursos e Infraestrutura</label>
        <textarea
          id="resources"
          className="input-field min-h-[200px]"
          value={plan.data.resources}
          onChange={(e) => updateField('data.resources', e.target.value)}
          placeholder="Descreva os recursos e infraestrutura necessários..."
        ></textarea>
      </div>
    </FormStepWrapper>
  );
};

export default ResourcesForm;
