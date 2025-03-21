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

// Get all saved plans
export const getAllPlans = async (): Promise<TeachingPlan[]> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return [];
    }

    const plansRef = collection(db, 'teachingPlans');
    const q = query(plansRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TeachingPlan[];
  } catch (error) {
    console.error('Error retrieving plans:', error);
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
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return false;
    }

    const planRef = doc(db, 'teachingPlans', id);
    const planDoc = await getDoc(planRef);
    
    if (planDoc.exists() && planDoc.data().userId === currentUser.uid) {
      await deleteDoc(planRef);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting plan:', error);
    return false;
  }
};
