import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
  Text,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import {
  TextInput,
  Button,
  Snackbar,
  HelperText,
  Provider as PaperProvider,
} from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS } from '../../constants/theme';
import { API_ENDPOINTS } from '../../constants/config';
import * as SecureStore from 'expo-secure-store';
import AuthContext from './AuthContext';
import { useRouter } from 'expo-router';
import PasswordResetModal from './PasswordResetModal';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      setError('Please fill in all fields');
      onToggleSnackBar();
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;

        await SecureStore.setItemAsync('accessToken', accessToken);
        const userResponse = await fetch(API_ENDPOINTS.userInfo, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (userResponse.ok) {
          const user = await userResponse.json();
          await SecureStore.setItemAsync('user', JSON.stringify(user));
          setUser(user);
        } else {
          console.error('Error fetching user data:', userResponse.status);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
        onToggleSnackBar();
      }
    } catch (err) {
      setError('Network error: ' + err);
      onToggleSnackBar();
    }
  };

  return (
    <PaperProvider theme={{ colors: { primary: 'rgb(141 43 145)', background: '#FFFFFF' } }}>
      <SafeAreaView style={[CONTAINER.screen, styles.container]}>
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.innerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/Talaria-Fits-Transparent-Background.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                error={!!error}
                left={<TextInput.Icon icon="email" />}
                theme={{ colors: { primary: 'rgb(141 43 145)' } }}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!isPasswordVisible}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                error={!!error}
                left={<TextInput.Icon icon="lock" />}
                right={<TextInput.Icon icon={isPasswordVisible ? "eye-off" : "eye"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
                theme={{ colors: { primary: 'rgb(141 43 145)' } }}
              />

              {error ? <HelperText type="error">{error}</HelperText> : null}

              <Button
                mode="text"
                onPress={() => setResetModalVisible(true)}
                style={styles.forgotPassword}
                labelStyle={[styles.forgotPasswordText, { color: 'rgb(141 43 145)' }]}
              >
                Forgot Password?
              </Button>

              <Button
                mode="contained"
                onPress={handleLogin}
                style={[styles.loginButton, { backgroundColor: 'rgb(141 43 145)' }]}
                contentStyle={styles.loginButtonContent}
                labelStyle={{ color: '#FFFFFF' }}
              >
                Login
              </Button>

              <Button
                mode="outlined"
                onPress={() => router.push('/components/SignUpScreen')}
                style={[styles.signupButton, { borderColor: 'rgb(141 43 145)' }]}
                contentStyle={styles.signupButtonContent}
                textColor="rgb(141 43 145)"
              >
                Create New Account
              </Button>
            </View>
          </View>
        </ScrollView>

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Dismiss',
            onPress: onDismissSnackBar,
          }}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>

        <PasswordResetModal
          visible={resetModalVisible}
          onDismiss={() => setResetModalVisible(false)}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    minHeight: '100%',
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: '#000000',
  },
  subtitleText: {
    textAlign: 'center',
    color: '#666666',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: SPACING.md,
    backgroundColor: '#FFFFFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginBottom: SPACING.md,
  },
  loginButtonContent: {
    paddingVertical: SPACING.sm,
  },
  signupButton: {
    marginTop: SPACING.sm,
  },
  signupButtonContent: {
    paddingVertical: SPACING.sm,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default LoginScreen;