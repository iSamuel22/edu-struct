
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';
import { PlusCircle, Trash2 } from 'lucide-react';

const ContentForm: React.FC = () => {
  const { currentStep, plan, updateField, addItemToArray, removeItemFromArray } = usePlan();

  return (
    <FormStepWrapper 
      title="Conteúdo Programático" 
      isActive={currentStep === 5}
      description="Organização dos conteúdos por período."
    >
      <div className="form-section">
        {plan.data.content.byPeriod.map((period, index) => (
          <div key={index} className="mb-6 pb-6 border-b border-border last:border-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Período #{index + 1}</h3>
              {plan.data.content.byPeriod.length > 1 && (
                <button
                  onClick={() => removeItemFromArray('data.content.byPeriod', index)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label="Remover período"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor={`period-name-${index}`} className="input-label">Nome do Período</label>
                <input
                  type="text"
                  id={`period-name-${index}`}
                  className="input-field"
                  value={period.period}
                  onChange={(e) => {
                    const updatedPeriods = [...plan.data.content.byPeriod];
                    updatedPeriods[index].period = e.target.value;
                    updateField('data.content.byPeriod', updatedPeriods);
                  }}
                  placeholder="Ex: 1º Bimestre, Módulo 1, etc."
                />
              </div>
              
              <div>
                <label htmlFor={`period-content-${index}`} className="input-label">Conteúdo</label>
                <textarea
                  id={`period-content-${index}`}
                  className="input-field"
                  value={period.content}
                  onChange={(e) => {
                    const updatedPeriods = [...plan.data.content.byPeriod];
                    updatedPeriods[index].content = e.target.value;
                    updateField('data.content.byPeriod', updatedPeriods);
                  }}
                  placeholder="Descreva o conteúdo para este período..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor={`interdisciplinary-${index}`} className="input-label">Relações Interdisciplinares</label>
                <textarea
                  id={`interdisciplinary-${index}`}
                  className="input-field"
                  value={period.interdisciplinaryRelations}
                  onChange={(e) => {
                    const updatedPeriods = [...plan.data.content.byPeriod];
                    updatedPeriods[index].interdisciplinaryRelations = e.target.value;
                    updateField('data.content.byPeriod', updatedPeriods);
                  }}
                  placeholder="Descreva as relações com outras disciplinas..."
                ></textarea>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={() => addItemToArray('data.content.byPeriod', {
            period: `Período ${plan.data.content.byPeriod.length + 1}`,
            content: "",
            interdisciplinaryRelations: ""
          })}
          className="btn btn-outline flex items-center gap-2 mt-4"
          aria-label="Adicionar período"
        >
          <PlusCircle size={16} />
          <span>Adicionar Período</span>
        </button>
      </div>
    </FormStepWrapper>
  );
};

export default ContentForm;
