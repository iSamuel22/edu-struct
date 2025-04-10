import React from 'react';
import { ChecklistSummary } from '../types/checklist';

interface SectionsSummaryProps {
  summary: ChecklistSummary;
}

const SectionsSummary: React.FC<SectionsSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <span className="text-muted-foreground">Seções obrigatórias:</span>
        <span className="font-bold">
          {summary.completedRequiredSections}/{summary.totalRequiredSections}
        </span>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <span className="text-muted-foreground">Total de seções:</span>
        <span className="font-bold">
          {summary.completedSections}/{summary.totalSections}
        </span>
      </div>
    </div>
  );
};

export default SectionsSummary;