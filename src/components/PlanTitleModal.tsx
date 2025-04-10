import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
          
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salvando...
                </span>
              ) : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanTitleModal;