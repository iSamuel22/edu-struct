import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import FormNavigation from '@/components/FormNavigation';
import FormStepWrapper from '@/components/FormStepWrapper';
import LoginModal from '@/components/LoginModal';
import DeletePlanModal from '@/components/DeletePlanModal';
import { 
  createEmptyPlan, 
  savePlan, 
  getAllPlans,
  deletePlan, 
  TeachingPlan
} from '@/utils/storage';
import {
  initializeUsers,
  loginUser,
  saveUserToLocalStorage,
  getUserFromLocalStorage,
  logoutUser,
  User
} from '@/utils/auth';
import { exportAsTxt, exportAsPdf } from '@/utils/export';
import { PlusCircle, Trash2, X, Check, FileDown } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [plan, setPlan] = useState<TeachingPlan>(createEmptyPlan());
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState<TeachingPlan[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const steps = [
    "1. Identificação",
    "2. Ementa",
    "3. Objetivos",
    "4. Justificativa",
    "5. Extensão",
    "6. Conteúdo",
    "7. Metodologia",
    "8. Recursos",
    "9. Visitas",
    "10. Cronograma",
    "11. Bibliografia",
    "12. Assinaturas"
  ];

  useEffect(() => {
    initializeUsers();
    
    const user = getUserFromLocalStorage();
    if (user) {
      setCurrentUser(user);
    }
    
    setSavedPlans(getAllPlans());
  }, []);

  const handleNewPlan = () => {
    if (confirm("Criar um novo plano? Todas as alterações não salvas serão perdidas.")) {
      setPlan(createEmptyPlan());
      setCurrentStep(0);
      toast({
        title: "Novo plano criado",
        description: "Comece preenchendo as informações de identificação.",
      });
    }
  };

  const handleLoadPlan = () => {
    setSavedPlans(getAllPlans());
    setIsLoadModalOpen(true);
  };

  const handleSelectPlan = (selectedPlan: TeachingPlan) => {
    setPlan(selectedPlan);
    setIsLoadModalOpen(false);
    setCurrentStep(0);
    toast({
      title: "Plano carregado",
      description: `"${selectedPlan.title}" foi carregado com sucesso.`,
    });
  };

  const handleSavePlan = () => {
    try {
      if (plan.title === "Novo Plano de Ensino") {
        const newTitle = prompt("Digite um título para o plano:", plan.title);
        if (newTitle) {
          setPlan(prev => ({ ...prev, title: newTitle }));
          savePlan({ ...plan, title: newTitle });
        } else {
          savePlan(plan);
        }
      } else {
        savePlan(plan);
      }
      
      toast({
        title: "Plano salvo",
        description: "Seu plano de ensino foi salvo com sucesso.",
      });
      
      setSavedPlans(getAllPlans());
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleExportPlan = () => {
    try {
      exportAsTxt(plan);
      toast({
        title: "Plano exportado",
        description: "Seu plano de ensino foi exportado como arquivo de texto.",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleExportPlanAsPdf = () => {
    try {
      exportAsPdf(plan);
      toast({
        title: "Plano exportado",
        description: "Seu plano de ensino foi exportado como arquivo PDF.",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar o plano como PDF. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlan = () => {
    try {
      const success = deletePlan(plan.id);
      if (success) {
        toast({
          title: "Plano excluído",
          description: `O plano "${plan.title}" foi excluído com sucesso.`,
        });
        
        setPlan(createEmptyPlan());
        setSavedPlans(getAllPlans());
        setIsDeleteModalOpen(false);
      } else {
        throw new Error("Falha ao excluir o plano");
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair? Todas as alterações não salvas serão perdidas.")) {
      logoutUser();
      setCurrentUser(null);
      setPlan(createEmptyPlan());
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso.",
      });
    }
  };

  const performLogin = (username: string, password: string) => {
    const user = loginUser(username, password);
    if (user) {
      saveUserToLocalStorage(user);
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

  const updateField = (path: string, value: any) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as any;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!currentObj[part]) currentObj[part] = {};
        currentObj = currentObj[part];
      }
      
      const fieldName = pathParts[pathParts.length - 1];
      currentObj[fieldName] = value;
      
      return newPlan;
    });
  };

  const addItemToArray = (path: string, item: any) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as any;
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (!currentObj[part]) {
          if (i === pathParts.length - 1) {
            currentObj[part] = [];
          } else {
            currentObj[part] = {};
          }
        }
        currentObj = currentObj[part];
      }
      
      currentObj.push(item);
      
      return newPlan;
    });
  };

  const removeItemFromArray = (path: string, index: number) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      
      const pathParts = path.split('.');
      
      let currentObj = newPlan as any;
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        currentObj = currentObj[part];
      }
      
      currentObj.splice(index, 1);
      
      return newPlan;
    });
  };

  const canDeletePlan = plan.id !== createEmptyPlan().id && 
                       savedPlans.some(savedPlan => savedPlan.id === plan.id);

  return (
    <div className="min-h-screen pb-24">
      <Header
        onNewPlan={handleNewPlan}
        onLoadPlan={handleLoadPlan}
        onSavePlan={handleSavePlan}
        onExportPlan={handleExportPlan}
        onExportPlanAsPdf={handleExportPlanAsPdf}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
        onDeleteClick={handleDeletePlan}
        currentUser={currentUser}
        canDelete={canDeletePlan}
      />
      
      {!currentUser ? (
        <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo ao EduCraft</h2>
          <p className="text-muted-foreground mb-8">
            Faça login para criar, editar e gerenciar seus planos de ensino.
          </p>
          <button 
            onClick={handleLogin}
            className="btn btn-primary text-lg px-8 py-3"
          >
            Entrar no Sistema
          </button>
        </div>
      ) : (
        <main className="container max-w-4xl mx-auto px-4">
          <div className="mb-16">
            <FormStepWrapper 
              title="Identificação do Componente Curricular" 
              isActive={currentStep === 0}
              description="Informações básicas do componente curricular."
            >
              <div className="form-section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="courseName" className="input-label">Nome do Componente</label>
                    <input
                      type="text"
                      id="courseName"
                      className="input-field"
                      value={plan.data.identification.courseName}
                      onChange={(e) => updateField('data.identification.courseName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="courseAbbreviation" className="input-label">Abreviatura</label>
                    <input
                      type="text"
                      id="courseAbbreviation"
                      className="input-field"
                      value={plan.data.identification.courseAbbreviation}
                      onChange={(e) => updateField('data.identification.courseAbbreviation', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="professorName" className="input-label">Nome do Professor</label>
                    <input
                      type="text"
                      id="professorName"
                      className="input-field"
                      value={plan.data.identification.professorName}
                      onChange={(e) => updateField('data.identification.professorName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="siapeCode" className="input-label">Matrícula SIAPE</label>
                    <input
                      type="text"
                      id="siapeCode"
                      className="input-field"
                      value={plan.data.identification.siapeCode}
                      onChange={(e) => updateField('data.identification.siapeCode', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label htmlFor="totalHours" className="input-label">Carga Horária Total</label>
                    <input
                      type="number"
                      id="totalHours"
                      className="input-field"
                      value={plan.data.identification.totalHours}
                      onChange={(e) => updateField('data.identification.totalHours', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="weeklyHours" className="input-label">Carga Horária Semanal</label>
                    <input
                      type="number"
                      id="weeklyHours"
                      className="input-field"
                      value={plan.data.identification.weeklyHours}
                      onChange={(e) => updateField('data.identification.weeklyHours', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inPersonHours" className="input-label">Carga Horária Presencial</label>
                    <input
                      type="number"
                      id="inPersonHours"
                      className="input-field"
                      value={plan.data.identification.inPersonHours}
                      onChange={(e) => updateField('data.identification.inPersonHours', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="theoreticalHours" className="input-label">Carga Horária Teórica</label>
                    <input
                      type="number"
                      id="theoreticalHours"
                      className="input-field"
                      value={plan.data.identification.theoreticalHours}
                      onChange={(e) => updateField('data.identification.theoreticalHours', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="practicalHours" className="input-label">Carga Horária Prática</label>
                    <input
                      type="number"
                      id="practicalHours"
                      className="input-field"
                      value={plan.data.identification.practicalHours}
                      onChange={(e) => updateField('data.identification.practicalHours', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Ementa" 
              isActive={currentStep === 1}
              description="Descrição sucinta dos tópicos a serem abordados."
            >
              <div className="form-section">
                <label htmlFor="syllabus" className="input-label">Ementa do Componente Curricular</label>
                <textarea
                  id="syllabus"
                  className="input-field min-h-[200px]"
                  value={plan.data.syllabus}
                  onChange={(e) => updateField('data.syllabus', e.target.value)}
                  placeholder="Descreva a ementa do componente curricular..."
                ></textarea>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Objetivos do Componente Curricular" 
              isActive={currentStep === 2}
              description="Definição dos objetivos gerais e específicos."
            >
              <div className="form-section">
                <label htmlFor="objectives" className="input-label">Objetivos</label>
                <textarea
                  id="objectives"
                  className="input-field min-h-[200px]"
                  value={plan.data.objectives}
                  onChange={(e) => updateField('data.objectives', e.target.value)}
                  placeholder="Descreva os objetivos gerais e específicos..."
                ></textarea>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Justificativa da Modalidade de Ensino" 
              isActive={currentStep === 3}
              description="Motivação para a escolha da modalidade de ensino."
            >
              <div className="form-section">
                <label htmlFor="justification" className="input-label">Justificativa</label>
                <textarea
                  id="justification"
                  className="input-field min-h-[200px]"
                  value={plan.data.justification}
                  onChange={(e) => updateField('data.justification', e.target.value)}
                  placeholder="Descreva a justificativa da modalidade de ensino..."
                ></textarea>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Atividades Curriculares de Extensão" 
              isActive={currentStep === 4}
              description="Informações sobre atividades de extensão."
            >
              <div className="form-section">
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plan.data.extension.hasExtension}
                      onChange={(e) => updateField('data.extension.hasExtension', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Este componente curricular possui atividades de extensão</span>
                  </label>
                </div>
                
                {plan.data.extension.hasExtension && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="extensionJustification" className="input-label">Justificativa</label>
                      <textarea
                        id="extensionJustification"
                        className="input-field"
                        value={plan.data.extension.justification}
                        onChange={(e) => updateField('data.extension.justification', e.target.value)}
                        placeholder="Justifique as atividades de extensão..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="extensionObjectives" className="input-label">Objetivos</label>
                      <textarea
                        id="extensionObjectives"
                        className="input-field"
                        value={plan.data.extension.objectives}
                        onChange={(e) => updateField('data.extension.objectives', e.target.value)}
                        placeholder="Descreva os objetivos das atividades de extensão..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="communityInvolvement" className="input-label">Envolvimento com a Comunidade</label>
                      <textarea
                        id="communityInvolvement"
                        className="input-field"
                        value={plan.data.extension.communityInvolvement}
                        onChange={(e) => updateField('data.extension.communityInvolvement', e.target.value)}
                        placeholder="Descreva como a comunidade será envolvida..."
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Conteúdo Programático" 
              isActive={currentStep === 5}
              description="Organização dos conteúdos por período."
            >
              <div className="form-section">
                {plan.data.content.byPeriod.map((period, index) => (
                  <div key={index} className="mb-6 pb-6 border-b border-border last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">Período #{index + 1}</h3>
                      {plan.data.content.byPeriod.length > 1 && (
                        <button
                          onClick={() => removeItemFromArray('data.content.byPeriod', index)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          aria-label="Remover período"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`period-name-${index}`} className="input-label">Nome do Período</label>
                        <input
                          type="text"
                          id={`period-name-${index}`}
                          className="input-field"
                          value={period.period}
                          onChange={(e) => {
                            const updatedPeriods = [...plan.data.content.byPeriod];
                            updatedPeriods[index].period = e.target.value;
                            updateField('data.content.byPeriod', updatedPeriods);
                          }}
                          placeholder="Ex: 1º Bimestre, Módulo 1, etc."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`period-content-${index}`} className="input-label">Conteúdo</label>
                        <textarea
                          id={`period-content-${index}`}
                          className="input-field"
                          value={period.content}
                          onChange={(e) => {
                            const updatedPeriods = [...plan.data.content.byPeriod];
                            updatedPeriods[index].content = e.target.value;
                            updateField('data.content.byPeriod', updatedPeriods);
                          }}
                          placeholder="Descreva o conteúdo para este período..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor={`interdisciplinary-${index}`} className="input-label">Relações Interdisciplinares</label>
                        <textarea
                          id={`interdisciplinary-${index}`}
                          className="input-field"
                          value={period.interdisciplinaryRelations}
                          onChange={(e) => {
                            const updatedPeriods = [...plan.data.content.byPeriod];
                            updatedPeriods[index].interdisciplinaryRelations = e.target.value;
                            updateField('data.content.byPeriod', updatedPeriods);
                          }}
                          placeholder="Descreva as relações com outras disciplinas..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => addItemToArray('data.content.byPeriod', {
                    period: `Período ${plan.data.content.byPeriod.length + 1}`,
                    content: "",
                    interdisciplinaryRelations: ""
                  })}
                  className="btn btn-outline flex items-center gap-2 mt-4"
                  aria-label="Adicionar período"
                >
                  <PlusCircle size={16} />
                  <span>Adicionar Período</span>
                </button>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Procedimentos Metodológicos" 
              isActive={currentStep === 6}
              description="Métodos e estratégias de ensino."
            >
              <div className="form-section">
                <label htmlFor="methodology" className="input-label">Procedimentos Metodológicos</label>
                <textarea
                  id="methodology"
                  className="input-field min-h-[200px]"
                  value={plan.data.methodology}
                  onChange={(e) => updateField('data.methodology', e.target.value)}
                  placeholder="Descreva os procedimentos metodológicos..."
                ></textarea>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Recursos e Infraestrutura" 
              isActive={currentStep === 7}
              description="Equipamentos, materiais e espaços necessários."
            >
              <div className="form-section">
                <label htmlFor="resources" className="input-label">Recursos e Infraestrutura</label>
                <textarea
                  id="resources"
                  className="input-field min-h-[200px]"
                  value={plan.data.resources}
                  onChange={(e) => updateField('data.resources', e.target.value)}
                  placeholder="Descreva os recursos e infraestrutura necessários..."
                ></textarea>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Visitas Técnicas e Aulas Práticas" 
              isActive={currentStep === 8}
              description="Planejamento de visitas e aulas em campo."
            >
              <div className="form-section">
                {plan.data.visits.map((visit, index) => (
                  <div key={index} className="mb-6 pb-6 border-b border-border last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">Visita #{index + 1}</h3>
                      {plan.data.visits.length > 1 && (
                        <button
                          onClick={() => removeItemFromArray('data.visits', index)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          aria-label="Remover visita"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`visit-location-${index}`} className="input-label">Local</label>
                        <input
                          type="text"
                          id={`visit-location-${index}`}
                          className="input-field"
                          value={visit.location}
                          onChange={(e) => {
                            const updatedVisits = [...plan.data.visits];
                            updatedVisits[index].location = e.target.value;
                            updateField('data.visits', updatedVisits);
                          }}
                          placeholder="Local da visita ou aula prática"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`visit-date-${index}`} className="input-label">Data Prevista</label>
                        <input
                          type="text"
                          id={`visit-date-${index}`}
                          className="input-field"
                          value={visit.date}
                          onChange={(e) => {
                            const updatedVisits = [...plan.data.visits];
                            updatedVisits[index].date = e.target.value;
                            updateField('data.visits', updatedVisits);
                          }}
                          placeholder="Data prevista (ex: 10/05/2023 ou Maio/2023)"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`visit-materials-${index}`} className="input-label">Materiais Necessários</label>
                        <textarea
                          id={`visit-materials-${index}`}
                          className="input-field"
                          value={visit.materials}
                          onChange={(e) => {
                            const updatedVisits = [...plan.data.visits];
                            updatedVisits[index].materials = e.target.value;
                            updateField('data.visits', updatedVisits);
                          }}
                          placeholder="Descreva os materiais necessários para a visita..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => addItemToArray('data.visits', {
                    location: "",
                    date: "",
                    materials: ""
                  })}
                  className="btn btn-outline flex items-center gap-2 mt-4"
                  aria-label="Adicionar visita"
                >
                  <PlusCircle size={16} />
                  <span>Adicionar Visita</span>
                </button>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Cronograma de Desenvolvimento" 
              isActive={currentStep === 9}
              description="Planejamento das atividades ao longo do período letivo."
            >
              <div className="form-section">
                {plan.data.schedule.map((period, periodIndex) => (
                  <div key={periodIndex} className="mb-8 pb-6 border-b border-border last:border-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Período: {period.period}</h3>
                      {plan.data.schedule.length > 1 && (
                        <button
                          onClick={() => removeItemFromArray('data.schedule', periodIndex)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          aria-label="Remover período"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor={`schedule-period-${periodIndex}`} className="input-label">Nome do Período</label>
                      <input
                        type="text"
                        id={`schedule-period-${periodIndex}`}
                        className="input-field"
                        value={period.period}
                        onChange={(e) => {
                          const updatedSchedule = [...plan.data.schedule];
                          updatedSchedule[periodIndex].period = e.target.value;
                          updateField('data.schedule', updatedSchedule);
                        }}
                        placeholder="Ex: 1º Bimestre, Módulo 1, etc."
                      />
                    </div>
                    
                    <h4 className="text-md font-medium mt-4 mb-2">Atividades</h4>
                    
                    {period.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="mb-4 p-4 bg-background rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Atividade #{activityIndex + 1}</h5>
                          {period.activities.length > 1 && (
                            <button
                              onClick={() => {
                                const updatedSchedule = [...plan.data.schedule];
                                updatedSchedule[periodIndex].activities.splice(activityIndex, 1);
                                updateField('data.schedule', updatedSchedule);
                              }}
                              className="text-destructive hover:text-destructive/80 transition-colors"
                              aria-label="Remover atividade"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label htmlFor={`activity-date-${periodIndex}-${activityIndex}`} className="input-label">Data</label>
                            <input
                              type="text"
                              id={`activity-date-${periodIndex}-${activityIndex}`}
                              className="input-field"
                              value={activity.date}
                              onChange={(e) => {
                                const updatedSchedule = [...plan.data.schedule];
                                updatedSchedule[periodIndex].activities[activityIndex].date = e.target.value;
                                updateField('data.schedule', updatedSchedule);
                              }}
                              placeholder="Data da atividade (ex: 10/05/2023)"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor={`teacher-activities-${periodIndex}-${activityIndex}`} className="input-label">Atividades do Docente</label>
                            <textarea
                              id={`teacher-activities-${periodIndex}-${activityIndex}`}
                              className="input-field"
                              value={activity.teacherActivities}
                              onChange={(e) => {
                                const updatedSchedule = [...plan.data.schedule];
                                updatedSchedule[periodIndex].activities[activityIndex].teacherActivities = e.target.value;
                                updateField('data.schedule', updatedSchedule);
                              }}
                              placeholder="Descreva as atividades do docente..."
                            ></textarea>
                          </div>
                          
                          <div>
                            <label htmlFor={`student-activities-${periodIndex}-${activityIndex}`} className="input-label">Atividades do Discente</label>
                            <textarea
                              id={`student-activities-${periodIndex}-${activityIndex}`}
                              className="input-field"
                              value={activity.studentActivities}
                              onChange={(e) => {
                                const updatedSchedule = [...plan.data.schedule];
                                updatedSchedule[periodIndex].activities[activityIndex].studentActivities = e.target.value;
                                updateField('data.schedule', updatedSchedule);
                              }}
                              placeholder="Descreva as atividades do discente..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => {
                        const updatedSchedule = [...plan.data.schedule];
                        updatedSchedule[periodIndex].activities.push({
                          date: "",
                          teacherActivities: "",
                          studentActivities: ""
                        });
                        updateField('data.schedule', updatedSchedule);
                      }}
                      className="btn btn-outline btn-sm flex items-center gap-2 mt-2"
                      aria-label="Adicionar atividade"
                    >
                      <PlusCircle size={14} />
                      <span>Adicionar Atividade</span>
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => addItemToArray('data.schedule', {
                    period: `Período ${plan.data.schedule.length + 1}`,
                    activities: [
                      {
                        date: "",
                        teacherActivities: "",
                        studentActivities: ""
                      }
                    ]
                  })}
                  className="btn btn-outline flex items-center gap-2 mt-4"
                  aria-label="Adicionar período"
                >
                  <PlusCircle size={16} />
                  <span>Adicionar Período</span>
                </button>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Bibliografia" 
              isActive={currentStep === 10}
              description="Referências bibliográficas básicas e complementares."
            >
              <div className="form-section">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="basic-bibliography" className="input-label">Bibliografia Básica</label>
                    <textarea
                      id="basic-bibliography"
                      className="input-field min-h-[150px]"
                      value={plan.data.bibliography.basic}
                      onChange={(e) => updateField('data.bibliography.basic', e.target.value)}
                      placeholder="Liste as referências bibliográficas básicas..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="complementary-bibliography" className="input-label">Bibliografia Complementar</label>
                    <textarea
                      id="complementary-bibliography"
                      className="input-field min-h-[150px]"
                      value={plan.data.bibliography.complementary}
                      onChange={(e) => updateField('data.bibliography.complementary', e.target.value)}
                      placeholder="Liste as referências bibliográficas complementares..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </FormStepWrapper>

            <FormStepWrapper 
              title="Assinaturas" 
              isActive={currentStep === 11}
              description="Informações para assinatura do documento."
            >
              <div className="form-section">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="signature-professor" className="input-label">Nome do Professor</label>
                    <input
                      type="text"
                      id="signature-professor"
                      className="input-field"
                      value={plan.data.signatures.professorName}
                      onChange={(e) => updateField('data.signatures.professorName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="signature-coordinator" className="input-label">Nome do Coordenador</label>
                    <input
                      type="text"
                      id="signature-coordinator"
                      className="input-field"
                      value={plan.data.signatures.coordinatorName}
                      onChange={(e) => updateField('data.signatures.coordinatorName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="signature-course" className="input-label">Nome do Curso</label>
                    <input
                      type="text"
                      id="signature-course"
                      className="input-field"
                      value={plan.data.signatures.courseName}
                      onChange={(e) => updateField('data.signatures.courseName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-8 p-6 border border-border rounded-md bg-muted/50">
                  <h3 className="text-lg font-medium mb-4">Exportar Plano de Ensino</h3>
                  <p className="text-muted-foreground mb-4">
                    Todos os campos obrigatórios foram preenchidos. Você pode exportar o plano de ensino.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleExportPlan}
                      className="btn btn-outline flex items-center gap-2"
                      aria-label="Exportar como TXT"
                    >
                      <FileDown size={16} />
                      <span>Exportar como TXT</span>
                    </button>
                    <button
                      onClick={handleExportPlanAsPdf}
                      className="btn btn-primary flex items-center gap-2"
                      aria-label="Exportar como PDF"
                    >
                      <FileDown size={16} />
                      <span>Exportar como PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </FormStepWrapper>
          </div>
        </main>
      )}
      
      <FormNavigation
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
      
      {isLoadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl animate-scale-in p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Carregar Plano</h2>
              <button
                onClick={() => setIsLoadModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            
            {savedPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Nenhum plano de ensino salvo.
                </p>
                <button
                  onClick={() => {
                    setIsLoadModalOpen(false);
                    handleNewPlan();
                  }}
                  className="btn btn-primary"
                >
                  Criar Novo Plano
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {savedPlans.map((savedPlan) => (
                  <button
                    key={savedPlan.id}
                    onClick={() => handleSelectPlan(savedPlan)}
                    className="w-full p-4 text-left rounded-md hover:bg-accent transition-colors flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{savedPlan.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Última modificação: {new Date(savedPlan.lastUpdated).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Check size={16} className="text-primary opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={performLogin}
      />

      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={confirmDeletePlan}
        planTitle={plan.title}
      />
    </div>
  );
};

export default Index;
