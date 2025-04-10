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
import { PlanProvider, usePlan } from '@/context/PlanContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TeachingPlan } from '@/utils/storage';

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
    handleDeletePlan,
    confirmDeletePlan,
    handleExportPlan,
    handleExportPlanAsPdf,
    savedPlans,
    canDeletePlan,
    handleRenamePlan
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
    handleDeletePlan();
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    confirmDeletePlan();
    setIsDeleteModalOpen(false);
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

  // Create modified handlers that ensure scrolling to top
  const handleSelectPlanWithScroll = (plan: TeachingPlan) => {
    handleSelectPlan(plan);
    setIsLoadModalOpen(false);
    window.scrollTo(0, 0);
  };

  const handleNewPlanWithScroll = () => {
    handleNewPlan();
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header
        onNewPlan={handleNewPlanWithScroll}
        onLoadPlan={onLoadPlan}
        onSavePlan={handleSavePlan}
        onExportPlan={handleExportTxt}
        onExportPlanAsPdf={handleExportPdf}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
        onDeleteClick={onDeleteClick}
        onUserSettings={handleUserSettings}
        onRenamePlan={onRenamePlan}
        currentUser={currentUser}
        canDelete={canDeletePlan}
        currentPlanTitle={plan.title}
        onToggleChecklist={() => setIsChecklistOpen(!isChecklistOpen)}
        isChecklistVisible={isChecklistOpen}
      />

      {!currentUser ? (
        <WelcomeScreen onLoginClick={handleLogin} />
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

      {currentUser && (
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
        onSelectPlan={handleSelectPlanWithScroll}
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
