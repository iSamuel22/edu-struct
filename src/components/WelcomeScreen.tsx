import React from 'react';

interface WelcomeScreenProps {
  onLoginClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginClick }) => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <div className="max-w-lg w-full">
        <div className="glass p-6 sm:p-8 rounded-xl shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Bem-vindo ao EduCraft</h2>
          <p className="text-muted-foreground mb-8">
            Faça login para criar, editar e gerenciar seus planos de ensino.
          </p>
          <button 
            onClick={onLoginClick}
            className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3"
          >
            Entrar no Sistema
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
