import React from 'react';
import { CheckCircle, AlertCircle, CircleAlert } from 'lucide-react';

interface ComplianceIndicatorProps {
  isValid: boolean;
  completionPercentage: number;
}

const ComplianceIndicator: React.FC<ComplianceIndicatorProps> = ({ 
  isValid, 
  completionPercentage 
}) => {
  if (completionPercentage === 100 && isValid) {
    return (
      <div className="flex items-center gap-2 text-emerald-500">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Plano completo e válido</span>
      </div>
    );
  } else if (completionPercentage === 100 && !isValid) {
    return (
      <div className="flex items-center gap-2 text-amber-500">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Plano completo, mas com inconsistências</span>
      </div>
    );
  } else if (completionPercentage > 50) {
    return (
      <div className="flex items-center gap-2 text-blue-500">
        <CircleAlert className="h-5 w-5" />
        <span className="font-medium">Plano em andamento</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <CircleAlert className="h-5 w-5" />
        <span className="font-medium">Plano iniciado</span>
      </div>
    );
  }
};

export default ComplianceIndicator;