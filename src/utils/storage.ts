import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

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
      totalHours: string;
      weeklyHours: string;
      theoreticalHours: string;
      practicalHours: string;
      inPersonHours: string;
      eixo: string;
      distanceHours: string;
    };
    syllabus: string;
    objectives: string;
    justification: string;
    extension: {
      hasExtension: boolean;
      justification: string;
      objectives: string;
      communityInvolvement: string;
      summary: string;
      type: string;
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
      professorSignature: string;
      coordinatorSignature: string;
      componentName: string;
      courseName: string;
      date: string;
    };
  };
}

// Define the structure for alert data
type AlertData = {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  onConfirm: () => void;
};

type PlanContextType = {
  // ... outros campos
  alertData: AlertData;
  setAlertData: React.Dispatch<React.SetStateAction<AlertData>>;
  closeAlert: () => void;
};

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
        totalHours: "",
        weeklyHours: "",
        theoreticalHours: "",
        practicalHours: "",
        inPersonHours: "",
        eixo: "",
        distanceHours: ""
      },
      syllabus: "",
      objectives: "",
      justification: "",
      extension: {
        hasExtension: false,
        justification: "",
        objectives: "",
        communityInvolvement: "",
        summary: "",
        type: "",
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
        professorSignature: "",
        coordinatorSignature: "",
        componentName: "",
        courseName: "",
        date: ""
      },
    },
  };
};

// Save a plan to Firestore
export const savePlan = async (plan: TeachingPlan): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    const planRef = doc(db, 'teachingPlans', plan.id);
    await setDoc(planRef, {
      ...plan,
      userId: currentUser.uid,
      lastUpdated: Date.now()
    });
  } catch (error) {
    console.error('Error saving plan:', error);
    throw new Error('Failed to save plan to Firestore');
  }
};

// Get all saved plans - versão otimizada
export const getAllPlans = async (): Promise<TeachingPlan[]> => {
  try {
    console.time('getAllPlans');
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('getAllPlans: No user logged in');
      return [];
    }

    console.log(`getAllPlans: Fetching plans for user ${currentUser.uid}`);
    
    // Cria uma referência de cache para evitar buscar os mesmos dados repetidamente
    const cacheKey = `plans_${currentUser.uid}`;
    const cachedPlans = sessionStorage.getItem(cacheKey);
    const lastFetch = sessionStorage.getItem(`${cacheKey}_timestamp`);
    
    // Usa cache se existir e tiver menos de 30 segundos
    if (cachedPlans && lastFetch && (Date.now() - parseInt(lastFetch)) < 30000) {
      console.log('getAllPlans: Using cached plans data');
      console.timeEnd('getAllPlans');
      return JSON.parse(cachedPlans);
    }

    // Otimiza a consulta para buscar apenas campos essenciais primeiro
    const plansRef = collection(db, 'teachingPlans');
    const q = query(plansRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    const plans = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TeachingPlan[];
    
    // Armazena no cache
    sessionStorage.setItem(cacheKey, JSON.stringify(plans));
    sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
    
    console.log(`getAllPlans: Retrieved ${plans.length} plans`);
    console.timeEnd('getAllPlans');
    return plans;
  } catch (error) {
    console.error('Error retrieving plans:', error);
    console.timeEnd('getAllPlans');
    return [];
  }
};

// Get a specific plan by ID
export const getPlanById = async (id: string): Promise<TeachingPlan | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    const planRef = doc(db, 'teachingPlans', id);
    const planDoc = await getDoc(planRef);
    
    if (planDoc.exists() && planDoc.data().userId === currentUser.uid) {
      return {
        id: planDoc.id,
        ...planDoc.data()
      } as TeachingPlan;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving plan:', error);
    return null;
  }
};

// Delete a plan
export const deletePlan = async (id: string): Promise<boolean> => {
  try {
    console.log(`Attempting to delete plan with ID: ${id}`);
    
    // Verificar login do usuário
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No user is currently logged in');
      return false;
    }

    // Referência para o documento no Firestore
    const planRef = doc(db, "teachingPlans", id);
    
    // Verificar se o plano existe antes de tentar excluí-lo
    const planDoc = await getDoc(planRef);
    
    if (!planDoc.exists()) {
      console.error(`Plan with ID ${id} does not exist`);
      return false;
    }
    
    // Verificar se o plano pertence ao usuário atual
    const planData = planDoc.data();
    if (planData.userId !== currentUser.uid) {
      console.error(`Plan with ID ${id} belongs to user ${planData.userId}, not current user ${currentUser.uid}`);
      return false;
    }
    
    // Excluir o plano
    console.log(`Deleting plan document from Firestore: ${id}`);
    await deleteDoc(planRef);
    
    // Verificar se a exclusão foi bem-sucedida
    const checkDoc = await getDoc(planRef);
    if (checkDoc.exists()) {
      console.error('Plan still exists after deletion attempt');
      return false;
    }
    
    console.log(`Successfully deleted plan with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting plan:', error);
    return false;
  }
};
