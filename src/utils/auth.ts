// src/utils/auth.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface User {
  id: string;
  username: string;
  name: string;
}

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: userCredential.user.uid,
      username: email,
      name: userCredential.user.displayName || email
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const registerUser = async (email: string, password: string, name: string): Promise<User | null> => {
  try {
    console.log('Iniciando registro de usuário:', { email, name });
    
    // Validar email
    if (!email || !email.includes('@')) {
      throw new Error('Formato de usuário inválido. Use um email válido.');
    }

    // Validar senha
    if (!password || password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    console.log('Criando usuário no Firebase...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Usuário criado com sucesso:', userCredential.user.uid);
    
    console.log('Atualizando perfil do usuário...');
    await updateProfile(userCredential.user, {
      displayName: name
    });
    console.log('Perfil atualizado com sucesso');
    
    return {
      id: userCredential.user.uid,
      username: email,
      name: name
    };
  } catch (error: any) {
    console.error('Erro detalhado no registro:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este usuário já está cadastrado.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Formato de usuário inválido. Use um email válido.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    } else {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
};