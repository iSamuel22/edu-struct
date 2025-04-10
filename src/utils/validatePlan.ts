import { TeachingPlan } from '../utils/storage';
import { SectionStatus, ChecklistSummary } from '../types/checklist';

// Funções auxiliares para validação
const isEmpty = (value: string | unknown[] | undefined | null): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

const hasMinimumLength = (value: string, minLength: number): boolean => {
  return typeof value === 'string' && value.trim().length >= minLength;
};

// Validar a seção de identificação
export const validateIdentification = (identification: TeachingPlan['data']['identification']): SectionStatus => {
  const fields = [
    {
      id: 'courseName',
      name: 'Nome do Componente',
      isComplete: !isEmpty(identification.courseName),
      isRequired: true,
      isValid: hasMinimumLength(identification.courseName, 3),
      validationMessage: 'O nome do componente deve ter pelo menos 3 caracteres'
    },
    {
      id: 'professorName',
      name: 'Nome do Professor',
      isComplete: !isEmpty(identification.professorName),
      isRequired: true,
      isValid: hasMinimumLength(identification.professorName, 3),
      validationMessage: 'O nome do professor deve ter pelo menos 3 caracteres'
    },
    {
      id: 'totalHours',
      name: 'Carga Horária Total',
      isComplete: !isEmpty(identification.totalHours),
      isRequired: true,
      isValid: !isEmpty(identification.totalHours),
      validationMessage: 'A carga horária total é obrigatória'
    },
    {
      id: 'weeklyHours',
      name: 'Carga Horária Semanal',
      isComplete: !isEmpty(identification.weeklyHours),
      isRequired: true,
      isValid: !isEmpty(identification.weeklyHours),
      validationMessage: 'A carga horária semanal é obrigatória'
    },
    {
      id: 'eixo',
      name: 'Eixo',
      isComplete: !isEmpty(identification.eixo),
      isRequired: false,
      isValid: true,
      validationMessage: ''
    }
  ];

  const isComplete = fields.filter(f => f.isRequired).every(f => f.isComplete);
  const isValid = fields.filter(f => f.isRequired).every(f => f.isValid);

  return {
    id: 'identification',
    title: 'Identificação',
    isComplete,
    isRequired: true,
    isValid,
    fields
  };
};

// Validar a ementa
export const validateSyllabus = (syllabus: string): SectionStatus => {
  const isComplete = !isEmpty(syllabus);
  const isValid = hasMinimumLength(syllabus, 30);

  return {
    id: 'syllabus',
    title: 'Ementa',
    isComplete,
    isRequired: true,
    isValid: isComplete ? isValid : null,
    validationMessage: isValid ? '' : 'A ementa deve ter pelo menos 30 caracteres',
    fields: [
      {
        id: 'content',
        name: 'Conteúdo da Ementa',
        isComplete,
        isRequired: true,
        isValid: isComplete ? isValid : null,
        validationMessage: isValid ? '' : 'A ementa deve ter pelo menos 30 caracteres'
      }
    ]
  };
};

// Validar os objetivos
export const validateObjectives = (objectives: string): SectionStatus => {
  const isComplete = !isEmpty(objectives);
  const isValid = hasMinimumLength(objectives, 30);

  return {
    id: 'objectives',
    title: 'Objetivos',
    isComplete,
    isRequired: true,
    isValid: isComplete ? isValid : null,
    validationMessage: isValid ? '' : 'Os objetivos devem ter pelo menos 30 caracteres',
    fields: [
      {
        id: 'content',
        name: 'Conteúdo dos Objetivos',
        isComplete,
        isRequired: true,
        isValid: isComplete ? isValid : null,
        validationMessage: isValid ? '' : 'Os objetivos devem ter pelo menos 30 caracteres'
      }
    ]
  };
};

// Validar a justificativa
export const validateJustification = (justification: string): SectionStatus => {
  const isComplete = !isEmpty(justification);
  const isValid = hasMinimumLength(justification, 30);

  return {
    id: 'justification',
    title: 'Justificativa',
    isComplete,
    isRequired: false,
    isValid: isComplete ? isValid : null,
    validationMessage: isValid ? '' : 'A justificativa deve ter pelo menos 30 caracteres',
    fields: [
      {
        id: 'content',
        name: 'Conteúdo da Justificativa',
        isComplete,
        isRequired: false,
        isValid: isComplete ? isValid : null,
        validationMessage: isValid ? '' : 'A justificativa deve ter pelo menos 30 caracteres'
      }
    ]
  };
};

// Validar extensão
export const validateExtension = (extension: TeachingPlan['data']['extension']): SectionStatus => {
  let isComplete = true;
  let isValid = true;
  let fields = [];

  // Se há extensão, validamos os campos
  if (extension.hasExtension) {
    fields = [
      {
        id: 'type',
        name: 'Tipo de Atividade',
        isComplete: !isEmpty(extension.type),
        isRequired: true,
        isValid: !isEmpty(extension.type),
        validationMessage: 'O tipo de atividade é obrigatório quando há extensão'
      },
      {
        id: 'summary',
        name: 'Resumo',
        isComplete: !isEmpty(extension.summary),
        isRequired: true,
        isValid: hasMinimumLength(extension.summary, 10),
        validationMessage: 'O resumo deve ter pelo menos 10 caracteres'
      },
      {
        id: 'objectives',
        name: 'Objetivos',
        isComplete: !isEmpty(extension.objectives),
        isRequired: true,
        isValid: hasMinimumLength(extension.objectives, 10),
        validationMessage: 'Os objetivos devem ter pelo menos 10 caracteres'
      }
    ];

    isComplete = fields.filter(f => f.isRequired).every(f => f.isComplete);
    isValid = fields.filter(f => f.isRequired).every(f => f.isValid);
  } else {
    // Se não há extensão, consideramos completo e válido
    fields = [
      {
        id: 'hasExtension',
        name: 'Possui Extensão',
        isComplete: true,
        isRequired: false,
        isValid: true,
        validationMessage: ''
      }
    ];
  }

  return {
    id: 'extension',
    title: 'Atividades de Extensão',
    isComplete,
    isRequired: false,
    isValid,
    fields
  };
};

// Validar conteúdo programático
export const validateContent = (content: TeachingPlan['data']['content']): SectionStatus => {
  const hasPeriods = content.byPeriod && content.byPeriod.length > 0;
  const periodsWithContent = hasPeriods ? content.byPeriod.filter(p => !isEmpty(p.content)) : [];
  
  const isComplete = periodsWithContent.length > 0;
  const isValid = periodsWithContent.length > 0;

  const fields = hasPeriods 
    ? content.byPeriod.map((period, index) => ({
        id: `period-${index}`,
        name: `${period.period || `Período ${index + 1}`}`,
        isComplete: !isEmpty(period.content),
        isRequired: index === 0, // pelo menos o primeiro período é obrigatório
        isValid: !isEmpty(period.content),
        validationMessage: isEmpty(period.content) ? 'O conteúdo é obrigatório' : ''
      }))
    : [];

  return {
    id: 'content',
    title: 'Conteúdo Programático',
    isComplete,
    isRequired: true,
    isValid,
    fields,
    validationMessage: isValid ? '' : 'É necessário incluir conteúdo para pelo menos um período'
  };
};

// Validar metodologia
export const validateMethodology = (methodology: string): SectionStatus => {
  const isComplete = !isEmpty(methodology);
  const isValid = hasMinimumLength(methodology, 30);

  return {
    id: 'methodology',
    title: 'Metodologia',
    isComplete,
    isRequired: true,
    isValid: isComplete ? isValid : null,
    validationMessage: isValid ? '' : 'A metodologia deve ter pelo menos 30 caracteres',
    fields: [
      {
        id: 'content',
        name: 'Procedimentos Metodológicos',
        isComplete,
        isRequired: true,
        isValid: isComplete ? isValid : null,
        validationMessage: isValid ? '' : 'A metodologia deve ter pelo menos 30 caracteres'
      }
    ]
  };
};

// Validar recursos
export const validateResources = (resources: string): SectionStatus => {
  const isComplete = !isEmpty(resources);
  const isValid = hasMinimumLength(resources, 10);

  return {
    id: 'resources',
    title: 'Recursos',
    isComplete,
    isRequired: true,
    isValid: isComplete ? isValid : null,
    validationMessage: isValid ? '' : 'Os recursos devem ter pelo menos 10 caracteres',
    fields: [
      {
        id: 'content',
        name: 'Recursos e Infraestrutura',
        isComplete,
        isRequired: true,
        isValid: isComplete ? isValid : null,
        validationMessage: isValid ? '' : 'Os recursos devem ter pelo menos 10 caracteres'
      }
    ]
  };
};

// Validar visitas
export const validateVisits = (visits: TeachingPlan['data']['visits']): SectionStatus => {
  // Visitas não são obrigatórias, mas se tiver alguma, deve estar preenchida
  const hasVisits = visits && visits.length > 0;
  const completedVisits = hasVisits 
    ? visits.filter(v => !isEmpty(v.location) && !isEmpty(v.date))
    : [];
  
  const anyVisitIncomplete = hasVisits && visits.some(v => 
    (!isEmpty(v.location) && isEmpty(v.date)) || (isEmpty(v.location) && !isEmpty(v.date))
  );

  const isComplete = !anyVisitIncomplete;
  const isValid = isComplete;

  const fields = hasVisits 
    ? visits.map((visit, index) => ({
        id: `visit-${index}`,
        name: `Visita ${index + 1}`,
        isComplete: isEmpty(visit.location) && isEmpty(visit.date) || (!isEmpty(visit.location) && !isEmpty(visit.date)),
        isRequired: false,
        isValid: isEmpty(visit.location) && isEmpty(visit.date) || (!isEmpty(visit.location) && !isEmpty(visit.date)),
        validationMessage: !isEmpty(visit.location) && isEmpty(visit.date) || isEmpty(visit.location) && !isEmpty(visit.date) 
          ? 'Local e data devem ser ambos preenchidos ou ambos vazios'
          : ''
      }))
    : [{
        id: 'no-visits',
        name: 'Sem Visitas',
        isComplete: true,
        isRequired: false,
        isValid: true,
        validationMessage: ''
      }];

  return {
    id: 'visits',
    title: 'Visitas Técnicas',
    isComplete,
    isRequired: false,
    isValid,
    fields,
    validationMessage: isValid ? '' : 'Os dados das visitas estão incompletos'
  };
};

// Validar cronograma
export const validateSchedule = (schedule: TeachingPlan['data']['schedule']): SectionStatus => {
  const hasPeriods = schedule && schedule.length > 0;
  const hasActivities = hasPeriods && schedule.some(p => p.activities && p.activities.length > 0);
  
  let isComplete = hasPeriods && hasActivities;
  let isValid = isComplete;
  
  // Validação mais detalhada se houver períodos
  let fields: any[] = [];
  
  if (hasPeriods) {
    fields = schedule.map((period, periodIndex) => {
      const hasValidActivities = period.activities && period.activities.length > 0 && 
                                 period.activities.some(a => !isEmpty(a.date) && 
                                (!isEmpty(a.teacherActivities) || !isEmpty(a.studentActivities)));
      
      return {
        id: `period-${periodIndex}`,
        name: `${period.period || `Período ${periodIndex + 1}`}`,
        isComplete: hasValidActivities,
        isRequired: periodIndex === 0, // pelo menos o primeiro período é obrigatório
        isValid: hasValidActivities,
        validationMessage: hasValidActivities ? '' : 'É necessário incluir pelo menos uma atividade com data e conteúdo'
      };
    });
    
    isComplete = fields.filter(f => f.isRequired).every(f => f.isComplete);
    isValid = isComplete;
  } else {
    fields = [{
      id: 'no-schedule',
      name: 'Cronograma',
      isComplete: false,
      isRequired: true,
      isValid: false,
      validationMessage: 'É necessário incluir pelo menos um período com atividades'
    }];
  }

  return {
    id: 'schedule',
    title: 'Cronograma',
    isComplete,
    isRequired: true,
    isValid,
    fields,
    validationMessage: isValid ? '' : 'É necessário incluir pelo menos um período com atividades válidas'
  };
};

// Validar bibliografia
export const validateBibliography = (bibliography: TeachingPlan['data']['bibliography']): SectionStatus => {
  const hasBasic = !isEmpty(bibliography.basic);
  const hasComplementary = !isEmpty(bibliography.complementary);
  
  const isComplete = hasBasic; // Apenas a bibliografia básica é obrigatória
  const isValid = hasBasic && hasMinimumLength(bibliography.basic, 10);
  
  return {
    id: 'bibliography',
    title: 'Bibliografia',
    isComplete,
    isRequired: true,
    isValid: isComplete ? isValid : null,
    fields: [
      {
        id: 'basic',
        name: 'Bibliografia Básica',
        isComplete: hasBasic,
        isRequired: true,
        isValid: hasBasic ? hasMinimumLength(bibliography.basic, 10) : null,
        validationMessage: hasBasic && !hasMinimumLength(bibliography.basic, 10) 
          ? 'A bibliografia básica deve ter pelo menos 10 caracteres' 
          : ''
      },
      {
        id: 'complementary',
        name: 'Bibliografia Complementar',
        isComplete: hasComplementary,
        isRequired: false,
        isValid: true, // Bibliografia complementar não é obrigatória
        validationMessage: ''
      }
    ],
    validationMessage: isValid ? '' : 'A bibliografia básica é obrigatória e deve ter conteúdo suficiente'
  };
};

// Validar assinaturas
export const validateSignatures = (signatures: TeachingPlan['data']['signatures']): SectionStatus => {
  const fields = [
    {
      id: 'professorSignature',
      name: 'Assinatura do Professor',
      isComplete: !isEmpty(signatures.professorSignature),
      isRequired: true,
      isValid: !isEmpty(signatures.professorSignature),
      validationMessage: 'A assinatura do professor é obrigatória'
    },
    {
      id: 'coordinatorSignature',
      name: 'Assinatura do Coordenador',
      isComplete: !isEmpty(signatures.coordinatorSignature),
      isRequired: false,
      isValid: true,
      validationMessage: ''
    },
    {
      id: 'date',
      name: 'Data/Ano',
      isComplete: !isEmpty(signatures.date),
      isRequired: true,
      isValid: !isEmpty(signatures.date),
      validationMessage: 'A data/ano é obrigatória'
    }
  ];

  const isComplete = fields.filter(f => f.isRequired).every(f => f.isComplete);
  const isValid = fields.filter(f => f.isRequired).every(f => f.isValid);

  return {
    id: 'signatures',
    title: 'Assinaturas',
    isComplete,
    isRequired: true,
    isValid,
    fields,
    validationMessage: isValid ? '' : 'Informações de assinatura incompletas'
  };
};

// Função principal para validar todo o plano
export const validatePlan = (plan: TeachingPlan): SectionStatus[] => {
  return [
    validateIdentification(plan.data.identification),
    validateSyllabus(plan.data.syllabus),
    validateObjectives(plan.data.objectives),
    validateJustification(plan.data.justification),
    validateExtension(plan.data.extension),
    validateContent(plan.data.content),
    validateMethodology(plan.data.methodology),
    validateResources(plan.data.resources),
    validateVisits(plan.data.visits),
    validateSchedule(plan.data.schedule),
    validateBibliography(plan.data.bibliography),
    validateSignatures(plan.data.signatures)
  ];
};

// Calcular o resumo do checklist
export const calculateChecklistSummary = (sections: SectionStatus[]): ChecklistSummary => {
  const totalSections = sections.length;
  const completedSections = sections.filter(s => s.isComplete).length;
  
  const requiredSections = sections.filter(s => s.isRequired);
  const totalRequiredSections = requiredSections.length;
  const completedRequiredSections = requiredSections.filter(s => s.isComplete).length;

  const isValid = requiredSections.every(s => s.isValid);
  
  const completionPercentage = totalRequiredSections > 0
    ? Math.round((completedRequiredSections / totalRequiredSections) * 100)
    : 0;

  return {
    completedSections,
    totalSections,
    completedRequiredSections,
    totalRequiredSections,
    isValid,
    completionPercentage
  };
};