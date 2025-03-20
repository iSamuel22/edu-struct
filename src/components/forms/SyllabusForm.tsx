
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const SyllabusForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Ementa" 
      isActive={currentStep === 1}
      description="Descrição sucinta dos tópicos a serem abordados."
    >
      <div className="form-section">
        <label htmlFor="syllabus" className="input-label">Ementa do Componente Curricular</label>
        <textarea
          id="syllabus"
          className="input-field min-h-[200px]"
          value={plan.data.syllabus}
          onChange={(e) => updateField('data.syllabus', e.target.value)}
          placeholder="Descreva a ementa do componente curricular..."
        ></textarea>
      </div>
    </FormStepWrapper>
  );
};

export default SyllabusForm;
