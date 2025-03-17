
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TeachingPlan, createEmptyPlan, savePlan, getAllPlans, deletePlan } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

type PlanContextType = {
  plan: TeachingPlan;
  setPlan: React.Dispatch<React.SetStateAction<TeachingPlan>>;
  savedPlans: TeachingPlan[];
  setSavedPlans: React.Dispatch<React.SetStateAction<TeachingPlan[]>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleNewPlan: () => void;
  handleSavePlan: () => void;
  handleLoadPlan: () => void;
  handleSelectPlan: (selectedPlan: TeachingPlan) => void;
  handleDeletePlan: () => void;
  confirmDeletePlan: () => void;
  handleExportPlan: () => void;
  handleExportPlanAsPdf: () => void;
  updateField: (path: string, value: any) => void;
  addItemToArray: (path: string, item: any) => void;
  removeItemFromArray: (path: string, index: number) => void;
  canDeletePlan: boolean;
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [plan, setPlan] = useState<TeachingPlan>(createEmptyPlan());
  const [currentStep, setCurrentStep] = useState(0);
  const [savedPlans, setSavedPlans] = useState<TeachingPlan[]>(getAllPlans());
  
  const canDeletePlan = plan.id !== createEmptyPlan().id && 
                        savedPlans.some(savedPlan => savedPlan.id === plan.id);
                        
  const handleNewPlan = () => {
    if (confirm("Criar um novo plano? Todas as alterações não salvas serão perdidas.")) {
      setPlan(createEmptyPlan());
      setCurrentStep(0);
      toast({
        title: "Novo plano criado",
        description: "Comece preenchendo as informações de identificação.",
      });
    }
  };

  const handleSavePlan = () => {
    try {
      if (plan.title === "Novo Plano de Ensino") {
        const newTitle = prompt("Digite um título para o plano:", plan.title);
        if (newTitle) {
          setPlan(prev => ({ ...prev, title: newTitle }));
          savePlan({ ...plan, title: newTitle });
        } else {
          savePlan(plan);
        }
      } else {
        savePlan(plan);
      }
      
      toast({
        title: "Plano salvo",
        description: "Seu plano de ensino foi salvo com sucesso.",
      });
      
      setSavedPlans(getAllPlans());
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleLoadPlan = () => {
    setSavedPlans(getAllPlans());
  };

  const handleSelectPlan = (selectedPlan: TeachingPlan) => {
    setPlan(selectedPlan);
    setCurrentStep(0);
    toast({
      title: "Plano carregado",
      description: `"${selectedPlan.title}" foi carregado com sucesso.`,
    });
  };

  const handleExportPlan = () => {
    try {
      const { exportAsTxt } = require('@/utils/export');
      exportAsTxt(plan);
      toast({
        title: "Plano exportado",
        description: "Seu plano de ensino foi exportado como arquivo de texto.",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleExportPlanAsPdf = () => {
    try {
      const { exportAsPdf } = require('@/utils/export');
      exportAsPdf(plan);
      toast({
        title: "Plano exportado",
        description: "Seu plano de ensino foi exportado como arquivo PDF.",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar o plano como PDF. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = () => {
    // This will be handled in the Index component to show the modal
  };

  const confirmDeletePlan = () => {
    try {
      const success = deletePlan(plan.id);
      if (success) {
        toast({
          title: "Plano excluído",
          description: `O plano "${plan.title}" foi excluído com sucesso.`,
        });
        
        setPlan(createEmptyPlan());
        setSavedPlans(getAllPlans());
      } else {
        throw new Error("Falha ao excluir o plano");
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateField = (path: string, value: any) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as any;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!currentObj[part]) currentObj[part] = {};
        currentObj = currentObj[part];
      }
      
      const fieldName = pathParts[pathParts.length - 1];
      currentObj[fieldName] = value;
      
      return newPlan;
    });
  };

  const addItemToArray = (path: string, item: any) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as any;
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (!currentObj[part]) {
          if (i === pathParts.length - 1) {
            currentObj[part] = [];
          } else {
            currentObj[part] = {};
          }
        }
        currentObj = currentObj[part];
      }
      
      currentObj.push(item);
      
      return newPlan;
    });
  };

  const removeItemFromArray = (path: string, index: number) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as any;
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        currentObj = currentObj[part];
      }
      
      currentObj.splice(index, 1);
      
      return newPlan;
    });
  };

  return (
    <PlanContext.Provider value={{
      plan,
      setPlan,
      savedPlans,
      setSavedPlans,
      currentStep,
      setCurrentStep,
      handleNewPlan,
      handleSavePlan,
      handleLoadPlan,
      handleSelectPlan,
      handleDeletePlan,
      confirmDeletePlan,
      handleExportPlan,
      handleExportPlanAsPdf,
      updateField,
      addItemToArray,
      removeItemFromArray,
      canDeletePlan
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
