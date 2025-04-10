import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  User, 
  loginUser, 
  registerUser, 
  logoutUser as logoutUserUtil,
  updateUserProfile,
  deleteAccount
} from '@/utils/auth';
import { useToast } from '../hooks/use-toast';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserSettingsModal from '@/components/UserSettingsModal';

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUserSettingsModalOpen: boolean;
  setIsUserSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: () => void;
  handleLogout: () => void;
  handleRegister: () => void;
  handleUserSettings: () => void;
  performLogin: (username: string, password: string) => void;
  performRegistration: (username: string, name: string, password: string) => void;
  updateUserInfo: (name: string, currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteUserAccount: (password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          id: firebaseUser.uid,
          username: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email || ''
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair? Todas as alterações não salvas serão perdidas.")) {
      logoutUserUtil();
      setCurrentUser(null);
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso.",
      });
    }
  };

  const handleRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleUserSettings = () => {
    setIsUserSettingsModalOpen(true);
  };

  const performLogin = async (username: string, password: string) => {
    try {
      const user = await loginUser(username, password);
      if (user) {
        setCurrentUser(user);
        setIsLoginModalOpen(false);
        toast({
          title: "Login realizado",
          description: `Bem-vindo, ${user.name}!`,
        });
      } else {
        toast({
          title: "Erro de login",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro de login",
        description: error.message || "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  const performRegistration = async (username: string, name: string, password: string) => {
    try {
      const user = await registerUser(username, password, name);
      if (user) {
        setCurrentUser(user);
        setIsRegisterModalOpen(false);
        toast({
          title: "Registro realizado",
          description: `Bem-vindo, ${user.name}!`,
        });
      }
    } catch (error: any) {
      console.error('Registration error in context:', error);
      toast({
        title: "Erro no registro",
        description: error.message || "Ocorreu um erro ao tentar registrar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateUserInfo = async (name: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const success = await updateUserProfile(name, currentPassword, newPassword);
      
      if (success && currentUser) {
        // Update the local user state with the new name
        setCurrentUser({
          ...currentUser,
          name: name
        });
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      }
      
      return success;
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao tentar atualizar suas informações.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteUserAccount = async (password: string): Promise<boolean> => {
    try {
      const success = await deleteAccount(password);
      
      if (success) {
        setCurrentUser(null);
        setIsUserSettingsModalOpen(false);
        
        toast({
          title: "Conta excluída",
          description: "Sua conta foi excluída com sucesso.",
        });
      }
      
      return success;
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erro ao excluir conta",
        description: error.message || "Ocorreu um erro ao tentar excluir sua conta.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isRegisterModalOpen,
      setIsRegisterModalOpen,
      isUserSettingsModalOpen,
      setIsUserSettingsModalOpen,
      handleLogin,
      handleLogout,
      handleRegister,
      handleUserSettings,
      performLogin,
      performRegistration,
      updateUserInfo,
      deleteUserAccount
    }}>
      {children}
      <UserSettingsModal
        isOpen={isUserSettingsModalOpen}
        onClose={() => setIsUserSettingsModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={updateUserInfo}
        onDeleteAccount={deleteUserAccount}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
