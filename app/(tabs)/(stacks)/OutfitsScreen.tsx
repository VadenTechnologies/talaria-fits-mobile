import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, MD3Colors, useTheme, Text, Surface, IconButton, Portal, Modal } from 'react-native-paper';
import { useGetSneakerByIdQuery } from '@/hooks/sneakerApi';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface Outfit {
    _id: string;
    imageUrl: string;
    outfitName: string;
    sneakerId: string;
    __v: number;
}

const OutfitsScreen = () => {
    const { sneakerId } = useLocalSearchParams<{ sneakerId: string }>();
    const { data: sneaker, isLoading: isSneakerLoading, error: sneakerError } = useGetSneakerByIdQuery(sneakerId!);
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
    const { token, userId } = useAuth();
    const theme = useTheme();
    const router = useRouter();

    const fetchOutfits = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!token) {
                setError('No auth token found!');
                setIsLoading(false);
                return;
            }
            if (!userId) {
                setError('No user ID found!');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`https://talariafitsbackend.uk.r.appspot.com/outfit`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch outfits: ${response.status}`);
            }

            const data = await response.json();
            setOutfits(data);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [sneakerId, token, userId]);

    useEffect(() => {
        if (sneakerId && token && userId) {
            fetchOutfits();
        }
    }, [sneakerId, fetchOutfits, token, userId]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchOutfits();
    }, [fetchOutfits]);

    const handleGoBack = () => {
        router.back();
    };

    const renderOutfitCard = ({ item }: { item: Outfit }) => (
        <TouchableOpacity 
            style={styles.outfitCard}
            onPress={() => setSelectedOutfit(item)}
        >
            <Surface style={styles.outfitCardInner} elevation={2}>
                <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.outfitImage}
                    resizeMode="cover"
                />
                <IconButton
                    icon="heart-outline"
                    size={24}
                    style={styles.likeButton}
                    onPress={() => {}}
                />
            </Surface>
        </TouchableOpacity>
    );

    if (isLoading || isSneakerLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={MD3Colors.primary50} size="large" />
            </View>
        );
    }

    if (error || sneakerError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error || (sneakerError && JSON.stringify(sneakerError))}</Text>
            </View>
        );
    }

    if (!sneaker) {
        return (
            <View style={styles.container}>
                <Header showBackButton={true} />
                <Text>Sneaker not found.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header showBackButton={true} />
            
            {/* Hero Section */}
            <View style={styles.heroSection}>
                <Image 
                    source={{ uri: sneaker.image.original }} 
                    style={styles.heroImage}
                    resizeMode="cover"
                />
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
                <Text style={styles.title}>{sneaker.name}</Text>
                <Text style={styles.subtitle}>{sneaker.brand}</Text>
            </View>

            {/* Outfits Grid */}
            {outfits.length > 0 ? (
                <FlatList
                    data={outfits.filter(item => item.sneakerId === sneaker.id)}
                    renderItem={renderOutfitCard}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.outfitsGrid}
                    contentContainerStyle={styles.outfitsList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                        />
                    }
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No outfits found for this sneaker</Text>
                </View>
            )}

            {/* Outfit Modal */}
            <Portal>
                <Modal
                    visible={selectedOutfit !== null}
                    onDismiss={() => setSelectedOutfit(null)}
                    contentContainerStyle={styles.modalContainer}
                >
                    {selectedOutfit && (
                        <View style={styles.modalContent}>
                            <Image 
                                source={{ uri: selectedOutfit.imageUrl }} 
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                            <IconButton
                                icon="close"
                                size={24}
                                style={styles.closeButton}
                                onPress={() => setSelectedOutfit(null)}
                            />
                        </View>
                    )}
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    errorText: {
        color: COLORS.error,
        fontSize: TYPOGRAPHY.body.fontSize,
    },
    heroSection: {
        height: width * 0.6,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    titleSection: {
        padding: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.h2.fontSize,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body.fontSize,
        color: COLORS.textSecondary,
    },
    outfitsList: {
        padding: SPACING.md,
    },
    outfitsGrid: {
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    outfitCard: {
        width: (width - SPACING.md * 3) / 2,
        marginBottom: SPACING.md,
    },
    outfitCardInner: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
    },
    outfitImage: {
        width: '100%',
        height: width * 0.6,
    },
    likeButton: {
        position: 'absolute',
        top: SPACING.xs,
        right: SPACING.xs,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyStateText: {
        fontSize: TYPOGRAPHY.h3.fontSize,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        margin: 0,
        padding: 0,
        flex: 1,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: width,
        height: height * 0.8,
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.lg,
        right: SPACING.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
});

export default OutfitsScreen;