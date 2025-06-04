import React, { useState } from 'react';
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
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {
  TextInput,
  Button,
  Snackbar,
  HelperText,
  Provider as PaperProvider,
  ProgressBar,
  Divider,
  TouchableRipple,
} from 'react-native-paper';
import { API_ENDPOINTS } from '../../constants/config';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS } from '../constants/theme';
import type { TextStyle, ViewStyle } from 'react-native';

const { width } = Dimensions.get('window');

// Generate Sneaker Sizes (US Men's)
const generateSizes = () => {
  const sizes = [];
  for (let i = 6; i <= 14; i += 0.5) {
    sizes.push(i.toString());
  }
  return sizes;
};
const SNEAKER_SIZES = generateSizes();

const SignUpScreen = () => {
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    sneakerSize: '',
    role: 'user',
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSizeModalVisible, setSizeModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    setError(null);
    switch (step) {
      case 1:
        if (!formData.name || !formData.email) {
          setError('Please fill in your name and email');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.phoneNumber || !formData.sneakerSize) {
          setError('Please provide your phone number and select a sneaker size');
          return false;
        }
        return true;
      case 3:
        if (!formData.password || !formData.confirmPassword) {
          setError('Please enter and confirm your password');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setError(null);
    } else {
      onToggleSnackBar();
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSignUp = async () => {
    if (!validateStep(currentStep)) {
      onToggleSnackBar();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        sneakerSize: parseFloat(formData.sneakerSize),
        role: formData.role,
      };

      const response = await fetch(API_ENDPOINTS.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push({
          pathname: '/components/VerificationScreen',
          params: { email: formData.email },
        });
      } else {
        setError(responseData.message || 'Sign up failed. Please check your details.');
        onToggleSnackBar();
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError('An unexpected error occurred. Please try again.');
      onToggleSnackBar();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSize = (size: string) => {
    handleInputChange('sneakerSize', size);
    setSizeModalVisible(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <TextInput
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
              returnKeyType="next"
              error={!!error && (!formData.name || !formData.email)}
              left={<TextInput.Icon icon="account" />}
              textColor={COLORS.textPrimary}
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              error={!!error && (!formData.name || !formData.email)}
              left={<TextInput.Icon icon="email" />}
              textColor={COLORS.textPrimary}
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              returnKeyType="next"
              error={!!error && (!formData.phoneNumber || !formData.sneakerSize)}
              left={<TextInput.Icon icon="phone" />}
              textColor={COLORS.textPrimary}
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
            />
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setSizeModalVisible(true)}
            >
              <Text style={styles.selectButtonText}>
                {formData.sneakerSize ? `US ${formData.sneakerSize}` : 'Select Sneaker Size'}
              </Text>
              <TextInput.Icon icon="chevron-down" color={COLORS.textSecondary} size={20} />
            </TouchableOpacity>
            {!!error && !formData.sneakerSize && (
              <HelperText type="error" visible={true} style={styles.errorText}>
                Please select a sneaker size.
              </HelperText>
            )}
          </>
        );
      case 3:
        return (
          <>
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!isPasswordVisible}
              returnKeyType="next"
              error={!!error && (!formData.password || !formData.confirmPassword)}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon icon={isPasswordVisible ? "eye-off" : "eye"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
              textColor={COLORS.textPrimary}
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
            />
            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!isConfirmPasswordVisible}
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
              error={!!error && (!formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword)}
              left={<TextInput.Icon icon="lock-check" />}
              right={<TextInput.Icon icon={isConfirmPasswordVisible ? "eye-off" : "eye"} onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} />}
              textColor={COLORS.textPrimary}
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PaperProvider>
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
              <Text style={[TYPOGRAPHY.h1 as TextStyle, styles.welcomeText]}>Create Account</Text>
              <Text style={[TYPOGRAPHY.body as TextStyle, styles.subtitleText]}>
                Step {currentStep} of 3
              </Text>
            </View>

            <ProgressBar
              progress={currentStep / 3}
              color={COLORS.primary}
              style={styles.progressBar}
            />

            <View style={styles.formContainer}>
              {renderStep()}

              <View style={styles.buttonContainer}>
                {currentStep > 1 && (
                  <Button
                    mode="outlined"
                    onPress={handleBack}
                    style={[BUTTONS.outlined, styles.backButton]}
                    labelStyle={[TYPOGRAPHY.button as TextStyle, { color: COLORS.primary }]}
                  >
                    Back
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={currentStep === 3 ? handleSignUp : handleNext}
                  loading={loading}
                  style={[BUTTONS.primary, styles.nextButton]}
                  labelStyle={[TYPOGRAPHY.button as TextStyle, { color: COLORS.onPrimary }]}
                >
                  {currentStep === 3 ? 'Sign Up' : 'Next'}
                </Button>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/components/LoginScreen')}
                style={styles.loginButton}
              >
                <Text style={[TYPOGRAPHY.body as TextStyle, styles.loginText]}>
                  Already have an account? <Text style={{ color: COLORS.primary }}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isSizeModalVisible}
          onRequestClose={() => setSizeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Sneaker Size (US Men's)</Text>
              <FlatList
                data={SNEAKER_SIZES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableRipple onPress={() => handleSelectSize(item)}>
                    <View style={styles.modalItem}>
                      <Text style={styles.modalItemText}>{item}</Text>
                    </View>
                  </TouchableRipple>
                )}
                ItemSeparatorComponent={() => <Divider style={styles.modalDivider}/>}
                style={styles.modalList}
              />
              <Button onPress={() => setSizeModalVisible(false)} style={styles.modalCloseButton}>
                Close
              </Button>
            </View>
          </View>
        </Modal>

        <Snackbar
          visible={!!error && visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Dismiss',
            onPress: onDismissSnackBar,
          }}
          style={styles.snackbar}
        >
          <Text>{error}</Text>
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
    flexGrow: 1,
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: SPACING.md,
  },
  welcomeText: {
    marginBottom: SPACING.xs,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitleText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressBar: {
    marginBottom: SPACING.lg,
    height: 6,
    borderRadius: 3,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: SPACING.md,
    backgroundColor: '#fff',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: SPACING.md,
  },
  selectButtonText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  backButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  nextButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  loginButton: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.textSecondary,
  },
  snackbar: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -SPACING.md + 4,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: SPACING.lg,
    width: width * 0.8,
    maxHeight: '70%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  modalList: {
    marginBottom: SPACING.md,
  },
  modalItem: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  modalDivider: {
    backgroundColor: COLORS.border,
  },
  modalCloseButton: {
    marginTop: SPACING.sm,
  },
});

export default SignUpScreen;