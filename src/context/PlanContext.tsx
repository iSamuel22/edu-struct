import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { TeachingPlan, createEmptyPlan, savePlan, getAllPlans, deletePlan } from '@/utils/storage';
import { useToast } from '../hooks/use-toast';
import { exportAsPdf, exportAsTxt } from '@/utils/export';

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
  updateField: (path: string, value: unknown) => void;
  addItemToArray: (path: string, item: unknown) => void;
  removeItemFromArray: (path: string, index: number) => void;
  canDeletePlan: boolean;
  handleRenamePlan: (newTitle: string) => Promise<void>;
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [plan, setPlan] = useState<TeachingPlan>(createEmptyPlan());
  const [currentStep, setCurrentStep] = useState(0);
  const [savedPlans, setSavedPlans] = useState<TeachingPlan[]>([]);
  
  useEffect(() => {
    const loadSavedPlans = async () => {
      const plans = await getAllPlans();
      setSavedPlans(plans);
    };
    loadSavedPlans();
  }, []);
  
  const canDeletePlan = plan.id !== createEmptyPlan().id && 
                        savedPlans.some(savedPlan => savedPlan.id === plan.id);
                        
  const handleNewPlan = () => {
    if (confirm("Criar um novo plano? Todas as alterações não salvas serão perdidas.")) {
      setPlan(createEmptyPlan());
      setCurrentStep(0);
      window.scrollTo(0, 0);
      toast({
        title: "Novo plano criado",
        description: "Comece preenchendo as informações de identificação.",
      });
    }
  };

  const handleSavePlan = async () => {
    try {
      if (plan.title === "Novo Plano de Ensino") {
        const newTitle = prompt("Digite um título para o plano:", plan.title);
        if (newTitle) {
          setPlan(prev => ({ ...prev, title: newTitle }));
          await savePlan({ ...plan, title: newTitle });
        } else {
          await savePlan(plan);
        }
      } else {
        await savePlan(plan);
      }
      
      toast({
        title: "Plano salvo",
        description: "Seu plano de ensino foi salvo com sucesso.",
      });
      
      const plans = await getAllPlans();
      setSavedPlans(plans);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleLoadPlan = async () => {
    const plans = await getAllPlans();
    setSavedPlans(plans);
  };

  const handleSelectPlan = (selectedPlan: TeachingPlan) => {
    setPlan(selectedPlan);
    setCurrentStep(0);
    window.scrollTo(0, 0);
    toast({
      title: "Plano carregado",
      description: `"${selectedPlan.title}" foi carregado com sucesso.`,
    });
  };

  const handleExportPlan = () => {
    try {
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

  const confirmDeletePlan = async () => {
    try {
      const success = deletePlan(plan.id);
      if (success) {
        toast({
          title: "Plano excluído",
          description: `O plano "${plan.title}" foi excluído com sucesso.`,
        });
        
        setPlan(createEmptyPlan());
        setSavedPlans(await getAllPlans());
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

  const updateField = (path: string, value: unknown) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as Record<string, unknown>;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!currentObj[part]) currentObj[part] = {};
        currentObj = currentObj[part] as Record<string, unknown>;
      }
      
      const fieldName = pathParts[pathParts.length - 1];
      currentObj[fieldName] = value;
      
      return newPlan;
    });
  };

  const addItemToArray = (path: string, item: unknown) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as Record<string, unknown>;
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (!currentObj[part]) {
          if (i === pathParts.length - 1) {
            currentObj[part] = [];
          } else {
            currentObj[part] = {};
          }
        }
        currentObj = currentObj[part] as Record<string, unknown>;
      }
      
      const array = currentObj as unknown as unknown[];
      array.push(item);
      
      return newPlan;
    });
  };

  const removeItemFromArray = (path: string, index: number) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as Record<string, unknown>;
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        currentObj = currentObj[part] as Record<string, unknown>;
      }
      
      const array = currentObj as unknown as unknown[];
      array.splice(index, 1);
      
      return newPlan;
    });
  };

  const setCurrentStepWithScroll = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleRenamePlan = async (newTitle: string): Promise<void> => {
    try {
      if (!newTitle.trim()) {
        throw new Error("O título não pode estar vazio");
      }

      // Update the title in the state first
      setPlan(prevPlan => ({ 
        ...prevPlan, 
        title: newTitle,
        lastUpdated: Date.now()
      }));

      // Then save to database
      await savePlan({ 
        ...plan, 
        title: newTitle,
        lastUpdated: Date.now() 
      });
      
      toast({
        title: "Título atualizado",
        description: "O título do plano foi atualizado com sucesso.",
      });
      
      // Refresh the saved plans list
      const plans = await getAllPlans();
      setSavedPlans(plans);
    } catch (error) {
      console.error("Error renaming plan:", error);
      toast({
        title: "Erro ao renomear",
        description: "Não foi possível atualizar o título do plano. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <PlanContext.Provider value={{
      plan,
      setPlan,
      savedPlans,
      setSavedPlans,
      currentStep,
      setCurrentStep: setCurrentStepWithScroll,
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
      canDeletePlan,
      handleRenamePlan,
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
