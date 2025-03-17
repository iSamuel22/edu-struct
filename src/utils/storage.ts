import { getUserFromLocalStorage } from './auth'; // Ajuste o caminho conforme necessário

// Define the structure of our teaching plan
export interface TeachingPlan {
  updatedAt: string | number | Date;
  id: string;
  title: string;
  lastUpdated: number;
  data: {
    identification: {
      courseName: string;
      courseAbbreviation: string;
      professorName: string;
      siapeCode: string;
      totalHours: number;
      weeklyHours: number;
      theoreticalHours: number;
      practicalHours: number;
      inPersonHours: number;
    };
    syllabus: string;
    objectives: string;
    justification: string;
    extension: {
      hasExtension: boolean;
      justification: string;
      objectives: string;
      communityInvolvement: string;
    };
    content: {
      byPeriod: Array<{
        period: string;
        content: string;
        interdisciplinaryRelations: string;
      }>;
    };
    methodology: string;
    resources: string;
    visits: Array<{
      location: string;
      date: string;
      materials: string;
    }>;
    schedule: Array<{
      period: string;
      activities: Array<{
        date: string;
        teacherActivities: string;
        studentActivities: string;
      }>;
    }>;
    bibliography: {
      basic: string;
      complementary: string;
    };
    signatures: {
      signatories: any;
      date: any;
      location: string;
      professorName: string;
      coordinatorName: string;
      courseName: string;
    };
  };
}

// Create a new empty plan
export const createEmptyPlan = (): TeachingPlan => {
  return {
    id: Date.now().toString(),
    title: "Novo Plano de Ensino",
    lastUpdated: Date.now(),
    updatedAt: Date.now(),
    data: {
      identification: {
        courseName: "",
        courseAbbreviation: "",
        professorName: "",
        siapeCode: "",
        totalHours: 0,
        weeklyHours: 0,
        theoreticalHours: 0,
        practicalHours: 0,
        inPersonHours: 0,
      },
      syllabus: "",
      objectives: "",
      justification: "",
      extension: {
        hasExtension: false,
        justification: "",
        objectives: "",
        communityInvolvement: "",
      },
      content: {
        byPeriod: [
          {
            period: "1º Bimestre",
            content: "",
            interdisciplinaryRelations: "",
          },
        ],
      },
      methodology: "",
      resources: "",
      visits: [
        {
          location: "",
          date: "",
          materials: "",
        },
      ],
      schedule: [
        {
          period: "1º Bimestre",
          activities: [
            {
              date: "",
              teacherActivities: "",
              studentActivities: "",
            },
          ],
        },
      ],
      bibliography: {
        basic: "",
        complementary: "",
      },
      signatures: {
        professorName: "",
        coordinatorName: "",
        courseName: "",
        signatories: undefined,
        date: undefined,
        location: ""
      },
    },
  };
};

// Save a plan to localStorage
export const savePlan = (plan: TeachingPlan): void => {
  try {
    const currentUser = getUserFromLocalStorage();
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }
    const userId = currentUser.id;

    // Update the lastUpdated timestamp
    plan.lastUpdated = Date.now();

    // Get existing plans for the user
    const existingPlansJSON = localStorage.getItem(`teachingPlans_${userId}`);
    const existingPlans: TeachingPlan[] = existingPlansJSON
      ? JSON.parse(existingPlansJSON)
      : [];

    // Check if plan already exists
    const existingPlanIndex = existingPlans.findIndex(p => p.id === plan.id);

    if (existingPlanIndex >= 0) {
      // Update existing plan
      existingPlans[existingPlanIndex] = plan;
    } else {
      // Add new plan
      existingPlans.push(plan);
    }

    // Save updated plans
    localStorage.setItem(`teachingPlans_${userId}`, JSON.stringify(existingPlans));
  } catch (error) {
    console.error('Error saving plan:', error);
    throw new Error('Failed to save plan to local storage');
  }
};

// Get all saved plans
export const getAllPlans = (): TeachingPlan[] => {
  try {
    const currentUser = getUserFromLocalStorage();
    if (!currentUser) {
      console.error('No user is currently logged in');
      return []; // Retorna uma lista vazia se não houver usuário logado
    }
    const userId = currentUser.id;
    const plansJSON = localStorage.getItem(`teachingPlans_${userId}`);
    return plansJSON ? JSON.parse(plansJSON) : [];
  } catch (error) {
    console.error('Error retrieving plans:', error);
    return [];
  }
};

// Get a specific plan by ID
export const getPlanById = (id: string): TeachingPlan | null => {
  try {
    const currentUser = getUserFromLocalStorage();
    if (!currentUser) {
      console.error('No user is currently logged in');
      return null; // Retorna null se não houver usuário logado
    }
    const userId = currentUser.id;
    const plans = getAllPlans();
    return plans.find(plan => plan.id === id) || null;
  } catch (error) {
    console.error('Error retrieving plan:', error);
    return null;
  }
};

// Delete a plan
export const deletePlan = (id: string): boolean => {
  try {
    const currentUser = getUserFromLocalStorage();
    if (!currentUser) {
      console.error('No user is currently logged in');
      return false; // Retorna false se não houver usuário logado
    }
    const userId = currentUser.id;
    const plans = getAllPlans();
    const updatedPlans = plans.filter(plan => plan.id !== id);
    localStorage.setItem(`teachingPlans_${userId}`, JSON.stringify(updatedPlans));
    return true;
  } catch (error) {
    console.error('Error deleting plan:', error);
    return false;
  }
};
