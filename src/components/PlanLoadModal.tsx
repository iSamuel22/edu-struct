import React from 'react';
import { X, FileText } from "lucide-react";
import { TeachingPlan } from '@/utils/storage';

interface PlanLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: TeachingPlan[];
  onSelectPlan: (plan: TeachingPlan) => void;
}

const PlanLoadModal: React.FC<PlanLoadModalProps> = ({ 
  isOpen, 
  onClose, 
  savedPlans, 
  onSelectPlan 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-2xl shadow-xl animate-scale-in p-4 sm:p-6 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Carregar Plano</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        
        {savedPlans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nenhum plano salvo encontrado.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => onSelectPlan(plan)}
                className="w-full text-left p-3 sm:p-4 rounded-md border border-border hover:bg-accent transition-colors flex justify-between items-center"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {plan.data.identification.courseName || "Sem nome do componente"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {new Date(plan.updatedAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanLoadModal;
