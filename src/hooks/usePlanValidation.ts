import { useState, useEffect } from 'react';
import { TeachingPlan } from '../utils/storage';
import { 
  validatePlan, 
  calculateChecklistSummary 
} from '../utils/validatePlan';
import { SectionStatus, ChecklistSummary } from '../types/checklist';
import { usePlan } from '../context/PlanContext';

export const usePlanValidation = () => {
  const { plan } = usePlan();
  const [sections, setSections] = useState<SectionStatus[]>([]);
  const [summary, setSummary] = useState<ChecklistSummary>({
    completedSections: 0,
    totalSections: 0,
    completedRequiredSections: 0,
    totalRequiredSections: 0,
    isValid: false,
    completionPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validate = () => {
      setIsLoading(true);
      try {
        const validatedSections = validatePlan(plan);
        setSections(validatedSections);
        setSummary(calculateChecklistSummary(validatedSections));
      } finally {
        setIsLoading(false);
      }
    };

    validate();
  }, [plan]);

  return {
    sections,
    summary,
    isLoading
  };
};

export default usePlanValidation;