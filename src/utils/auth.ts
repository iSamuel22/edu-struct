
// Simple user authentication for demonstration
// In a real application, this would be connected to a backend

// Define the User interface
export interface User {
  id: string;
  username: string;
  name: string;
}

// Simple user storage
const USERS_STORAGE_KEY = 'educraft_users';

// Default admin user
const DEFAULT_ADMIN: User = {
  id: '1',
  username: 'admin',
  name: 'Administrador'
};

// Initialize users if not exist
export const initializeUsers = (): void => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  if (!users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]));
  }
};

// Authenticate user
export const loginUser = (username: string, password: string): User | null => {
  // For simplicity, we're using a hardcoded password check
  // In a real application, this would involve secure authentication
  if (username === 'admin' && password === 'admin123') {
    return DEFAULT_ADMIN;
  }
  
  return null;
};

// Local storage key for the current user
const CURRENT_USER_KEY = 'educraft_current_user';

// Save user to local storage
export const saveUserToLocalStorage = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Get user from local storage
export const getUserFromLocalStorage = (): User | null => {
  const userJSON = localStorage.getItem(CURRENT_USER_KEY);
  return userJSON ? JSON.parse(userJSON) : null;
};

// Remove user from local storage (logout)
export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
