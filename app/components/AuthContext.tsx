// AuthContext.tsx
import { createContext, useState, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name: string;
  sneakerSize: number;
  phoneNumber: string;
  birthday: string;
}

const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveUserData = async () => {
      setIsLoading(true); // Ensure loading is true at the start
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Explicitly set to not authenticated if no user is found
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setIsAuthenticated(false); // Assume not authenticated on error
      } finally {
        setIsLoading(false);
      }
    };

    retrieveUserData();
  }, []); // Only run once on mount

  const value = {
    isAuthenticated,
    user,
    isLoading, // Add isLoading to the context value
    setUser: async (newUser: User | null) => {
      setIsLoading(true); // Set loading true during user update
      if (newUser) {
        try {
          await SecureStore.setItemAsync('user', JSON.stringify(newUser));
          setUser(newUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error storing user data:', error);
          // Optionally, revert isAuthenticated or handle error state
        }
      } else {
        try {
          await SecureStore.deleteItemAsync('user');
          setUser(null);
          setIsAuthenticated(false);
        } catch (error) {
          console.error('Error removing user data:', error);
        }
      }
      setIsLoading(false); // Set loading false after user update
    },
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;