import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, ActivityIndicator, MD3Colors, Chip, Menu, Divider, Surface, List } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import useAuth from '@/hooks/useAuth'; // Import useAuth
import { useRouter, useFocusEffect } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import Header from '@/components/Header';

// Define the Sneaker interface (or import it)
interface Sneaker {
  snickerId: string; // Use the correct property name!
  snickerName: string;
  snickerImg: string;
  brand: string; // Assuming this field exists for filtering
  // ... other properties ...
}

// *** Separate Component for Each Closet Item ***
const ClosetItem = React.memo(({ item }: { item: Sneaker }) => {
  const router = useRouter(); // CORRECT: useRouter inside a component

  return (
    <Surface style={styles.sneakerCard}>
      <TouchableOpacity 
        onPress={() => router.push({ pathname: `/SneakerDetail`, params: { sneakerId: item.snickerId } })}
        style={styles.sneakerImageContainer}
      >
        <Image 
          source={{ uri: item.snickerImg }} 
          style={styles.sneakerImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.sneakerInfo}>
        <Text style={styles.sneakerName} numberOfLines={1}>{item.snickerName}</Text>
        <Text style={styles.sneakerBrand}>{item.brand}</Text>
        <Button 
          mode="contained" 
          onPress={() => router.push({ pathname: `/OutfitsScreen`, params: { sneakerId: item.snickerId } })}
          style={styles.styleButton}
          labelStyle={styles.styleButtonLabel}
        >
          Style This Shoe
        </Button>
      </View>
    </Surface>
  );
});

const ClosetScreen = () => {
  const { user, token, userId } = useAuth();
  const [closetSneakers, setClosetSneakers] = useState<Sneaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'recent' | 'nameAsc' | 'nameDesc' | 'brandAsc'>('recent');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const fetchClosetSneakers = useCallback(async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(`https://talariafitsbackend.uk.r.appspot.com/closet`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Use token from useAuth
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Reverse the array here to make newest items appear first by default
        const sneakers = data.data || [];
        setClosetSneakers(sneakers.reverse()); 
      } else {
        console.log('Failed to fetch closet sneakers', response.status);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error fetching closet sneakers:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Initial fetch and refetch on focus
  useFocusEffect(
    useCallback(() => {
      if (token && userId) { // Ensure token and userId are available
        fetchClosetSneakers();
        setSelectedSort('recent'); // Reset sort on focus/refetch
      }
    }, [fetchClosetSneakers, token, userId]) // Add fetchClosetSneakers, token, and userId to dependency array
  );

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const sortedAndFilteredSneakers = closetSneakers
    .filter(sneaker => {
      // Search query filter
      const searchMatch = sneaker.snickerName.toLowerCase().includes(searchQuery.toLowerCase());
      return searchMatch;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'recent':
          return 0;
        case 'nameAsc':
          return a.snickerName.localeCompare(b.snickerName);
        case 'nameDesc':
          return b.snickerName.localeCompare(a.snickerName);
        case 'brandAsc':
          return (a.brand || '').localeCompare(b.brand || '');
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header showBackButton={false} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.headerCard}>
          <Title style={styles.headerTitle}>My Closet</Title>
          <Text style={styles.headerSubtitle}>Manage your sneaker collection</Text>
          <Text style={styles.countText}>
            {closetSneakers.length} {closetSneakers.length === 1 ? 'sneaker' : 'sneakers'} in your closet
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search my closet"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />

        <Surface style={styles.filtersCard}>
          <List.Accordion
            title="Filters & Sorting"
            description="Sort your sneakers"
            expanded={filtersExpanded}
            onPress={() => setFiltersExpanded(!filtersExpanded)}
            style={styles.accordion}
            theme={{ colors: { background: COLORS.background } }}
          >
            <View style={styles.filterContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sort by</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
                  <Chip 
                    selected={selectedSort === 'recent'} 
                    onPress={() => setSelectedSort('recent')} 
                    style={styles.chip}
                    selectedColor={COLORS.primary}
                  >
                    Recent
                  </Chip>
                  <Chip 
                    selected={selectedSort === 'nameAsc'} 
                    onPress={() => setSelectedSort('nameAsc')} 
                    style={styles.chip}
                    selectedColor={COLORS.primary}
                  >
                    Name (A-Z)
                  </Chip>
                  <Chip 
                    selected={selectedSort === 'nameDesc'} 
                    onPress={() => setSelectedSort('nameDesc')} 
                    style={styles.chip}
                    selectedColor={COLORS.primary}
                  >
                    Name (Z-A)
                  </Chip>
                  <Chip 
                    selected={selectedSort === 'brandAsc'} 
                    onPress={() => setSelectedSort('brandAsc')} 
                    style={styles.chip}
                    selectedColor={COLORS.primary}
                  >
                    Brand (A-Z)
                  </Chip>
                </ScrollView>
              </View>
            </View>
          </List.Accordion>
        </Surface>

        {closetSneakers.length > 0 ? (
          <FlatList
            data={sortedAndFilteredSneakers}
            renderItem={({ item }) => <ClosetItem item={item} />}
            keyExtractor={(item) => item.snickerId.toString()}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            scrollEnabled={false}
          />
        ) : (
          <Surface style={styles.emptyStateCard}>
            <Text style={styles.emptyStateText}>No sneakers in your closet yet.</Text>
            <Text style={styles.emptyStateSubtext}>Add some sneakers to get started!</Text>
          </Surface>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  headerCard: {
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    elevation: 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
  },
  countText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  searchBar: {
    marginBottom: SPACING.lg,
    elevation: 2,
  },
  filtersCard: {
    borderRadius: 16,
    marginBottom: SPACING.lg,
    elevation: 2,
    overflow: 'hidden',
  },
  accordion: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  accordionTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  accordionDescription: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  filterContent: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  filterSection: {
    marginBottom: SPACING.md,
  },
  filterLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  chipScrollView: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  gridContainer: {
    paddingBottom: SPACING.xl,
  },
  sneakerCard: {
    flex: 1,
    margin: SPACING.xs,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  sneakerImageContainer: {
    aspectRatio: 1,
    overflow: 'hidden',
  },
  sneakerImage: {
    width: '100%',
    height: '100%',
  },
  sneakerInfo: {
    padding: SPACING.md,
  },
  sneakerName: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sneakerBrand: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  styleButton: {
    backgroundColor: COLORS.primary,
  },
  styleButtonLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  emptyStateCard: {
    padding: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
  },
  noBrandsText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
});

export default ClosetScreen;