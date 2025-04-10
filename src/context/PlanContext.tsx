import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  getAllPlans, 
  savePlan, 
  deletePlan, 
  TeachingPlan, 
  createEmptyPlan,
  getPlanById
} from '@/utils/storage';
import { auth } from '@/config/firebase';
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
  handleSelectPlan: (selectedPlan: TeachingPlan) => Promise<TeachingPlan | null>;
  handleOpenPlan: (selectedPlan: TeachingPlan) => void; // Nova função para abrir sem copiar
  handleDeletePlan: () => void;
  confirmDeletePlan: () => Promise<boolean>;
  handleExportPlan: () => void;
  handleExportPlanAsPdf: () => void;
  updateField: (path: string, value: unknown) => void;
  addItemToArray: (path: string, item: unknown) => void;
  removeItemFromArray: (path: string, index: number) => void;
  canDeletePlan: boolean;
  handleRenamePlan: (newTitle: string) => Promise<void>;
  handleCopyPlan: () => Promise<TeachingPlan | null>;
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
  
  const canDeletePlan = plan.id !== createEmptyPlan().id;
                        
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

  const handleSelectPlan = async (selectedPlan: TeachingPlan) => {
    try {
      // Remove any existing "(Cópia)" suffixes before adding a new one
      let cleanTitle = selectedPlan.title;
      if (cleanTitle.includes(" (Cópia)")) {
        cleanTitle = cleanTitle.replace(/\s\(Cópia\)+/g, "");
      }
      
      const newPlan = {
        ...selectedPlan,
        id: Date.now().toString(),
        title: `${cleanTitle} (Cópia)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Primeiro salvar o plano no Firestore para garantir que ele possa ser excluído
      await savePlan(newPlan);
      
      // Depois atualizar o estado local
      setPlan(newPlan);
      setCurrentStep(0);
      
      // Atualizar a lista de planos
      const updatedPlans = await getAllPlans();
      setSavedPlans(updatedPlans);
      
      toast({
        title: "Plano carregado",
        description: `Uma cópia do plano "${cleanTitle}" foi criada.`,
      });
      
      return newPlan;
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast({
        title: "Erro ao carregar plano",
        description: "Não foi possível carregar o plano selecionado. Tente novamente.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Adicionar nova função para abrir um plano sem criar cópia
  const handleOpenPlan = (selectedPlan: TeachingPlan) => {
    try {
      // Simplesmente definir o plano selecionado como o plano atual
      setPlan(selectedPlan);
      setCurrentStep(0);
      
      toast({
        title: "Plano aberto",
        description: `O plano "${selectedPlan.title}" foi aberto com sucesso.`,
      });
      
      return selectedPlan;
    } catch (error) {
      console.error('Error opening plan:', error);
      toast({
        title: "Erro ao abrir plano",
        description: "Não foi possível abrir o plano selecionado. Tente novamente.",
        variant: "destructive",
      });
      return null;
    }
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

  const confirmDeletePlan = async (): Promise<boolean> => {
    try {
      console.log("Deleting plan with ID:", plan.id);
      
      // Verifique se estamos tentando excluir um plano vazio
      if (plan.id === createEmptyPlan().id) {
        toast({
          title: "Erro ao excluir",
          description: "Não é possível excluir um plano que não foi salvo.",
          variant: "destructive",
        });
        return false;
      }
      
      // Garantir que o usuário atual esteja logado
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast({
          title: "Erro ao excluir",
          description: "Você precisa estar logado para excluir planos.",
          variant: "destructive",
        });
        return false;
      }
      
      // Chamar a função deletePlan de utils/storage
      const success = await deletePlan(plan.id);
      
      if (success) {
        console.log("Plan deleted successfully!");
        
        // Criar um novo plano vazio após a exclusão
        setPlan(createEmptyPlan());
        setCurrentStep(0);
        
        // Atualizar a lista de planos salvos
        const updatedPlans = await getAllPlans();
        setSavedPlans(updatedPlans);
        
        return true;
      } else {
        console.error("Failed to delete plan");
        throw new Error("Não foi possível excluir o plano");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o plano. Tente novamente.",
        variant: "destructive",
      });
      return false;
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

  const handleCopyPlan = async () => {
    try {
      console.log("Starting plan copy process for plan:", plan.id);
      
      // Remove any existing "(Cópia)" suffixes before adding a new one
      let cleanTitle = plan.title;
      if (cleanTitle.includes(" (Cópia)")) {
        cleanTitle = cleanTitle.replace(/\s\(Cópia\)+/g, "");
      }
      
      // Criar uma cópia do plano atual com um novo ID
      const newId = Date.now().toString();
      const planCopy = {
        ...plan,
        id: newId,
        title: `${cleanTitle} (Cópia)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log("Created copy with new ID:", newId);
      
      // Salvar a cópia no Firestore
      await savePlan(planCopy);
      console.log("Copy saved to Firestore");
      
      // Atualizar a lista de planos
      const updatedPlans = await getAllPlans();
      setSavedPlans(updatedPlans);
      
      toast({
        title: "Plano copiado",
        description: `Uma cópia do plano "${cleanTitle}" foi criada.`,
      });
      
      // Definir o plano atual como a cópia
      setPlan(planCopy);
      
      return planCopy;
    } catch (error) {
      console.error('Error copying plan:', error);
      toast({
        title: "Erro ao copiar plano",
        description: "Não foi possível criar uma cópia do plano. Tente novamente.",
        variant: "destructive",
      });
      return null;
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
      handleOpenPlan,
      handleDeletePlan,
      confirmDeletePlan,
      handleExportPlan,
      handleExportPlanAsPdf,
      updateField,
      addItemToArray,
      removeItemFromArray,
      canDeletePlan,
      handleRenamePlan,
      handleCopyPlan,
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
