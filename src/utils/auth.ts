
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

// Get all users
export const getAllUsers = (): User[] => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

// Register new user
export const registerUser = (username: string, name: string, password: string): User | null => {
  // Get existing users
  const users = getAllUsers();
  
  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return null;
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    username,
    name
  };
  
  // Add user to storage with password
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // Store password separately (in real app, this would be hashed)
  localStorage.setItem(`password_${username}`, password);
  
  return newUser;
};

// Authenticate user
export const loginUser = (username: string, password: string): User | null => {
  // Get stored password
  const storedPassword = localStorage.getItem(`password_${username}`);
  
  // For admin user
  if (username === 'admin' && password === 'admin123') {
    return DEFAULT_ADMIN;
  }
  
  // For other users
  if (storedPassword === password) {
    const users = getAllUsers();
    return users.find(user => user.username === username) || null;
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
