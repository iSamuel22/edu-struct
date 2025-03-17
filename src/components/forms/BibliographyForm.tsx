
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const BibliographyForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Bibliografia" 
      isActive={currentStep === 10}
      description="Referências bibliográficas básicas e complementares."
    >
      <div className="form-section">
        <div className="space-y-4">
          <div>
            <label htmlFor="basic-bibliography" className="input-label">Bibliografia Básica</label>
            <textarea
              id="basic-bibliography"
              className="input-field min-h-[150px]"
              value={plan.data.bibliography.basic}
              onChange={(e) => updateField('data.bibliography.basic', e.target.value)}
              placeholder="Liste as referências bibliográficas básicas..."
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="complementary-bibliography" className="input-label">Bibliografia Complementar</label>
            <textarea
              id="complementary-bibliography"
              className="input-field min-h-[150px]"
              value={plan.data.bibliography.complementary}
              onChange={(e) => updateField('data.bibliography.complementary', e.target.value)}
              placeholder="Liste as referências bibliográficas complementares..."
            ></textarea>
          </div>
        </div>
      </div>
    </FormStepWrapper>
  );
};

export default BibliographyForm;
