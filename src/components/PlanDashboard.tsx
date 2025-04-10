import React from 'react';
import { FileText, Upload, Plus, File, Calendar, Clock, LayoutGrid, BookOpen, Edit3 } from 'lucide-react';
import { TeachingPlan } from '@/utils/storage';
import { motion } from 'framer-motion';

interface PlanDashboardProps {
  savedPlans: TeachingPlan[];
  onNewPlan: () => void;
  onLoadPlan: () => void;
  onSelectPlan: (plan: TeachingPlan) => void;
  isLoading?: boolean; // Novo prop para indicar carregamento
}

const PlanDashboard: React.FC<PlanDashboardProps> = ({
  savedPlans,
  onNewPlan,
  onLoadPlan,
  onSelectPlan,
  isLoading = false
}) => {
  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 17 }
    }
  };

  return (
    <motion.div 
      className="container max-w-4xl mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Mostrar indicador de carregamento se estiver carregando */}
      {isLoading && (
        <motion.div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-card p-6 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Carregando seus planos...</span>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="flex flex-col items-center justify-center gap-8"
        variants={containerVariants}
      >
        <motion.div 
          className="text-center mb-6"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-2">
            Planos de Ensino
          </h1>
          <p className="text-muted-foreground">
            Crie, gerencie e organize seus planos de ensino de forma simples
          </p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-xl w-full max-w-2xl backdrop-blur-sm border border-border shadow-sm"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.div 
              className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={cardVariants}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Plus size={24} className="text-primary" />
                </div>
                <p className="text-lg font-medium">Criar um novo plano</p>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Comece do zero e crie um novo plano de ensino completo.
              </p>
              <motion.button
                className="btn btn-primary w-full"
                onClick={onNewPlan}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus size={18} />
                Novo Plano
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={cardVariants}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Upload size={24} className="text-primary" />
                </div>
                <p className="text-lg font-medium">Carregar planos</p>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Acesse seus planos salvos anteriormente.
              </p>
              <motion.button
                className="btn btn-outline-primary w-full"
                onClick={onLoadPlan}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FileText size={18} />
                Ver Todos os Planos
              </motion.button>
            </motion.div>
          </div>

          {savedPlans.length > 0 && (
            <motion.div
              className="mt-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-primary" />
                <h3 className="text-lg font-medium">Planos Recentes</h3>
              </div>
              
              <motion.div 
                className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                variants={containerVariants}
              >
                {savedPlans.slice(0, 5).map((savedPlan, index) => (
                  <motion.div 
                    key={savedPlan.id}
                    className="flex items-center gap-3 p-4 rounded-md hover:bg-accent cursor-pointer border border-border group"
                    onClick={() => onSelectPlan(savedPlan)}
                    variants={itemVariants}
                    whileHover={{
                      backgroundColor: "rgba(var(--accent-rgb), 0.2)",
                      borderColor: "rgba(var(--primary-rgb), 0.3)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <File size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{savedPlan.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>Atualizado: {formatDate(savedPlan.updatedAt)}</span>
                      </div>
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlan(savedPlan);
                      }}
                      className="p-2 rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                      title="Abrir plano"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit3 size={18} />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
              
              {savedPlans.length > 5 && (
                <motion.div 
                  className="text-center mt-4"
                  variants={itemVariants}
                >
                  <motion.button
                    className="btn btn-ghost text-primary text-sm"
                    onClick={onLoadPlan}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver todos os {savedPlans.length} planos
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        {savedPlans.length === 0 && (
          <motion.div 
            className="text-center py-8 text-muted-foreground"
            variants={itemVariants}
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Você ainda não tem planos salvos. Crie seu primeiro plano agora!</p>
          </motion.div>
        )}

        <motion.div 
          className="flex justify-center mt-6"
          variants={itemVariants}
        >
          <div className="text-xs text-muted-foreground">
            <p>© 2025 EduStruct • Organize seus planos de ensino facilmente</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PlanDashboard;