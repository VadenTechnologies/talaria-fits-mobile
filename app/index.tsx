import { Redirect } from 'expo-router';
import { useContext } from 'react';
import AuthContext from './components/AuthContext';

export default function Index() {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Redirect href="/components/LoginScreen" />;
  }
  
  return <Redirect href="/(tabs)" />;
} 