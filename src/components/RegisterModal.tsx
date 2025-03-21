import React, { useState } from 'react';
import { X, UserPlus } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (username: string, name: string, password: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !name.trim() || !password.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!username.includes('@')) {
      toast({
        title: "Erro",
        description: "O usuário deve ser um email válido (exemplo@dominio.com)",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    onRegister(username, name, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg w-full max-w-md shadow-xl animate-scale-in p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registro</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="input-label">Usuário</label>
            <input
              id="username"
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label htmlFor="name" className="input-label">Nome Completo</label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="input-label">Senha</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="input-label">Confirmar Senha</label>
            <input
              id="confirm-password"
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            <span>Registrar</span>
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline"
            >
              Fazer login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
