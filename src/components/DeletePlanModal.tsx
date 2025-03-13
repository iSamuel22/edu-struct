
import React from 'react';
import { X, AlertTriangle } from "lucide-react";

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  planTitle: string;
}

const DeletePlanModal: React.FC<DeletePlanModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirmDelete,
  planTitle 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg w-full max-w-md shadow-xl animate-scale-in p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Excluir Plano</span>
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="mb-2">Tem certeza que deseja excluir o plano de ensino:</p>
          <p className="font-medium text-lg">{planTitle}</p>
          <p className="mt-2 text-destructive text-sm">Esta ação não pode ser desfeita.</p>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmDelete}
            className="btn bg-destructive text-white hover:bg-destructive/90"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlanModal;
