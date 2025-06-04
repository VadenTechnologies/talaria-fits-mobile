import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, Chip, Divider } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS, LAYOUT } from '../constants/theme';

const SneakerDetailScreen = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  // Mock data for sneaker details
  const sneaker = {
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Nike',
    colorway: 'Black/White',
    releaseDate: '2021-03-13',
    retailPrice: '$170',
    description: 'The Air Jordan 1 Retro High OG is a modern take on the classic AJ1, featuring premium leather construction and the iconic Wings logo.',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
  };

  return (
    <ScrollView style={CONTAINER.screen}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: sneaker.images[0] }}
          style={styles.mainImage}
        />
        <IconButton
          icon={isFavorite ? "heart" : "heart-outline"}
          size={32}
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        />
      </View>

      {/* Basic Info */}
      <View style={CONTAINER.card}>
        <Text style={TYPOGRAPHY.h2}>{sneaker.name}</Text>
        <Text style={[TYPOGRAPHY.h3, styles.brand]}>{sneaker.brand}</Text>
        <View style={[LAYOUT.row, styles.infoRow]}>
          <Text style={TYPOGRAPHY.caption}>Colorway: {sneaker.colorway}</Text>
          <Text style={TYPOGRAPHY.caption}>Release: {sneaker.releaseDate}</Text>
        </View>
        <Text style={[TYPOGRAPHY.h3, styles.price]}>{sneaker.retailPrice}</Text>
      </View>

      {/* Description */}
      <View style={CONTAINER.card}>
        <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Description</Text>
        <Text style={TYPOGRAPHY.body}>{sneaker.description}</Text>
      </View>

      {/* Size Selection */}
      <View style={CONTAINER.card}>
        <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Select Size</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sizesContainer}
        >
          {sizes.map((size) => (
            <Chip
              key={size}
              selected={selectedSize === size}
              onPress={() => setSelectedSize(size)}
              style={styles.sizeChip}
              selectedColor={COLORS.primary}
            >
              {size}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={[LAYOUT.row, styles.actionButtons]}>
        <Button
          mode="outlined"
          onPress={() => {}}
          style={[BUTTONS.secondary, styles.actionButton]}
          icon="cart"
        >
          Add to Cart
        </Button>
        <Button
          mode="contained"
          onPress={() => {}}
          style={[BUTTONS.primary, styles.actionButton]}
          icon="shopping"
        >
          Buy Now
        </Button>
      </View>

      {/* Related Items */}
      <View style={CONTAINER.card}>
        <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>You May Also Like</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.relatedContainer}
        >
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.relatedItem}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.relatedImage}
              />
              <Text style={TYPOGRAPHY.caption}>Related Sneaker {item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.background,
  },
  brand: {
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  infoRow: {
    marginTop: SPACING.md,
    justifyContent: 'space-between',
  },
  price: {
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  sizesContainer: {
    marginTop: SPACING.sm,
  },
  sizeChip: {
    marginRight: SPACING.sm,
  },
  actionButtons: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  relatedContainer: {
    marginTop: SPACING.md,
  },
  relatedItem: {
    marginRight: SPACING.md,
    width: 150,
  },
  relatedImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
});

export default SneakerDetailScreen; 