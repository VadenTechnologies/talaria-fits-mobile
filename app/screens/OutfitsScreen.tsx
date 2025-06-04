import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, Searchbar, Chip } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY, CONTAINER, BUTTONS, LAYOUT } from '../constants/theme';

const OutfitsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'casual', label: 'Casual' },
    { id: 'formal', label: 'Formal' },
    { id: 'street', label: 'Street' },
    { id: 'sport', label: 'Sport' },
  ];

  // Mock data for outfits
  const outfits = [
    {
      id: '1',
      name: 'Street Style',
      items: [
        { id: '1', name: 'Air Jordan 1', image: 'https://via.placeholder.com/100' },
        { id: '2', name: 'Black Jeans', image: 'https://via.placeholder.com/100' },
        { id: '3', name: 'White Tee', image: 'https://via.placeholder.com/100' },
      ],
      likes: 124,
      saves: 45,
    },
    {
      id: '2',
      name: 'Casual Friday',
      items: [
        { id: '4', name: 'Yeezy 350', image: 'https://via.placeholder.com/100' },
        { id: '5', name: 'Chinos', image: 'https://via.placeholder.com/100' },
        { id: '6', name: 'Button-up', image: 'https://via.placeholder.com/100' },
      ],
      likes: 89,
      saves: 32,
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[CONTAINER.card, styles.outfitCard]}>
      <View style={[LAYOUT.row, LAYOUT.spaceBetween, styles.outfitHeader]}>
        <Text style={TYPOGRAPHY.h3}>{item.name}</Text>
        <IconButton
          icon="dots-vertical"
          size={24}
          onPress={() => {}}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.itemsContainer}
      >
        {item.items.map((clothingItem) => (
          <View key={clothingItem.id} style={styles.itemContainer}>
            <Image
              source={{ uri: clothingItem.image }}
              style={styles.itemImage}
            />
            <Text style={TYPOGRAPHY.caption} numberOfLines={1}>
              {clothingItem.name}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[LAYOUT.row, LAYOUT.spaceBetween, styles.outfitFooter]}>
        <View style={[LAYOUT.row, styles.statsContainer]}>
          <View style={[LAYOUT.row, styles.statItem]}>
            <IconButton
              icon="heart"
              size={16}
              style={styles.statIcon}
            />
            <Text style={TYPOGRAPHY.caption}>{item.likes}</Text>
          </View>
          <View style={[LAYOUT.row, styles.statItem]}>
            <IconButton
              icon="bookmark"
              size={16}
              style={styles.statIcon}
            />
            <Text style={TYPOGRAPHY.caption}>{item.saves}</Text>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={() => {}}
          style={BUTTONS.primary}
        >
          Try On
        </Button>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={CONTAINER.screen}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search outfits"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            selected={selectedFilter === filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={styles.filterChip}
            selectedColor={COLORS.primary}
          >
            {filter.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Outfits List */}
      <FlatList
        data={outfits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Create Outfit Button */}
      <IconButton
        icon="plus"
        size={32}
        style={styles.createButton}
        onPress={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: SPACING.md,
  },
  filtersContainer: {
    marginBottom: SPACING.md,
  },
  filterChip: {
    marginRight: SPACING.sm,
  },
  listContainer: {
    paddingBottom: SPACING.xl,
  },
  outfitCard: {
    marginBottom: SPACING.md,
  },
  outfitHeader: {
    marginBottom: SPACING.md,
  },
  itemsContainer: {
    marginBottom: SPACING.md,
  },
  itemContainer: {
    marginRight: SPACING.md,
    width: 100,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  outfitFooter: {
    marginTop: SPACING.md,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statItem: {
    marginRight: SPACING.md,
    alignItems: 'center',
  },
  statIcon: {
    margin: 0,
    padding: 0,
  },
  createButton: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
});

export default OutfitsScreen; 