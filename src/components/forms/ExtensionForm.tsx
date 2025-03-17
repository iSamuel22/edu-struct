
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const ExtensionForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Atividades Curriculares de Extensão" 
      isActive={currentStep === 4}
      description="Informações sobre atividades de extensão."
    >
      <div className="form-section">
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={plan.data.extension.hasExtension}
              onChange={(e) => updateField('data.extension.hasExtension', e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Este componente curricular possui atividades de extensão</span>
          </label>
        </div>
        
        {plan.data.extension.hasExtension && (
          <div className="space-y-4">
            <div>
              <label htmlFor="extensionJustification" className="input-label">Justificativa</label>
              <textarea
                id="extensionJustification"
                className="input-field"
                value={plan.data.extension.justification}
                onChange={(e) => updateField('data.extension.justification', e.target.value)}
                placeholder="Justifique as atividades de extensão..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="extensionObjectives" className="input-label">Objetivos</label>
              <textarea
                id="extensionObjectives"
                className="input-field"
                value={plan.data.extension.objectives}
                onChange={(e) => updateField('data.extension.objectives', e.target.value)}
                placeholder="Descreva os objetivos das atividades de extensão..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="communityInvolvement" className="input-label">Envolvimento com a Comunidade</label>
              <textarea
                id="communityInvolvement"
                className="input-field"
                value={plan.data.extension.communityInvolvement}
                onChange={(e) => updateField('data.extension.communityInvolvement', e.target.value)}
                placeholder="Descreva como a comunidade será envolvida..."
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </FormStepWrapper>
  );
};

export default ExtensionForm;
