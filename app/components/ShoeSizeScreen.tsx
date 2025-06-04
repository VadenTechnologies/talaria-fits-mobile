import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, SegmentedButtons } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS } from '../constants/theme';
import { router } from 'expo-router';

const shoeSizes = [
  '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5',
  '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14'
];

const ShoeSizeScreen = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSizeSelect = async () => {
    if (!selectedSize) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Save shoe size to user profile
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error saving shoe size:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[CONTAINER.screen, styles.container]}>
      <Text style={[TYPOGRAPHY.h1, styles.title]}>Select Your Shoe Size</Text>
      <Text style={[TYPOGRAPHY.body, styles.subtitle]}>
        This will help us recommend the perfect fits for you
      </Text>

      <ScrollView 
        contentContainerStyle={styles.sizesContainer}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedButtons
          value={selectedSize}
          onValueChange={setSelectedSize}
          buttons={shoeSizes.map(size => ({
            value: size,
            label: size,
            style: {
              backgroundColor: selectedSize === size ? COLORS.primary : COLORS.background,
            },
            labelStyle: {
              color: selectedSize === size ? COLORS.onPrimary : COLORS.textPrimary,
            },
          }))}
          style={styles.segmentedButtons}
        />
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleSizeSelect}
        loading={loading}
        disabled={!selectedSize}
        style={[BUTTONS.primary, styles.button]}
        labelStyle={[TYPOGRAPHY.button, { color: COLORS.onPrimary }]}
      >
        Continue
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: SPACING.xl,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  sizesContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  segmentedButtons: {
    marginBottom: SPACING.xl,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default ShoeSizeScreen; 