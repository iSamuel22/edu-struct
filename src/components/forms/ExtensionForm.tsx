import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const ExtensionForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  const extensionTypes = [
    "Projetos como parte do currículo",
    "Programas como parte do currículo",
    "Prestação graciosa de serviços como parte do currículo",
    "Cursos e Oficinas como parte do currículo",
    "Eventos como parte do currículo"
  ];

  return (
    <FormStepWrapper 
      title="Atividades Curriculares de Extensão" 
      isActive={currentStep === 4}
      description="Informações sobre as atividades de extensão do componente curricular."
    >
      <div className="form-section space-y-6">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={plan.data.extension.hasExtension}
              onChange={(e) => updateField('data.extension.hasExtension', e.target.checked)}
              className="checkbox"
            />
            <span>Possui atividades de extensão?</span>
          </label>
        </div>

        {plan.data.extension.hasExtension && (
          <>
            <div>
              <label htmlFor="extension-type" className="input-label">Tipo de Atividade de Extensão</label>
              <select
                id="extension-type"
                className="input-field"
                value={plan.data.extension.type}
                onChange={(e) => updateField('data.extension.type', e.target.value)}
              >
                <option value="">Selecione o tipo de atividade</option>
                {extensionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="extension-summary" className="input-label">Resumo da Atividade</label>
              <textarea
                id="extension-summary"
                className="input-field min-h-[100px]"
                value={plan.data.extension.summary}
                onChange={(e) => updateField('data.extension.summary', e.target.value)}
                placeholder="Descreva brevemente a atividade de extensão"
              />
            </div>

            <div>
              <label htmlFor="extension-justification" className="input-label">Justificativa</label>
              <textarea
                id="extension-justification"
                className="input-field min-h-[100px]"
                value={plan.data.extension.justification}
                onChange={(e) => updateField('data.extension.justification', e.target.value)}
                placeholder="Justifique a importância desta atividade de extensão"
              />
            </div>

            <div>
              <label htmlFor="extension-objectives" className="input-label">Objetivos</label>
              <textarea
                id="extension-objectives"
                className="input-field min-h-[100px]"
                value={plan.data.extension.objectives}
                onChange={(e) => updateField('data.extension.objectives', e.target.value)}
                placeholder="Liste os objetivos da atividade de extensão"
              />
            </div>

            <div>
              <label htmlFor="extension-community" className="input-label">Envolvimento com a Comunidade</label>
              <textarea
                id="extension-community"
                className="input-field min-h-[100px]"
                value={plan.data.extension.communityInvolvement}
                onChange={(e) => updateField('data.extension.communityInvolvement', e.target.value)}
                placeholder="Descreva como a comunidade será envolvida nesta atividade"
              />
            </div>
          </>
        )}
      </div>
    </FormStepWrapper>
  );
};

export default ExtensionForm;
