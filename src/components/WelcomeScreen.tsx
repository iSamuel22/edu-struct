
import React from 'react';

interface WelcomeScreenProps {
  onLoginClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginClick }) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Bem-vindo ao EduCraft</h2>
      <p className="text-muted-foreground mb-8">
        Faça login para criar, editar e gerenciar seus planos de ensino.
      </p>
      <button 
        onClick={onLoginClick}
        className="btn btn-primary text-lg px-8 py-3"
      >
        Entrar no Sistema
      </button>
    </div>
  );
};

export default WelcomeScreen;
