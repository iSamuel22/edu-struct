import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'danger';
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning"
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md animate-scale-in overflow-hidden">
        <div className={`px-6 py-4 flex items-center gap-3 ${
          type === 'danger' 
            ? 'bg-destructive/10 text-destructive' 
            : type === 'info' 
              ? 'bg-blue-500/10 text-blue-500' 
              : 'bg-amber-500/10 text-amber-500'
        }`}>
          {type === 'danger' ? (
            <AlertCircle className="h-5 w-5" />
          ) : type === 'info' ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>

        <div className="p-6">
          <p className="text-foreground/80">{message}</p>
        </div>

        <div className="px-6 py-4 bg-muted/30 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="btn btn-ghost text-sm"
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            className={`btn text-sm ${
              type === 'danger' 
                ? 'btn-destructive' 
                : type === 'info'
                  ? 'btn-primary'
                  : 'btn-warning'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;