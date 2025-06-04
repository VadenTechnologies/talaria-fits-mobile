import React, { useState } from 'react';
import {
  StyleSheet,
  View,
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
import { API_ENDPOINTS } from '../../constants/config';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS } from '../constants/theme';

const { width } = Dimensions.get('window');

const VerificationScreen = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

const handleVerify = async () => {
    Keyboard.dismiss();
    if (!verificationCode) {
      setError('Please enter the verification code');
      onToggleSnackBar();
      return;
    }

    setLoading(true);
    try {
  const response = await fetch(API_ENDPOINTS.verifyAccount, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (response.ok) {
router.push('/components/LoginScreen');
      } else {
        const data = await response.json();
        setError(data.message || 'Verification failed');
        onToggleSnackBar();
      }
    } catch (err) {
      setError('Network error: ' + err);
      onToggleSnackBar();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={[CONTAINER.screen, styles.container]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.innerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/Talaria-Fits-Transparent-Background.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[TYPOGRAPHY.h1, styles.welcomeText]}>Verify Your Email</Text>
              <Text style={[TYPOGRAPHY.body, styles.subtitleText]}>
                We've sent a verification code to {email}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                label="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                mode="outlined"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
                returnKeyType="done"
                onSubmitEditing={handleVerify}
                error={!!error}
                left={<TextInput.Icon icon="key" />}
                textColor={COLORS.textPrimary}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
              />

              {error ? <HelperText type="error">{error}</HelperText> : null}

              <Button
                mode="contained"
                onPress={handleVerify}
                loading={loading}
    style={[BUTTONS.primary, styles.verifyButton]}
                labelStyle={[TYPOGRAPHY.button, { color: COLORS.onPrimary }]}
              >
                Verify
              </Button>

              <Button
                mode="text"
                onPress={() => router.push('/components/LoginScreen')}
                style={styles.backButton}
                labelStyle={[TYPOGRAPHY.body, { color: COLORS.primary }]}
              >
                Back to Login
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>

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
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
  },
  welcomeText: {
    marginBottom: 8,
    color: '#000',
  },
  subtitleText: {
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  verifyButton: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  backButton: {
    borderRadius: 8,
    marginTop: 12,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default VerificationScreen; 