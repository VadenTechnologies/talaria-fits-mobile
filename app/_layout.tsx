import 'react-native-gesture-handler';
import { Stack, Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { COLORS } from './constants/theme';
import { StatusBar } from 'expo-status-bar';
import { MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from './components/AuthContext';
import { Provider } from 'react-redux';
import { store } from '@/hooks/store';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
  },
};

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="components/LoginScreen" />
      <Stack.Screen name="components/SignUpScreen" />
      <Stack.Screen name="components/VerificationScreen" />
      <Stack.Screen name="components/ShoeSizeScreen" />
      <Stack.Screen name="components/ProfileScreen" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="dark" />
          <RootLayoutNav />
        </PaperProvider>
      </AuthProvider>
    </Provider>
  );
}
