import React, { useState } from 'react';
import { ArrowRight, BookOpen, Users, Calendar } from 'lucide-react';

interface WelcomeScreenProps {
  onLoginClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginClick }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const features = [
    {
      icon: <BookOpen className="mb-2" />,
      title: "Planos de Aula",
      description: "Crie e gerencie seus planos de ensino com facilidade"
    },
    {
      icon: <Users className="mb-2" />,
      title: "Colaboração",
      description: "Compartilhe recursos com outros educadores"
    },
    {
      icon: <Calendar className="mb-2" />,
      title: "Cronograma",
      description: "Planeje todo o seu semestre letivo"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
            Bem-vindo ao <span className="text-indigo-600">EduCraft</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A plataforma completa para educadores criarem, organizarem e compartilharem 
            recursos didáticos de forma simples e eficiente.
          </p>
          <button 
            onClick={onLoginClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-300 flex items-center mx-auto"
          >
            Entrar no Sistema <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`text-indigo-600 flex justify-center text-3xl ${hoveredCard === index ? 'scale-110' : ''} transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 EduCraft - Plataforma para planejamento educacional</p>
          <div className="mt-2">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Privacidade</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;