import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AuthContext from './components/AuthContext';
import { COLORS } from './constants/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background
      }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Redirect based on authentication status
  if (!isAuthenticated) {
    return <Redirect href="/components/LoginScreen" />;
  }

  return <Redirect href="/(tabs)" />;
}