import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Keyboard } from 'react-native';
import { Modal, Portal, TextInput, Button, Text, HelperText, ActivityIndicator } from 'react-native-paper';
import { API_ENDPOINTS } from '../../constants/config';

interface PasswordResetModalProps {
  visible: boolean;
  onDismiss: () => void;
}

type ResetStep = 'email' | 'code' | 'password';

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  visible,
  onDismiss,
}) => {
  // Form states
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [currentStep, setCurrentStep] = useState<ResetStep>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log('[PasswordResetModal] Visibility changed:', visible);
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    console.log('[PasswordResetModal] Resetting form');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setCurrentStep('email');
  };

  const handleRequestCode = async () => {
    console.log('[PasswordResetModal] Requesting code for email:', email);
    Keyboard.dismiss();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('[PasswordResetModal] Code request response:', response.status);
      const data = await response.json();

      if (response.ok) {
        console.log('[PasswordResetModal] Code sent successfully');
        setCurrentStep('code');
      } else {
        setError(data.message || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('[PasswordResetModal] Network Error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    console.log('[PasswordResetModal] Verifying code');
    Keyboard.dismiss();

    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('[PasswordResetModal] Making request to:', API_ENDPOINTS.verifyCode);
      console.log('[PasswordResetModal] Request body:', { email, code });
      
      const response = await fetch(API_ENDPOINTS.verifyCode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      console.log('[PasswordResetModal] Response status:', response.status);
      console.log('[PasswordResetModal] Response headers:', response.headers);
      
      let data;
      const responseText = await response.text();
      console.log('[PasswordResetModal] Raw response:', responseText);
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[PasswordResetModal] JSON Parse Error:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (response.ok) {
        console.log('[PasswordResetModal] Code verified successfully');
        setCurrentStep('password');
      } else {
        setError(data.message || 'Invalid or expired code. Please try again.');
      }
    } catch (err) {
      console.error('[PasswordResetModal] Network Error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    console.log('[PasswordResetModal] Changing password');
    Keyboard.dismiss();

    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const requestBody = {
        email,
        code: code.toString(),
        newPassword,
      };
      
      console.log('[PasswordResetModal] Making request to:', API_ENDPOINTS.changePassword);
      console.log('[PasswordResetModal] Request body:', requestBody);
      
      const response = await fetch(API_ENDPOINTS.changePassword, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[PasswordResetModal] Response status:', response.status);
      const responseText = await response.text();
      console.log('[PasswordResetModal] Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[PasswordResetModal] JSON Parse Error:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (response.ok) {
        console.log('[PasswordResetModal] Password changed successfully');
        setSuccess(true);
        setTimeout(() => {
          handleDismiss();
        }, 2000);
      } else {
        console.error('[PasswordResetModal] Error response:', data);
        setError(data.message || 'Failed to change password. Please try again.');
      }
    } catch (err) {
      console.error('[PasswordResetModal] Network Error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    console.log('[PasswordResetModal] Dismissing modal');
    Keyboard.dismiss();
    resetForm();
    onDismiss();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a verification code.
            </Text>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setError('');
                setEmail(text);
              }}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleRequestCode}
              left={<TextInput.Icon icon="email" />}
              error={!!error}
              disabled={loading}
            />
          </>
        );

      case 'code':
        return (
          <>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to {email}
            </Text>
            <TextInput
              label="Verification Code"
              value={code}
              onChangeText={(text) => {
                setError('');
                // Only allow numeric input and limit to 6 digits
                const numericValue = text.replace(/[^0-9]/g, '');
                if (numericValue.length <= 6) {
                  setCode(numericValue);
                }
              }}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleVerifyCode}
              left={<TextInput.Icon icon="key" />}
              error={!!error}
              disabled={loading}
            />
          </>
        );

      case 'password':
        return (
          <>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below.
            </Text>
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={(text) => {
                setError('');
                setNewPassword(text);
              }}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              returnKeyType="next"
              left={<TextInput.Icon icon="lock" />}
              error={!!error}
              disabled={loading}
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setError('');
                setConfirmPassword(text);
              }}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleChangePassword}
              left={<TextInput.Icon icon="lock" />}
              error={!!error}
              disabled={loading}
            />
          </>
        );

      default:
        return null;
    }
  };

  const renderButtons = () => {
    if (loading) {
      return <ActivityIndicator style={styles.loader} />;
    }
    if (success) {
      return (
        <HelperText type="info" style={styles.successText}>
          Password changed successfully! Redirecting...
        </HelperText>
      );
    }

    let buttonText = '';
    let onPressAction = () => {};

    switch (currentStep) {
      case 'email':
        buttonText = 'Send Code';
        onPressAction = handleRequestCode;
        break;
      case 'code':
        buttonText = 'Verify Code';
        onPressAction = handleVerifyCode;
        break;
      case 'password':
        buttonText = 'Change Password';
        onPressAction = handleChangePassword;
        break;
    }

    return (
      <>
        <Button 
          mode="contained"
          onPress={onPressAction}
          loading={loading}
          disabled={loading}
          style={styles.button}
          textColor="#FFFFFF"
        >
          {buttonText}
        </Button>
        <Button 
          mode="outlined" 
          onPress={handleDismiss} 
          style={styles.button}
        >
          Cancel
        </Button>
      </>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.container,
          Platform.OS === 'ios' && styles.iosContainer
        ]}
        dismissable={false}
      >
        <View style={styles.content}>
          {renderStep()}
          {error ? <HelperText type="error">{error}</HelperText> : null}
          {!success && !loading && renderButtons()}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
  },
  iosContainer: {
    top: '20%',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  loader: {
    marginVertical: 16,
  },
  successText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
});

export default PasswordResetModal; 