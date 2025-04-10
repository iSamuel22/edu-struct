import React, { useState, useEffect } from 'react';
import { ArrowUpDown, X, List } from 'lucide-react';
import ChecklistItem from './ChecklistItem';
import ProgressBar from './ProgressBar';
import ComplianceIndicator from './ComplianceIndicator';
import SectionsSummary from './SectionsSummary';
import usePlanValidation from '../hooks/usePlanValidation';
import { usePlan } from '../context/PlanContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChecklistPanelProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({ 
  isOpen = true,
  onToggle 
}) => {
  const { currentStep, setCurrentStep } = usePlan();
  const { sections, summary, isLoading } = usePlanValidation();
  const [isPanelOpen, setIsPanelOpen] = useState(isOpen);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsPanelOpen(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !isPanelOpen;
    setIsPanelOpen(newState);
    if (onToggle) onToggle();
  };

  const handleNavigate = (step: number) => {
    setCurrentStep(step);
    if (isMobile) {
      setIsPanelOpen(false);
      if (onToggle) onToggle();
    }
  };

  if (!isPanelOpen) {
    return (
      <button
        onClick={handleToggle}
        className="fixed right-4 bottom-20 z-10 btn btn-primary rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        <List size={20} />
      </button>
    );
  }

  const panelClasses = isMobile
    ? "fixed inset-x-0 bottom-16 z-10 w-full max-h-[70vh] bg-background border-t border-border flex flex-col overflow-hidden rounded-t-lg shadow-lg"
    : "fixed right-4 bottom-20 z-10 w-80 max-h-[70vh] bg-background border border-border rounded-lg shadow-lg flex flex-col overflow-hidden";

  return (
    <div className={panelClasses}>
      <div className="flex items-center justify-between bg-primary text-primary-foreground p-3">
        <h3 className="font-medium flex items-center gap-2">
          <List size={18} />
          Checklist do Plano
        </h3>
        <div>
          <button
            onClick={handleToggle}
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-border">
        <ProgressBar 
          progress={summary.completionPercentage} 
          isValid={summary.isValid}
        />
        
        <div className="mt-2 flex items-center justify-between">
          <ComplianceIndicator 
            isValid={summary.isValid}
            completionPercentage={summary.completionPercentage}
          />
          <span className="font-bold">
            {summary.completionPercentage}%
          </span>
        </div>
      </div>

      <div className="p-3 border-b border-border">
        <SectionsSummary summary={summary} />
      </div>

      <div className="overflow-y-auto flex-1 p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          sections.map((section, index) => (
            <ChecklistItem
              key={section.id}
              section={section}
              currentStep={currentStep}
              onNavigate={handleNavigate}
              stepIndex={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChecklistPanel;