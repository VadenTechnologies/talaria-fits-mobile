import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Avatar,
  Button,
  IconButton,
  Divider,
  Card,
  useTheme,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - replace with actual user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    sneakerSize: '10.5',
    joinDate: 'January 2024',
    stats: {
      outfitsCreated: 12,
      itemsInWardrobe: 45,
      favoriteBrands: 3,
    },
  };

  const handleLogout = () => {
    router.push('/components/LoginScreen');
  };

  const renderStatCard = (title: string, value: string | number) => (
    <Card style={styles.statCard}>
      <Card.Content>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{title}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={100}
              label={userData.name.split(' ').map(n => n[0]).join('')}
              style={[styles.avatar, { backgroundColor: COLORS.primary }]}
            />
            <IconButton
              icon="camera"
              size={24}
              style={styles.editAvatarButton}
              onPress={() => {}}
            />
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.joinDate}>Member since {userData.joinDate}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {renderStatCard('Outfits', userData.stats.outfitsCreated)}
          {renderStatCard('Items', userData.stats.itemsInWardrobe)}
          {renderStatCard('Brands', userData.stats.favoriteBrands)}
        </View>

        {/* Info Section */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sneaker Size</Text>
              <Text style={styles.infoValue}>{userData.sneakerSize}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
            labelStyle={styles.buttonLabel}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.buttonLabel}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  joinDate: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    backgroundColor: COLORS.primary,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: '#fff',
    textAlign: 'center',
  },
  statLabel: {
    ...TYPOGRAPHY.body,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
  infoCard: {
    marginBottom: SPACING.xl,
    backgroundColor: '#fff',
    elevation: 2,
  },
  infoItem: {
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  divider: {
    marginVertical: SPACING.xs,
  },
  actionsContainer: {
    gap: SPACING.md,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  logoutButton: {
    borderColor: COLORS.primary,
  },
  buttonLabel: {
    ...TYPOGRAPHY.button,
  },
});

export default ProfileScreen; 