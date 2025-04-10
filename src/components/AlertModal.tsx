import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  showCancel = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-amber-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <Info className="h-6 w-6 text-primary" />;
    }
  };

  const getHeaderBg = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50';
      case 'warning':
        return 'bg-amber-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-primary/5';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'error':
        return 'btn-destructive';
      default:
        return 'btn-primary';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-background rounded-lg w-full max-w-md shadow-xl animate-scale-in overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className={`${getHeaderBg()} p-4 flex items-start gap-3`}>
          {getIcon()}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-black/5"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 flex justify-end gap-2">
          {showCancel && (
            <button 
              onClick={onClose} 
              className="btn btn-ghost"
            >
              {cancelText}
            </button>
          )}
          <button 
            onClick={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }} 
            className={`btn ${getButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlertModal;