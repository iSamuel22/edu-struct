import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';
import { FileDown } from 'lucide-react';

const SignaturesForm: React.FC = () => {
  const { currentStep, plan, updateField, handleExportPlan, handleExportPlanAsPdf } = usePlan();

  // Initialize signatures fields if they don't exist
  React.useEffect(() => {
    if (!plan.data.signatures.location) {
      updateField('data.signatures.location', '');
    }
    if (!plan.data.signatures.date) {
      updateField('data.signatures.date', '');
    }
    if (!plan.data.signatures.signatories) {
      updateField('data.signatures.signatories', '');
    }
  }, []);

  return (
    <FormStepWrapper 
      title="Assinaturas" 
      isActive={currentStep === 11}
      description="Informações para finalização e assinatura do plano."
    >
      <div className="form-section space-y-6">
        <div>
          <label htmlFor="location" className="input-label">Local</label>
          <input
            type="text"
            id="location"
            className="input-field"
            value={plan.data.signatures.location || ''}
            onChange={(e) => updateField('data.signatures.location', e.target.value)}
            placeholder="Ex: São Paulo, SP"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="input-label">Data</label>
          <input
            type="text"
            id="date"
            className="input-field"
            value={plan.data.signatures.date || ''}
            onChange={(e) => updateField('data.signatures.date', e.target.value)}
            placeholder="Ex: 15 de maio de 2023"
          />
        </div>
        
        <div>
          <label htmlFor="signatories" className="input-label">Assinaturas</label>
          <textarea
            id="signatories"
            className="input-field min-h-[100px]"
            value={plan.data.signatures.signatories || ''}
            onChange={(e) => updateField('data.signatures.signatories', e.target.value)}
            placeholder="Nome e cargo dos assinantes"
          ></textarea>
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
