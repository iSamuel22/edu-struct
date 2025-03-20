
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const IdentificationForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
<<<<<<< HEAD
    <FormStepWrapper 
      title="Identificação do Componente Curricular" 
=======
    <FormStepWrapper
      title="Identificação do Componente Curricular"
>>>>>>> 188eb5d (commit)
      isActive={currentStep === 0}
      description="Informações básicas do componente curricular."
    >
      <div className="form-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
<<<<<<< HEAD
            <label htmlFor="courseName" className="input-label">Nome do Componente</label>
=======
            <label htmlFor="courseName" className="input-label">Componente Curricular</label>
>>>>>>> 188eb5d (commit)
            <input
              type="text"
              id="courseName"
              className="input-field"
              value={plan.data.identification.courseName}
              onChange={(e) => updateField('data.identification.courseName', e.target.value)}
            />
          </div>
<<<<<<< HEAD
          
=======

>>>>>>> 188eb5d (commit)
          <div>
            <label htmlFor="courseAbbreviation" className="input-label">Abreviatura</label>
            <input
              type="text"
              id="courseAbbreviation"
              className="input-field"
              value={plan.data.identification.courseAbbreviation}
              onChange={(e) => updateField('data.identification.courseAbbreviation', e.target.value)}
            />
          </div>
<<<<<<< HEAD
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="professorName" className="input-label">Nome do Professor</label>
            <input
              type="text"
              id="professorName"
              className="input-field"
              value={plan.data.identification.professorName}
              onChange={(e) => updateField('data.identification.professorName', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="siapeCode" className="input-label">Matrícula SIAPE</label>
            <input
              type="text"
              id="siapeCode"
              className="input-field"
              value={plan.data.identification.siapeCode}
              onChange={(e) => updateField('data.identification.siapeCode', e.target.value)}
            />
          </div>
        </div>
        
=======

          <div>
            <label htmlFor="inPersonHours" className="input-label">Carga Horária Presencial</label>
            <input
              type="number"
              id="inPersonHours"
              className="input-field"
              value={plan.data.identification.inPersonHours}
              onChange={(e) => updateField('data.identification.inPersonHours', Number(e.target.value))}
              min="0"
            />
          </div>

        </div>

>>>>>>> 188eb5d (commit)
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="totalHours" className="input-label">Carga Horária Total</label>
            <input
              type="number"
              id="totalHours"
              className="input-field"
              value={plan.data.identification.totalHours}
              onChange={(e) => updateField('data.identification.totalHours', Number(e.target.value))}
              min="0"
            />
          </div>
<<<<<<< HEAD
          
          <div>
            <label htmlFor="weeklyHours" className="input-label">Carga Horária Semanal</label>
=======

          <div>
            <label htmlFor="weeklyHours" className="input-label">Carga Horária/Aula Semanal</label>
>>>>>>> 188eb5d (commit)
            <input
              type="number"
              id="weeklyHours"
              className="input-field"
              value={plan.data.identification.weeklyHours}
              onChange={(e) => updateField('data.identification.weeklyHours', Number(e.target.value))}
              min="0"
            />
          </div>
<<<<<<< HEAD
          
          <div>
            <label htmlFor="inPersonHours" className="input-label">Carga Horária Presencial</label>
            <input
              type="number"
              id="inPersonHours"
              className="input-field"
              value={plan.data.identification.inPersonHours}
              onChange={(e) => updateField('data.identification.inPersonHours', Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="theoreticalHours" className="input-label">Carga Horária Teórica</label>
=======
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="theoreticalHours" className="input-label">Carga Horária de Atividades Teóricas</label>
>>>>>>> 188eb5d (commit)
            <input
              type="number"
              id="theoreticalHours"
              className="input-field"
              value={plan.data.identification.theoreticalHours}
              onChange={(e) => updateField('data.identification.theoreticalHours', Number(e.target.value))}
              min="0"
            />
          </div>
<<<<<<< HEAD
          
          <div>
            <label htmlFor="practicalHours" className="input-label">Carga Horária Prática</label>
=======

          <div>
            <label htmlFor="practicalHours" className="input-label">Carga Horária de Atividades Práticas</label>
>>>>>>> 188eb5d (commit)
            <input
              type="number"
              id="practicalHours"
              className="input-field"
              value={plan.data.identification.practicalHours}
              onChange={(e) => updateField('data.identification.practicalHours', Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
<<<<<<< HEAD
=======

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="professorName" className="input-label">Nome do Professor</label>
            <input
              type="text"
              id="professorName"
              className="input-field"
              value={plan.data.identification.professorName}
              onChange={(e) => updateField('data.identification.professorName', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="siapeCode" className="input-label">Matrícula SIAPE</label>
            <input
              type="text"
              id="siapeCode"
              className="input-field"
              value={plan.data.identification.siapeCode}
              onChange={(e) => updateField('data.identification.siapeCode', e.target.value)}
            />
          </div>
        </div>
>>>>>>> 188eb5d (commit)
      </div>
    </FormStepWrapper>
  );
};

export default IdentificationForm;
