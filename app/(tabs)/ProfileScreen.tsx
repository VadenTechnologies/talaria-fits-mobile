import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Avatar, Button, TextInput, ActivityIndicator, useTheme, Surface, Divider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import SneakerIcon from '../../components/SneakerIcon';
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import ShoeSizePicker from '@/components/ShoeSizePicker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS, LAYOUT } from '../constants/theme';

interface Styles {
    container: ViewStyle;
    scrollView: ViewStyle;
    scrollContent: ViewStyle;
    loadingContainer: ViewStyle;
    profileCard: ViewStyle;
    header: ViewStyle;
    avatar: ViewStyle;
    name: TextStyle;
    joinDate: TextStyle;
    infoCard: ViewStyle;
    fieldContainer: ViewStyle;
    label: TextStyle;
    value: TextStyle;
    placeholder: TextStyle;
    input: TextStyle;
    datePickerButton: ViewStyle;
    divider: ViewStyle;
    buttonContainer: ViewStyle;
    button: ViewStyle;
    buttonLabel: TextStyle;
    saveButton: ViewStyle;
    editButton: ViewStyle;
    cancelButton: ViewStyle;
    cancelButtonLabel: TextStyle;
    logoutButton: ViewStyle;
    logoutButtonLabel: TextStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    profileCard: {
        padding: SPACING.lg,
        borderRadius: 16,
        marginBottom: SPACING.lg,
        elevation: 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    avatar: {
        backgroundColor: COLORS.primary,
        marginBottom: SPACING.md,
    },
    name: {
        fontSize: TYPOGRAPHY.h2.fontSize,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    joinDate: {
        fontSize: TYPOGRAPHY.caption.fontSize,
        fontWeight: '400',
        color: COLORS.textSecondary,
    },
    infoCard: {
        padding: SPACING.lg,
        borderRadius: 16,
        marginBottom: SPACING.lg,
        elevation: 2,
    },
    fieldContainer: {
        paddingVertical: SPACING.sm,
    },
    label: {
        fontSize: TYPOGRAPHY.caption.fontSize,
        fontWeight: '400',
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    value: {
        fontSize: TYPOGRAPHY.body.fontSize,
        fontWeight: '400',
        color: COLORS.textPrimary,
    },
    placeholder: {
        color: COLORS.textSecondary,
    },
    input: {
        backgroundColor: 'transparent',
    },
    datePickerButton: {
        height: 40,
        justifyContent: 'center',
    },
    divider: {
        marginVertical: SPACING.sm,
    },
    buttonContainer: {
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    button: {
        borderRadius: 8,
        paddingVertical: SPACING.sm,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.onPrimary,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    editButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButton: {
        borderColor: COLORS.primary,
    },
    cancelButtonLabel: {
        color: COLORS.primary,
    },
    logoutButton: {
        borderColor: COLORS.error,
        marginBottom: SPACING.xl,
    },
    logoutButtonLabel: {
        color: COLORS.error,
    },
});

const ProfileScreen = () => {
    // Use the user data from useAuth directly.  No separate profileData state.
    const { logout, token, userId, user, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');  // Add email state
    const [sneakerSize, setSneakerSize] = useState<number | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null); // Changed to Date | null
    const [showDatePicker, setShowDatePicker] = useState(false); // State for picker visibility
    const [passHash, setPassHash] = useState('');
    const [role, setRole] = useState('');
    const { colors } = useTheme();
    const router = useRouter()
    const [formData, setFormData] = useState({});

    const handleShoeSizeChange = (size: string) => {
        setSneakerSize(Number(size));
    };

    const formatDateForDisplay = (date: Date | null): string => {
        if (!date) return '';
        // Use UTC methods to display the date as it is stored (UTC)
        const month = date.getUTCMonth() + 1; // getUTCMonth is 0-indexed
        const day = date.getUTCDate();
        const year = date.getUTCFullYear();
        return `${month}/${day}/${year}`;
    };

    useEffect(() => {
        if (user && user._id) {
            setName(user.name || '');
            setPhoneNumber(user.phoneNumber || '');
            setEmail(user.email || '');
            setSneakerSize(user.sneakerSize !== undefined ? Number(user.sneakerSize) : null);
            setPassHash(user.password); 
            setRole(user.role);

            // Simplified and robust birthday parsing for ISO 8601 timestamps
            if (user.birthday && typeof user.birthday === 'string' && user.birthday.trim() !== '') {
                const parsedDate = new Date(user.birthday);
                if (!isNaN(parsedDate.getTime())) {
                    setBirthday(parsedDate);
                } else {
                    console.warn("Invalid date string from user.birthday:", user.birthday);
                    setBirthday(null); // Invalid date string
                }
            } else {
                setBirthday(null); // No birthday string, not a string, or empty string
            }
        } else {
            setName('');
            setPhoneNumber('');
            setEmail('');
            setSneakerSize(null);
            setPassHash('');
            setRole('');
            setBirthday(null);
        }
        setIsLoading(false);
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            setName(user.name || '');
            setPhoneNumber(user.phoneNumber || '');
            setEmail(user.email || '');
            setSneakerSize(user.sneakerSize !== undefined ? Number(user.sneakerSize) : null);
            setPassHash(user.password);
            setRole(user.role);

            // Apply the same simplified parsing logic here
            if (user.birthday && typeof user.birthday === 'string' && user.birthday.trim() !== '') {
                const parsedDate = new Date(user.birthday);
                if (!isNaN(parsedDate.getTime())) {
                    setBirthday(parsedDate);
                } else {
                    setBirthday(null);
                }
            } else {
                setBirthday(null);
            }
        } else {
            setName('');
            setPhoneNumber('');
            setEmail('');
            setSneakerSize(null);
            setPassHash('');
            setRole('');
            setBirthday(null);
        }
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios'); // Keep visible on iOS until dismissal
        if (selectedDate) {
            setBirthday(selectedDate);
        }
    };

    const handleSave = async () => {
        try {
            if (!token) {
                console.error("No auth token");
                return;
            }
            if (!userId) { // Add this check!
                console.error("User ID is missing!");
                return;
            }

            // Helper function to convert Date object to YYYY-MM-DD
            const formatBirthdayForAPI = (date: Date | null): string | null => {
                if (!date) return null;
                const year = date.getUTCFullYear(); // Use UTC to match initialization
                const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                const day = date.getUTCDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const apiBirthday = formatBirthdayForAPI(birthday);

            const updatedProfile = {
                id: userId,
                name: name,
                phoneNumber: phoneNumber,
                email: email,
                sneakerSize: sneakerSize === null ? null : sneakerSize,
                // Only include birthday if it's a valid date after formatting
                ...(apiBirthday && { birthday: apiBirthday }), 
                password: passHash,
                role: role,
            };
            console.log("Updated Profile Payload:", updatedProfile);
             // Use string interpolation for URL
             const response = await fetch(`https://talariafitsbackend.uk.r.appspot.com/user/edit/${userId}`, {
                method: 'PATCH', // Or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use the token
                    // 'X-User-ID': userId  <-- REMOVE THIS
                },
                body: JSON.stringify(updatedProfile),
            });
            if (response.ok) {
                 // Refresh user data
            const refreshResponse = await fetch(`https://talariafitsbackend.uk.r.appspot.com/user/info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (refreshResponse.ok) {
                const refreshedUserArray = await refreshResponse.json(); // Assuming it's an array
                if (refreshedUserArray && refreshedUserArray.length > 0) {
                    const refreshedUser = refreshedUserArray[0]; // Get the first user object
                    console.log("refreshed user", refreshedUser);
                    await SecureStore.setItemAsync('user', JSON.stringify(refreshedUserArray)); // Store the array
                    setUser(refreshedUser); // Set the single user object to context
                    setName(refreshedUser.name || '');
                    setPhoneNumber(refreshedUser.phoneNumber || '');
                    setEmail(refreshedUser.email || '');
                    setSneakerSize(refreshedUser.sneakerSize !== undefined ? Number(refreshedUser.sneakerSize) : null);
                     if(refreshedUser.birthday){
                        let date = new Date(refreshedUser.birthday)
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        const year = date.getFullYear();
                        setBirthday(new Date(Date.UTC(year, month - 1, day)));
                    } else {
                        setBirthday(null);
                    }
                } else {
                     console.error("Refreshed user data is empty or not an array");
                }
                setIsEditing(false);
            } else {
                console.error("Failed to refresh user data:", refreshResponse.status);
                // Handle refresh error
            }
              } else {
                // Handle different error cases more specifically
                const errorData = await response.json(); //  Get error details

                if (response.status === 400) {
                // Bad Request (e.g., validation errors)
                console.error('Bad Request:', errorData.message || 'Invalid input data');
                } else if (response.status === 401) {
                    console.error("User is unauthorized")
                }
                else if (response.status === 404) {
                // Not Found (user doesn't exist - should be handled by auth, but good to check)
                console.error('User not found:', errorData.message || 'User does not exist');
                } else {
                // Other errors (e.g., 500 Internal Server Error)
                console.error('Failed to update profile:', response.status, errorData);
                    throw new Error(`Failed to add sneaker: ${response.status}`);

                }
            }
        } catch (error:any) {
            console.error('Error updating profile:', error);
        }
    };


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header showBackButton={false} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Surface style={styles.profileCard}>
                    <View style={styles.header}>
                        <Avatar.Icon 
                            size={100} 
                            icon="account" 
                            style={styles.avatar}
                            color={COLORS.onPrimary}
                        />
                        <Text style={styles.name}>{user?.name || 'User'}</Text>
                        <Text style={styles.joinDate}>Member since {user?.joinDate || '2024'}</Text>
                    </View>
                </Surface>

                <Surface style={styles.infoCard}>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Name</Text>
                        {isEditing ? (
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                style={styles.input}
                                placeholderTextColor={colors.onSurfaceVariant}
                            />
                        ) : (
                            <Text style={styles.value}>{name || "N/A"}</Text>
                        )}
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Birthday</Text>
                        {isEditing ? (
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                                <Text style={[styles.value, !birthday && styles.placeholder]}>
                                    {birthday ? formatDateForDisplay(birthday) : "Select Date"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.value}>{formatDateForDisplay(birthday) || "N/A"}</Text>
                        )}
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Phone</Text>
                        {isEditing ? (
                            <TextInput
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                mode="outlined"
                                style={styles.input}
                                placeholderTextColor={colors.onSurfaceVariant}
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text style={styles.value}>{phoneNumber || 'N/A'}</Text>
                        )}
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Email</Text>
                        {isEditing ? (
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="email-address"
                                placeholderTextColor={colors.onSurfaceVariant}
                                autoCapitalize="none"
                            />
                        ) : (
                            <Text style={styles.value}>{email || 'N/A'}</Text>
                        )}
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Shoe Size</Text>
                        {isEditing ? (
                            <ShoeSizePicker 
                                onShoeSizeChange={handleShoeSizeChange} 
                                currentValue={sneakerSize !== undefined ? String(sneakerSize) : "10"}
                            />
                        ) : (
                            <Text style={styles.value}>
                                {sneakerSize !== undefined ? String(sneakerSize) : 'N/A'}
                            </Text>
                        )}
                    </View>
                </Surface>

                <View style={styles.buttonContainer}>
                    {isEditing ? (
                        <>
                            <Button 
                                mode="contained" 
                                onPress={handleSave} 
                                style={[styles.button, styles.saveButton]}
                                labelStyle={styles.buttonLabel}
                            >
                                Save Changes
                            </Button>
                            <Button 
                                mode="outlined" 
                                onPress={handleCancel} 
                                style={[styles.button, styles.cancelButton]}
                                labelStyle={styles.cancelButtonLabel}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button 
                            mode="contained" 
                            onPress={handleEdit} 
                            style={[styles.button, styles.editButton]}
                            labelStyle={styles.buttonLabel}
                        >
                            Edit Profile
                        </Button>
                    )}
                </View>

                <Button 
                    mode="outlined" 
                    onPress={() => {logout(); router.replace('../components/LoginScreen')}} 
                    style={[styles.button, styles.logoutButton]}
                    labelStyle={styles.logoutButtonLabel}
                >
                    Log Out
                </Button>
            </ScrollView>

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={birthday || new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
};

export default ProfileScreen;