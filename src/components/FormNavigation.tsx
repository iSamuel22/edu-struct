import React, { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  FileText,
  BookOpen,
  Target,
  Lightbulb,
  Users,
  ListChecks,
  Presentation,
  Monitor,
  MapPin,
  Calendar,
  Library,
  Pen
} from 'lucide-react';

interface FormNavigationProps {
  steps: string[];
  currentStep: number;
  onStepChange: Dispatch<SetStateAction<number>>;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  steps,
  currentStep,
  onStepChange
}) => {
  const getStepIcon = (step: string, index: number) => {
    const icons = {
      "Identificação": <FileText size={16} />,
      "Ementa": <BookOpen size={16} />,
      "Objetivos": <Target size={16} />,
      "Justificativa": <Lightbulb size={16} />,
      "Extensão": <Users size={16} />,
      "Conteúdo": <ListChecks size={16} />,
      "Metodologia": <Presentation size={16} />,
      "Recursos": <Monitor size={16} />,
      "Visitas": <MapPin size={16} />,
      "Cronograma": <Calendar size={16} />,
      "Bibliografia": <Library size={16} />,
      "Assinaturas": <Pen size={16} />
    };
    
    // Using the step name to find the icon, or default to index+1
    const stepName = Object.keys(icons).find(key => step.includes(key));
    return stepName ? icons[stepName as keyof typeof icons] : index + 1;
  };

  return (
    <div className="glass fixed bottom-4 left-1/2 transform -translate-x-1/2 p-2 rounded-full shadow-lg z-20">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="p-2 rounded-full disabled:opacity-50 text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground transition-colors"
          aria-label="Etapa anterior"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1 px-2 overflow-x-auto hide-scrollbar">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => onStepChange(index)}
              className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
                currentStep === index
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-muted-foreground'
              }`}
              aria-label={`Ir para ${step}`}
              title={step}
            >
              {getStepIcon(step, index)}
              
              {/* Pill indicator for mobile */}
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary transform scale-0 transition-transform duration-200 md:hidden"
                style={{ transform: currentStep === index ? 'scale(1)' : 'scale(0)' }}
              ></span>
              
              {/* Step name for larger screens */}
              <span className="ml-1 hidden md:inline text-xs whitespace-nowrap">
                {step}
              </span>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="p-2 rounded-full disabled:opacity-50 text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground transition-colors"
          aria-label="Próxima etapa"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FormNavigation;
