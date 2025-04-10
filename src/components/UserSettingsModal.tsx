import React, { useState, useEffect } from 'react';
import { X, Save, User, Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/utils/auth';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onUpdateUser: (name: string, currentPassword: string, newPassword: string) => Promise<boolean>;
  onDeleteAccount: (password: string) => Promise<boolean>;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser,
  onUpdateUser,
  onDeleteAccount
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
    
    // Reset states when modal is opened/closed
    if (!isOpen) {
      resetForm();
    }
  }, [currentUser, isOpen]);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setDeletePassword('');
    setIsChangingPassword(false);
    setIsDeletingAccount(false);
    setConfirmDeleteText('');
    setDeleteConfirmationOpen(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setShowDeletePassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    // Validate form
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "O nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (isChangingPassword) {
      if (!currentPassword) {
        toast({
          title: "Erro",
          description: "A senha atual é obrigatória",
          variant: "destructive",
        });
        return;
      }

      if (newPassword.length < 6) {
        toast({
          title: "Erro",
          description: "A nova senha deve ter pelo menos 6 caracteres",
          variant: "destructive",
        });
        return;
      }

      if (newPassword !== confirmNewPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const success = await onUpdateUser(
        name, 
        isChangingPassword ? currentPassword : '', 
        isChangingPassword ? newPassword : ''
      );
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Suas informações foram atualizadas",
        });
        handleClose();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar suas informações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletePassword) {
      toast({
        title: "Erro",
        description: "Digite sua senha para confirmar a exclusão",
        variant: "destructive",
      });
      return;
    }

    if (confirmDeleteText !== currentUser?.username) {
      toast({
        title: "Erro",
        description: "Digite seu email corretamente para confirmar a exclusão",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await onDeleteAccount(deletePassword);
      if (success) {
        toast({
          title: "Conta excluída",
          description: "Sua conta foi excluída com sucesso.",
        });
        handleClose();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir sua conta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-lg shadow-xl animate-scale-in p-4 sm:p-6 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Configurações da conta</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {!deleteConfirmationOpen ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="input-label">Usuário</label>
              <input
                id="username"
                type="text"
                className="input-field bg-muted"
                value={currentUser.username}
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado</p>
            </div>

            <div>
              <label htmlFor="name" className="input-label">Nome completo</label>
              <input
                id="name"
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Alterar senha</h3>
                <button 
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                >
                  {isChangingPassword ? 'Cancelar' : 'Alterar senha'}
                </button>
              </div>

              {isChangingPassword && (
                <div className="space-y-3 mt-3">
                  <div className="relative">
                    <label htmlFor="current-password" className="input-label">Senha atual</label>
                    <div className="relative">
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="input-field pr-10"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="new-password" className="input-label">Nova senha</label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        className="input-field pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="confirm-new-password" className="input-label">Confirmar nova senha</label>
                    <div className="relative">
                      <input
                        id="confirm-new-password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="input-field pr-10"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirme sua nova senha"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-border mt-4">
              <div className="flex justify-end gap-4">
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Salvar alterações</span>
                </button>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 mt-6">
              <div className="flex flex-col space-y-4">
                <h3 className="text-sm font-medium text-destructive flex items-center gap-2">
                  <AlertTriangle size={16} /> Zona de perigo
                </h3>
                
                <p className="text-xs text-muted-foreground">
                  A exclusão da sua conta removerá permanentemente todos os seus dados do sistema, incluindo
                  seus planos de ensino. Esta ação não pode ser desfeita.
                </p>
                
                <button
                  type="button"
                  onClick={handleDeleteAccountClick}
                  className="btn btn-outline btn-destructive flex items-center gap-2 self-start"
                >
                  <Trash2 size={16} />
                  <span>Excluir minha conta</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive rounded-md">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle size={20} />
                <h3 className="font-semibold">Confirmação de exclusão</h3>
              </div>
              <p className="text-sm mb-2">
                Esta ação é irreversível. Todos os seus dados e planos de ensino serão permanentemente excluídos.
              </p>
              
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="confirm-text" className="input-label text-destructive">
                    Digite <span className="font-semibold break-all">{currentUser.username}</span> para confirmar
                  </label>
                  <input
                    id="confirm-text"
                    type="text"
                    className="input-field border-destructive/50 focus:border-destructive"
                    value={confirmDeleteText}
                    onChange={(e) => setConfirmDeleteText(e.target.value)}
                    placeholder={`Digite ${currentUser.username}`}
                  />
                </div>
                
                <div className="relative">
                  <label htmlFor="delete-password" className="input-label text-destructive">Digite sua senha</label>
                  <div className="relative">
                    <input
                      id="delete-password"
                      type={showDeletePassword ? "text" : "password"}
                      className="input-field border-destructive/50 focus:border-destructive pr-10"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Digite sua senha para confirmar"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                    >
                      {showDeletePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmationOpen(false)}
                className="btn btn-outline order-2 sm:order-1"
                disabled={isLoading}
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-destructive flex items-center justify-center gap-2 order-1 sm:order-2 mb-2 sm:mb-0"
                disabled={isLoading || confirmDeleteText !== currentUser.username || !deletePassword}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={16} />
                )}
                <span>Excluir permanentemente</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettingsModal;