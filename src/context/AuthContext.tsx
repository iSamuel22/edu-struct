import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  User, 
  loginUser, 
  registerUser, 
  logoutUser as logoutUserUtil
} from '@/utils/auth';
import { useToast } from '../hooks/use-toast';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: () => void;
  handleLogout: () => void;
  handleRegister: () => void;
  performLogin: (username: string, password: string) => void;
  performRegistration: (username: string, name: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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

  const performLogin = async (username: string, password: string) => {
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

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isRegisterModalOpen,
      setIsRegisterModalOpen,
      handleLogin,
      handleLogout,
      handleRegister,
      performLogin,
      performRegistration
    }}>
      {children}
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
