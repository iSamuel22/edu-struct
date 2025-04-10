export interface SectionStatus {
  id: string;
  title: string;
  isComplete: boolean;
  isRequired: boolean;
  isValid: boolean | null;
  validationMessage?: string;
  fields?: FieldStatus[];
}

export interface FieldStatus {
  id: string;
  name: string;
  isComplete: boolean;
  isRequired: boolean;
  isValid: boolean | null;
  validationMessage?: string;
}

export interface ChecklistSummary {
  completedSections: number;
  totalSections: number;
  completedRequiredSections: number;
  totalRequiredSections: number;
  isValid: boolean;
  completionPercentage: number;
}