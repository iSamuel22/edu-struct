import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';

const IdentificationForm: React.FC = () => {
  const { currentStep, plan, updateField } = usePlan();

  return (
    <FormStepWrapper 
      title="Identificação do Componente Curricular" 
      isActive={currentStep === 0}
      description="Informações básicas do componente curricular."
    >
      <div className="form-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="courseName" className="input-label">Nome do Componente</label>
            <input
              type="text"
              id="courseName"
              className="input-field"
              value={plan.data.identification.courseName}
              onChange={(e) => updateField('data.identification.courseName', e.target.value)}
              placeholder="Ex: Programação Web"
            />
          </div>
          
          <div>
            <label htmlFor="courseAbbreviation" className="input-label">Abreviatura</label>
            <input
              type="text"
              id="courseAbbreviation"
              className="input-field"
              value={plan.data.identification.courseAbbreviation}
              onChange={(e) => updateField('data.identification.courseAbbreviation', e.target.value)}
              placeholder="Ex: PROG-WEB"
            />
          </div>
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
              placeholder="Ex: João da Silva"
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
              placeholder="Ex: 1234567"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="totalHours" className="input-label">Carga Horária Total</label>
            <input
              type="text"
              id="totalHours"
              className="input-field"
              value={plan.data.identification.totalHours}
              onChange={(e) => updateField('data.identification.totalHours', e.target.value)}
              placeholder="EX: 67h, 80h/a"
            />
          </div>
          
          <div>
            <label htmlFor="weeklyHours" className="input-label">Carga Horária Semanal</label>
            <input
              type="text"
              id="weeklyHours"
              className="input-field"
              value={plan.data.identification.weeklyHours}
              onChange={(e) => updateField('data.identification.weeklyHours', e.target.value)}
              placeholder="Ex: 4h/a"
            />
          </div>
          
          <div>
            <label htmlFor="inPersonHours" className="input-label">Carga Horária Presencial</label>
            <input
              type="text"
              id="inPersonHours"
              className="input-field"
              value={plan.data.identification.inPersonHours}
              onChange={(e) => updateField('data.identification.inPersonHours', e.target.value)}
              placeholder="Ex: 45 horas"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="theoreticalHours" className="input-label">Carga Horária Teórica</label>
            <input
              type="text"
              id="theoreticalHours"
              className="input-field"
              value={plan.data.identification.theoreticalHours}
              onChange={(e) => updateField('data.identification.theoreticalHours', e.target.value)}
              placeholder="Ex: 30 horas"
            />
          </div>
          
          <div>
            <label htmlFor="practicalHours" className="input-label">Carga Horária Prática</label>
            <input
              type="text"
              id="practicalHours"
              className="input-field"
              value={plan.data.identification.practicalHours}
              onChange={(e) => updateField('data.identification.practicalHours', e.target.value)}
              placeholder="Ex: 30 horas"
            />
          </div>

          <div>
            <label htmlFor="extensionHours" className="input-label">Carga Horária de Extensão</label>
            <input
              type="text"
              id="extensionHours"
              className="input-field"
              value={plan.data.identification.extensionHours}
              onChange={(e) => updateField('data.identification.extensionHours', e.target.value)}
              placeholder="Ex: 10h/a"
            />
          </div>
        </div>

        <div>
          <label htmlFor="eixo" className="input-label">Eixo</label>
          <input
            type="text"
            id="eixo"
            className="input-field"
            value={plan.data.identification.eixo}
            onChange={(e) => updateField('data.identification.eixo', e.target.value)}
            placeholder="Ex: Gestão e Negócios"
          />
        </div>

        <div>
          <label htmlFor="distanceHours" className="input-label">Carga Horária a Distância</label>
          <input
            type="text"
            id="distanceHours"
            className="input-field"
            value={plan.data.identification.distanceHours}
            onChange={(e) => updateField('data.identification.distanceHours', e.target.value)}
            placeholder="Ex: 20 h/a"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Carga horária a distância (Caso o curso seja presencial, esse campo só deve ser preenchido se essa carga horária estiver prevista em PPC. A carga horária a distância deve observar o limite máximo previsto na legislação vigente referente a carga horária total do curso.)
          </p>
        </div>
      </div>
    </FormStepWrapper>
  );
};

export default IdentificationForm;
