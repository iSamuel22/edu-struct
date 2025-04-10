import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

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

  const handleStepChange = (step: number) => {
    onStepChange(step);
    window.scrollTo(0, 0);
  };

  // Check if we need to show scroll arrows
  useEffect(() => {
    const checkScrollable = () => {
      if (navRef.current) {
        const { scrollWidth, clientWidth } = navRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, [steps]);

  // Desktop layout - full width tabs
  if (!isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border z-20">
        <div className="container mx-auto py-2 px-4">
          <nav className="flex items-center justify-between flex-wrap gap-1">
            {steps.map((step, index) => (
              <button
                key={index}
                data-step={index}
                onClick={() => handleStepChange(index)}
                className={`flex items-center gap-1.5 p-2 rounded transition-all duration-200 border
                  ${currentStep === index 
                    ? 'bg-primary text-primary-foreground font-medium border-primary'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground border-border'
                  }`}
                aria-label={`Ir para ${step}`}
                title={step}
              >
                <span className="flex items-center justify-center">
                  {getStepIcon(step, index)}
                </span>
                <span className="text-xs whitespace-nowrap">
                  {step}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  }
  
  // Mobile layout - compact, scrollable
  return (
    <div className="glass fixed bottom-4 left-1/2 transform -translate-x-1/2 p-2 rounded-full shadow-lg z-20 w-[90%] border border-border">
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="p-2 rounded-full disabled:opacity-50 text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground transition-colors shrink-0 border border-border"
          aria-label="Etapa anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={navRef}
          className="flex items-center gap-1 px-2 overflow-x-auto hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {steps.map((step, index) => (
            <button
              key={index}
              data-step={index}
              onClick={() => handleStepChange(index)}
              className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-200 shrink-0 border ${
                currentStep === index
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-accent text-muted-foreground border-border'
              }`}
              aria-label={`Ir para ${step}`}
              title={step}
            >
              <span className="flex items-center justify-center">
                {getStepIcon(step, index)}
              </span>

              {/* Pill indicator for mobile */}
              <span
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary transition-transform duration-200 ${
                  currentStep === index ? 'scale-100' : 'scale-0'
                }`}
              ></span>

              {/* Step name for mobile */}
              <span className="ml-1 hidden sm:inline text-xs whitespace-nowrap">
                {step.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => handleStepChange(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="p-2 rounded-full disabled:opacity-50 text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground transition-colors shrink-0 border border-border"
          aria-label="Próxima etapa"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FormNavigation;
