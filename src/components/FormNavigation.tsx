import React, { Dispatch, SetStateAction, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Pen,
  Menu
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    const stepName = Object.keys(icons).find(key => step.includes(key));
    return stepName ? icons[stepName as keyof typeof icons] : index + 1;
  };

  const getMobileStepText = () => {
    return `${currentStep + 1}/${steps.length}`;
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
        <div className="flex flex-col items-center">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-full mb-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="py-2 max-h-[60vh] overflow-y-auto">
                  {steps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onStepChange(index);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        currentStep === index
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex-shrink-0">{getStepIcon(step, index)}</span>
                      <span className="text-left">{step}</span>
                      {currentStep === index && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-primary ml-auto"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 bg-white rounded-full shadow-lg p-2">
            <button
              onClick={() => onStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-full disabled:opacity-50 text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground transition-colors"
              aria-label="Etapa anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-1"
            >
              <span className="text-sm font-medium">{getMobileStepText()}</span>
              <Menu size={16} />
            </button>

            <button
              onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="p-2 rounded-full disabled:opacity-50 text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground transition-colors"
              aria-label="Próxima etapa"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 hidden md:block">
        <div className="glass p-2 rounded-full shadow-lg">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-full disabled:opacity-50 text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground transition-colors"
              aria-label="Etapa anterior"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1 px-2">
              {steps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => onStepChange(index)}
                  className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
                    currentStep === index
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-muted-foreground'
                  }`}
                  aria-label={`Ir para ${step}`}
                  title={step}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getStepIcon(step, index)}
                  <span className="ml-2 text-xs whitespace-nowrap">
                    {step}
                  </span>
                </motion.button>
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
      </div>
    </>
  );
};

export default FormNavigation;
