import React, { useState } from 'react';
import { createEmptyPlan, savePlan } from '../utils/storage'; // Ajuste o caminho conforme necessário
import { TeachingPlan } from '../utils/storage'; // Ajuste o caminho conforme necessário
import Header from './Header'; // Ajuste o caminho conforme necessário

const PlanForm: React.FC = () => {
  const [plan, setPlan] = useState<TeachingPlan>(createEmptyPlan());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlan(prevPlan => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleSave = () => {
    savePlan(plan);
    setPlan(createEmptyPlan()); // Limpa o formulário após salvar
  };

  const handleNewPlan = () => {
    setPlan(createEmptyPlan()); // Limpa o formulário para um novo plano
  };

  return (
    <>
      <Header
        onNewPlan={handleNewPlan}
        onLoadPlan={() => {}}
        onSavePlan={handleSave}
        onExportPlan={() => {}}
        onExportPlanAsPdf={() => {}}
        onLoginClick={() => {}}
        onLogout={() => {}}
        onDeleteClick={() => {}}
        currentUser={null}
        canDelete={false}
      />
      <form>
        <input
          type="text"
          name="title"
          value={plan.title}
          onChange={handleChange}
          placeholder="Título do Plano"
        />
        {/* Adicione outros campos do formulário conforme necessário */}
        <button type="button" onClick={handleSave}>Salvar</button>
      </form>
    </>
  );
};

export default PlanForm;