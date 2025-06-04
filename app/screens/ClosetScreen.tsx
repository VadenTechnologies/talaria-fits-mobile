import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, Searchbar, Chip } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS, LAYOUT } from '../constants/theme';

const ClosetScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'sneakers', label: 'Sneakers' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const sortOptions = [
    { id: 'recent', label: 'Recent' },
    { id: 'name', label: 'Name' },
    { id: 'brand', label: 'Brand' },
  ];

  // Mock data for items
  const items = [
    {
      id: '1',
      name: 'Air Jordan 1 Retro High',
      brand: 'Nike',
      category: 'sneakers',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Yeezy Boost 350',
      brand: 'Adidas',
      category: 'sneakers',
      image: 'https://via.placeholder.com/150',
    },
    // Add more mock items as needed
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[CONTAINER.card, styles.itemCard]}>
      <View style={styles.itemImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
        />
      </View>
      <View style={styles.itemInfo}>
        <Text style={TYPOGRAPHY.body}>{item.name}</Text>
        <Text style={TYPOGRAPHY.caption}>{item.brand}</Text>
      </View>
      <IconButton
        icon="dots-vertical"
        size={24}
        onPress={() => {}}
      />
    </TouchableOpacity>
  );

  return (
    <View style={CONTAINER.screen}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search your closet"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={styles.categoryChip}
            selectedColor={COLORS.primary}
          >
            {category.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={[LAYOUT.row, LAYOUT.spaceBetween, styles.sortContainer]}>
        <Text style={TYPOGRAPHY.caption}>Sort by:</Text>
        <View style={LAYOUT.row}>
          {sortOptions.map((option) => (
            <Chip
              key={option.id}
              selected={selectedSort === option.id}
              onPress={() => setSelectedSort(option.id)}
              style={styles.sortChip}
              selectedColor={COLORS.primary}
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </View>

      {/* Items Grid */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Add Item Button */}
      <IconButton
        icon="plus"
        size={32}
        style={styles.addButton}
        onPress={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    marginBottom: SPACING.md,
  },
  categoryChip: {
    marginRight: SPACING.sm,
  },
  sortContainer: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  sortChip: {
    marginLeft: SPACING.sm,
  },
  gridContainer: {
    paddingBottom: SPACING.xl,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  itemCard: {
    width: '48%',
    padding: SPACING.sm,
  },
  itemImageContainer: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
});

export default ClosetScreen; 