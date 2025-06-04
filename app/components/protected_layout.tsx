import { useContext } from 'react';
import AuthContext from "./AuthContext";
import { Redirect } from 'expo-router';
import LoginScreen from './LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import SneakerIcon from '@/components/SneakerIcon';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProtectedLayout() {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  return <Redirect href="/(tabs)" />;
}
