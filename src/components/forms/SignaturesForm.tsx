import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';
import { FileDown } from 'lucide-react';

const SignaturesForm: React.FC = () => {
  const { currentStep, plan, updateField, handleExportPlan, handleExportPlanAsPdf } = usePlan();

  return (
    <FormStepWrapper 
      title="Assinaturas" 
      isActive={currentStep === 11}
      description="Informações para finalização e assinatura do plano."
    >
      <div className="form-section space-y-6">
        <div>
          <label htmlFor="professorSignature" className="input-label">Assinatura do Professor</label>
          <input
            type="text"
            id="professorSignature"
            className="input-field"
            value={plan.data.signatures.professorSignature}
            onChange={(e) => updateField('data.signatures.professorSignature', e.target.value)}
            placeholder="Nome do professor"
          />
        </div>
        
        <div>
          <label htmlFor="coordinatorSignature" className="input-label">Assinatura do Coordenador</label>
          <input
            type="text"
            id="coordinatorSignature"
            className="input-field"
            value={plan.data.signatures.coordinatorSignature}
            onChange={(e) => updateField('data.signatures.coordinatorSignature', e.target.value)}
            placeholder="Nome do coordenador"
          />
        </div>

        <div>
          <label htmlFor="courseName" className="input-label">Nome do Curso</label>
          <input
            type="text"
            id="courseName"
            className="input-field"
            value={plan.data.signatures.courseName}
            onChange={(e) => updateField('data.signatures.courseName', e.target.value)}
            placeholder="Nome do curso"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="input-label">Ano</label>
          <input
            type="text"
            id="date"
            className="input-field"
            value={plan.data.signatures.date}
            onChange={(e) => updateField('data.signatures.date', e.target.value)}
            placeholder="Ex: 2024.2"
          />
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportPlan}
            className="btn btn-outline flex items-center justify-center gap-2"
            type="button"
          >
            <FileDown size={16} />
            <span>Exportar como TXT</span>
          </button>
          
          <button
            onClick={handleExportPlanAsPdf}
            className="btn btn-primary flex items-center justify-center gap-2"
            type="button"
          >
            <FileDown size={16} />
            <span>Exportar como PDF</span>
          </button>
        </div>
      </div>
    </FormStepWrapper>
  );
};

export default SignaturesForm;
