import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { TeachingPlan } from '@/utils/storage';

interface PlanTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TeachingPlan;
  onSave: (newTitle: string) => void;
}

const PlanTitleModal: React.FC<PlanTitleModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && plan) {
      setTitle(plan.title);
    }
  }, [isOpen, plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSave(title.trim());
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg w-full max-w-md shadow-xl animate-scale-in p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Nome do Plano</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="plan-title" className="input-label">Título do Plano</label>
            <input
              id="plan-title"
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título para o plano"
              autoFocus
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Nome atual: <span className="font-medium">{plan.title}</span>
            </span>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={isLoading || !title.trim() || title === plan.title}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanTitleModal;