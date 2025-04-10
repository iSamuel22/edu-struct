import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FormNavigation from '@/components/FormNavigation';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import DeletePlanModal from '@/components/DeletePlanModal';
import PlanLoadModal from '@/components/PlanLoadModal';
import PlanTitleModal from '@/components/PlanTitleModal';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChecklistPanel from '@/components/ChecklistPanel';
import PlanDashboard from '@/components/PlanDashboard';
import { PlanProvider, usePlan } from '@/context/PlanContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TeachingPlan, createEmptyPlan } from '@/utils/storage';

import { exportAsPdf, exportAsTxt } from '@/utils/export';

// Import form components
import IdentificationForm from '@/components/forms/IdentificationForm';
import SyllabusForm from '@/components/forms/SyllabusForm';
import ObjectivesForm from '@/components/forms/ObjectivesForm';
import JustificationForm from '@/components/forms/JustificationForm';
import ExtensionForm from '@/components/forms/ExtensionForm';
import ContentForm from '@/components/forms/ContentForm';
import MethodologyForm from '@/components/forms/MethodologyForm';
import ResourcesForm from '@/components/forms/ResourcesForm';
import VisitsForm from '@/components/forms/VisitsForm';
import ScheduleForm from '@/components/forms/ScheduleForm';
import BibliographyForm from '@/components/forms/BibliographyForm';
import SignaturesForm from '@/components/forms/SignaturesForm';
import '@/index.css';
import { toast } from '@/components/ui/use-toast';

const steps = [
  "1. Identificação",
  "2. Ementa",
  "3. Objetivos",
  "4. Justificativa",
  "5. Extensão",
  "6. Conteúdo",
  "7. Metodologia",
  "8. Recursos",
  "9. Visitas",
  "10. Cronograma",
  "11. Bibliografia",
  "12. Assinaturas"
];

const PlanContent = () => {
  const {
    plan,
    currentStep,
    setCurrentStep,
    handleNewPlan,
    handleSavePlan,
    handleLoadPlan,
    handleSelectPlan,
    handleOpenPlan,
    handleDeletePlan,
    confirmDeletePlan,
    handleExportPlan,
    handleExportPlanAsPdf,
    handleCopyPlan,
    savedPlans,
    canDeletePlan,
    handleRenamePlan,
    isLoadingPlans // Novo estado para controlar carregamento
  } = usePlan();

  const {
    currentUser,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    handleLogin,
    handleLogout,
    handleRegister,
    performLogin,
    performRegistration,
    handleUserSettings
  } = useAuth();

  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const onLoadPlan = () => {
    handleLoadPlan();
    setIsLoadModalOpen(true);
  };

  const handleExportPdf = () => {
    handleExportPlanAsPdf();
  };

  const handleExportTxt = () => {
    handleExportPlan();
  };

  const onDeleteClick = () => {
    // Verificar se o plano tem ID (não é um plano vazio)
    if (plan.id === createEmptyPlan().id) {
      toast({
        title: "Aviso",
        description: "Não é possível excluir um plano que ainda não foi salvo.",
        variant: "default",
      });
      return;
    }
    
    console.log("Opening delete modal for plan:", plan.id, plan.title);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      console.log("Starting deletion process for plan:", plan.id);
      const success = await confirmDeletePlan();
      console.log("Deletion result:", success);
      
      setIsDeleteModalOpen(false);
      
      if (success) {
        setShowForm(false); // Voltar para o dashboard após excluir com sucesso
        toast({
          title: "Plano excluído",
          description: "O plano foi excluído com sucesso."
        });
      }
    } catch (error) {
      console.error("Error in onConfirmDelete:", error);
      setIsDeleteModalOpen(false);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o plano.",
        variant: "destructive"
      });
    }
  };

  const onRenamePlan = () => {
    setIsTitleModalOpen(true);
  };

  const handleRenameSubmit = async (newTitle: string) => {
    try {
      await handleRenamePlan(newTitle);
      setIsTitleModalOpen(false);
    } catch (error) {
      console.error("Failed to rename plan:", error);
    }
  };

  // Add this effect to scroll to top when currentStep changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Functions to handle dashboard interaction
  const handleNewPlanFromDashboard = () => {
    handleNewPlan();
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSelectPlanWithScroll = (plan: TeachingPlan) => {
    handleOpenPlan(plan); // Usar handleOpenPlan em vez de handleSelectPlan
    setIsLoadModalOpen(false);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSavePlanWithRedirect = async () => {
    await handleSavePlan();
    setShowForm(false); // Voltar para o dashboard após salvar
  };

  const handleBackToDashboard = () => {
    setShowForm(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header
        onSavePlan={showForm ? handleSavePlanWithRedirect : undefined}
        onExportPlan={handleExportTxt}
        onExportPlanAsPdf={handleExportPdf}
        onCopyPlan={showForm ? handleCopyPlan : undefined}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
        onDeleteClick={onDeleteClick}
        onUserSettings={handleUserSettings}
        onRenamePlan={onRenamePlan}
        onBackToDashboard={showForm ? handleBackToDashboard : undefined}
        currentUser={currentUser}
        canDelete={canDeletePlan}
        currentPlanTitle={showForm ? plan.title : undefined}
        onToggleChecklist={() => setIsChecklistOpen(!isChecklistOpen)}
        isChecklistVisible={isChecklistOpen}
        showActions={showForm}
      />

      {!currentUser ? (
        <WelcomeScreen onLoginClick={handleLogin} />
      ) : !showForm ? (
        <PlanDashboard
          savedPlans={savedPlans}
          onNewPlan={handleNewPlanFromDashboard}
          onLoadPlan={onLoadPlan}
          onSelectPlan={handleSelectPlanWithScroll}
          isLoading={isLoadingPlans} // Passar o estado de carregamento
        />
      ) : (
        <main className="container max-w-4xl mx-auto px-4">
          <div className="mb-16">
            <IdentificationForm />
            <SyllabusForm />
            <ObjectivesForm />
            <JustificationForm />
            <ExtensionForm />
            <ContentForm />
            <MethodologyForm />
            <ResourcesForm />
            <VisitsForm />
            <ScheduleForm />
            <BibliographyForm />
            <SignaturesForm />
          </div>

          <FormNavigation
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            steps={steps}
          />
        </main>
      )}

      {currentUser && showForm && (
        <ChecklistPanel 
          isOpen={isChecklistOpen}
          onToggle={() => setIsChecklistOpen(!isChecklistOpen)}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={performLogin}
        onSwitchToRegister={handleRegister}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={performRegistration}
        onSwitchToLogin={handleLogin}
      />

      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
        planTitle={plan.title}
      />

      <PlanLoadModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={handleSelectPlanWithScroll} // Usar a função que abre diretamente
      />

      <PlanTitleModal
        isOpen={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        plan={plan}
        onSave={handleRenameSubmit}
      />
    </div>
  );
};

// Componente Index corrigido - garante que os providers estejam na ordem correta
const Index = () => {
  return (
    <AuthProvider>
      <PlanProvider>
        <PlanContent />
      </PlanProvider>
    </AuthProvider>
  );
};

export default Index;
