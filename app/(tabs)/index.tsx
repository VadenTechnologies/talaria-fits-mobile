import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Card, Button, ActivityIndicator, MD3Colors, Searchbar, Paragraph, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';
import useAuth from '../../hooks/useAuth';
import { useLazySearchSneakersQuery, Sneaker } from '../../hooks/sneakerApi'; // Import Sneaker
import Header from '../../components/Header';

// Define allowed brands outside the component
const allowedBrands = ["Nike", "adidas", "Jordan", "Reebok", "New Balance"];

const SneakerCard = React.memo(({ item, addToCloset }: { item: Sneaker; addToCloset: (sneaker: Sneaker) => void }) => {
    const router = useRouter();

    return (
        <Card style={styles.card}>
            <TouchableOpacity onPress={() => router.push({ pathname: `/SneakerDetail`, params: { sneakerId: item.id } })}>
                <Card.Cover style={styles.sneakerImg} source={{ uri: item.image.small }} />
            </TouchableOpacity>
            <Card.Content>
                <Title style={{ textAlign: 'left', fontWeight: 'bold', textTransform: 'capitalize' }}>
                    <Text>{item.brand}</Text>
                </Title>
                <Paragraph style={{ textAlign: 'left', fontWeight: 'light', textTransform: 'capitalize' }}>
                    <Text>{item.name}</Text>
                </Paragraph>
                <Button onPress={() => addToCloset(item)}>
                    <Text>Add To Closet</Text>
                </Button>
            </Card.Content>
        </Card>
    );
});

const LibraryScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(20);
    const [sneakers, setSneakers] = useState<Sneaker[]>([]);
    const { addToCloset } = useAuth();

    const [triggerSearch, { data, error, isLoading, isFetching }] = useLazySearchSneakersQuery();

    // Append new data, filtering for valid images AND allowed brands
    useEffect(() => {
        if (data?.results) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
            
            const validSneakers = data.results.filter(sneaker => {
                const hasValidImage = sneaker.image.small !== "";
                const isAllowedBrand = allowedBrands.includes(sneaker.brand);
                const isReleased = new Date(sneaker.releaseDate) <= today;
                
                return hasValidImage && isAllowedBrand && isReleased;
            });
            
            setSneakers(prevSneakers => {
                return page === 0 ? validSneakers : [...prevSneakers, ...validSneakers];
            });
        }
    }, [data, page]); // Removed allowedBrands from dependencies

    // Reset page to 0 when searchQuery changes, and clear sneakers
    useEffect(() => {
        if (searchQuery !== '' && page !== 0) {
            setPage(0);
            setSneakers([]);
        }
    }, [searchQuery]);

    // Trigger fetch
    useEffect(() => {
        const handler = setTimeout(() => {
            triggerSearch({
                query: searchQuery,
                page,
                limit,
            });
        }, 400);
        return () => {
            clearTimeout(handler);
        };
    }, [triggerSearch, searchQuery, page, limit]);

    const handleLoadMore = useCallback(() => {
        if (!isFetching && !isLoading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isFetching, isLoading]);

    // Initial loading state
    if (isLoading && page === 0 && sneakers.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={MD3Colors.primary50} size="large"/>
            </View>
        );
    }

    // Error display
    if (error) {
        return (
            <View style={styles.container}>
                <Header />
                <Text style={styles.errorText}>Error loading sneakers. Please try again later.</Text>
                 <Searchbar
                    placeholder="Search Sneakers"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>
        );
    }

    // No Sneakers Found message
    if (!isLoading && sneakers.length === 0) {
        return (
            <View style={styles.container}>
                <Header />
                 <Searchbar
                    placeholder="Search Sneakers"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
                <Text style={styles.noResults}>
                    {searchQuery ? `No sneakers found for "${searchQuery}".` : 'No sneakers found matching your criteria.'}
                </Text>
            </View>
        );
    }

    // Main content display
    return (
        <View style={styles.container}>
            <Header />
            <Searchbar
                placeholder="Search Sneakers"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />
            <FlatList
                data={sneakers}
                renderItem={({ item }) => (
                    <SneakerCard item={item} addToCloset={addToCloset} />
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.8}
                ListFooterComponent={isFetching ? <ActivityIndicator style={styles.footerLoader} /> : null}
                numColumns={2}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  card: {
    margin: 8,
    flex: 1,
    maxWidth: '46%',
  },
  sneakerImg: {
    height: 150,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#e0e0e0'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: { // Style for error message
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: MD3Colors.error50,
    paddingHorizontal: 16,
  },
  noResults: { // Style for "No Results" message
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    paddingHorizontal: 16,
  },
  searchBar:{
    margin: 16,
    marginBottom: 8,
  },
  footerLoader: { // Style for the bottom loading indicator
      marginVertical: 20,
  }
});

export default LibraryScreen;