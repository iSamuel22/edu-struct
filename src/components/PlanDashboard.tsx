import React from 'react';
import { FileText, Upload, Plus } from 'lucide-react';
import { TeachingPlan } from '@/utils/storage';

interface PlanDashboardProps {
  savedPlans: TeachingPlan[];
  onNewPlan: () => void;
  onLoadPlan: () => void;
  onSelectPlan: (plan: TeachingPlan) => void; // Esta função agora vai abrir diretamente
}

const PlanDashboard: React.FC<PlanDashboardProps> = ({
  savedPlans,
  onNewPlan,
  onLoadPlan,
  onSelectPlan
}) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-xl w-full max-w-2xl backdrop-blur-sm border border-border shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-6">Planos de Ensino</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
              <p className="text-lg font-medium mb-2">Criar um novo plano</p>
              <p className="text-muted-foreground text-sm mb-4">
                Comece um plano de ensino do zero com todas as seções necessárias.
              </p>
              <button 
                onClick={onNewPlan}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Novo Plano</span>
              </button>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
              <p className="text-lg font-medium mb-2">Carregar plano existente</p>
              <p className="text-muted-foreground text-sm mb-4">
                Continue trabalhando em um plano salvo anteriormente.
              </p>
              <button 
                onClick={onLoadPlan}
                className="btn btn-outline w-full flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                <span>Carregar Plano</span>
              </button>
            </div>
          </div>

          {savedPlans.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Planos Recentes</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {savedPlans.slice(0, 5).map((savedPlan) => (
                  <div 
                    key={savedPlan.id}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-accent cursor-pointer border border-border"
                    onClick={() => onSelectPlan(savedPlan)} // Abrir plano diretamente ao clicar
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{savedPlan.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Atualizado: {new Date(savedPlan.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlan(savedPlan);
                      }}
                      className="p-2 rounded-full text-primary hover:bg-primary/10"
                      title="Abrir plano"
                    >
                      <FileText size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {savedPlans.length > 5 && (
                <button 
                  onClick={onLoadPlan}
                  className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
                >
                  <span>Ver todos os planos</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDashboard;