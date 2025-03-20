import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FormNavigation from '@/components/FormNavigation';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import DeletePlanModal from '@/components/DeletePlanModal';
import PlanLoadModal from '@/components/PlanLoadModal';
import WelcomeScreen from '@/components/WelcomeScreen';
import { PlanProvider, usePlan } from '@/context/PlanContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

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
import { exportAsPdf, exportAsTxt } from '@/utils/export';

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
    canDeletePlan
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
    performRegistration
  } = useAuth();

  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onLoadPlan = () => {
    handleLoadPlan();
    setIsLoadModalOpen(true);
  };

  const handleExportPdf = () => {
    exportAsPdf(plan);
  };

  const handleExportTxt = () => {
    exportAsTxt(plan);
  };

  const onDeleteClick = () => {
    handleDeletePlan();
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    confirmDeletePlan();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header
        onNewPlan={handleNewPlan}
        onLoadPlan={onLoadPlan}
        onSavePlan={handleSavePlan}
        onExportPlan={handleExportTxt}
        onExportPlanAsPdf={handleExportPdf}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
        onDeleteClick={onDeleteClick}
        currentUser={currentUser}
        canDelete={canDeletePlan}
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
        onSelectPlan={(plan) => {
          handleSelectPlan(plan);
          setIsLoadModalOpen(false);
        }}
      />
    </div>
  );
};

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
