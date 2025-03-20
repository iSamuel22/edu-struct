
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';
import { PlusCircle, Trash2 } from 'lucide-react';

const VisitsForm: React.FC = () => {
  const { currentStep, plan, updateField, addItemToArray, removeItemFromArray } = usePlan();

  return (
    <FormStepWrapper 
      title="Visitas Técnicas e Aulas Práticas" 
      isActive={currentStep === 8}
      description="Planejamento de visitas e aulas em campo."
    >
      <div className="form-section">
        {plan.data.visits.map((visit, index) => (
          <div key={index} className="mb-6 pb-6 border-b border-border last:border-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Visita #{index + 1}</h3>
              {plan.data.visits.length > 1 && (
                <button
                  onClick={() => removeItemFromArray('data.visits', index)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label="Remover visita"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor={`visit-location-${index}`} className="input-label">Local</label>
                <input
                  type="text"
                  id={`visit-location-${index}`}
                  className="input-field"
                  value={visit.location}
                  onChange={(e) => {
                    const updatedVisits = [...plan.data.visits];
                    updatedVisits[index].location = e.target.value;
                    updateField('data.visits', updatedVisits);
                  }}
                  placeholder="Local da visita ou aula prática"
                />
              </div>
              
              <div>
                <label htmlFor={`visit-date-${index}`} className="input-label">Data Prevista</label>
                <input
                  type="text"
                  id={`visit-date-${index}`}
                  className="input-field"
                  value={visit.date}
                  onChange={(e) => {
                    const updatedVisits = [...plan.data.visits];
                    updatedVisits[index].date = e.target.value;
                    updateField('data.visits', updatedVisits);
                  }}
                  placeholder="Data prevista (ex: 10/05/2023 ou Maio/2023)"
                />
              </div>
              
              <div>
                <label htmlFor={`visit-materials-${index}`} className="input-label">Materiais Necessários</label>
                <textarea
                  id={`visit-materials-${index}`}
                  className="input-field"
                  value={visit.materials}
                  onChange={(e) => {
                    const updatedVisits = [...plan.data.visits];
                    updatedVisits[index].materials = e.target.value;
                    updateField('data.visits', updatedVisits);
                  }}
                  placeholder="Descreva os materiais necessários para a visita..."
                ></textarea>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={() => addItemToArray('data.visits', {
            location: "",
            date: "",
            materials: ""
          })}
          className="btn btn-outline flex items-center gap-2 mt-4"
          aria-label="Adicionar visita"
        >
          <PlusCircle size={16} />
          <span>Adicionar Visita</span>
        </button>
      </div>
    </FormStepWrapper>
  );
};

export default VisitsForm;
