import React from 'react';
import { XCircle } from 'lucide-react';

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planTitle: string;
}

const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full animate-scale-in">
        <div className="p-6 flex items-start gap-4">
          <div className="text-destructive shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Excluir plano</h2>
            <p className="text-muted-foreground mb-2">
              Tem certeza que deseja excluir o plano <strong className="text-foreground">{planTitle}</strong>?
            </p>
            <p className="text-sm text-destructive">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
        <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="btn btn-destructive"
            onClick={onConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlanModal;
