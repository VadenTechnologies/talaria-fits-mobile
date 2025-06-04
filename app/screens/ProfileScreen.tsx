import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, Divider, IconButton, TextInput } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS, LAYOUT } from '../constants/theme';

interface Size {
  id: string;
  size: string;
  quantity: number;
}

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [bio, setBio] = useState('Sneaker enthusiast and fashion lover');
  const [sizes, setSizes] = useState<Size[]>([
    { id: '1', size: 'US 9', quantity: 2 },
    { id: '2', size: 'US 9.5', quantity: 1 },
    { id: '3', size: 'US 10', quantity: 3 },
  ]);

  const handleSizeChange = (id: string, newQuantity: number) => {
    setSizes(sizes.map(size => 
      size.id === id ? { ...size, quantity: newQuantity } : size
    ));
  };

  return (
    <ScrollView style={CONTAINER.screen}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar.Image 
            size={100} 
            source={{ uri: 'https://via.placeholder.com/100' }} 
            style={styles.avatar}
          />
          <IconButton
            icon="camera"
            size={24}
            style={styles.editPhotoButton}
            onPress={() => {}}
          />
        </View>
        <Text style={TYPOGRAPHY.h2}>{name}</Text>
        <Text style={[TYPOGRAPHY.caption, styles.email]}>{email}</Text>
      </View>

      {/* Stats Section */}
      <View style={[CONTAINER.card, styles.statsContainer]}>
        <View style={styles.statItem}>
          <Text style={TYPOGRAPHY.h3}>24</Text>
          <Text style={TYPOGRAPHY.caption}>Outfits</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={TYPOGRAPHY.h3}>156</Text>
          <Text style={TYPOGRAPHY.caption}>Sneakers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={TYPOGRAPHY.h3}>1.2k</Text>
          <Text style={TYPOGRAPHY.caption}>Followers</Text>
        </View>
      </View>

      {/* Bio Section */}
      <View style={CONTAINER.card}>
        <View style={[LAYOUT.row, LAYOUT.spaceBetween, styles.sectionHeader]}>
          <Text style={TYPOGRAPHY.h3}>About Me</Text>
          <IconButton
            icon={isEditing ? "check" : "pencil"}
            size={24}
            onPress={() => setIsEditing(!isEditing)}
          />
        </View>
        {isEditing ? (
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            style={styles.bioInput}
            mode="outlined"
          />
        ) : (
          <Text style={TYPOGRAPHY.body}>{bio}</Text>
        )}
      </View>

      {/* Recent Activity */}
      <View style={CONTAINER.card}>
        <Text style={[TYPOGRAPHY.h3, styles.sectionHeader]}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <IconButton icon="shoe-sneaker" size={24} />
          <View style={styles.activityContent}>
            <Text style={TYPOGRAPHY.body}>Added new sneakers</Text>
            <Text style={TYPOGRAPHY.caption}>2 hours ago</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.activityItem}>
          <IconButton icon="tshirt-crew" size={24} />
          <View style={styles.activityContent}>
            <Text style={TYPOGRAPHY.body}>Created new outfit</Text>
            <Text style={TYPOGRAPHY.caption}>1 day ago</Text>
          </View>
        </View>
      </View>

      {/* Settings Button */}
      <Button
        mode="outlined"
        onPress={() => {}}
        style={[BUTTONS.secondary, styles.settingsButton]}
        icon="cog"
      >
        Settings
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    backgroundColor: COLORS.primaryLight,
  },
  editPhotoButton: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: COLORS.primary,
  },
  email: {
    marginTop: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  bioInput: {
    backgroundColor: COLORS.surface,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  activityContent: {
    flex: 1,
  },
  divider: {
    marginVertical: SPACING.sm,
  },
  settingsButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
});

export default ProfileScreen; 