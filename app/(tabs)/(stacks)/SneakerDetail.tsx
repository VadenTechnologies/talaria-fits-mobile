import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ActivityIndicator, MD3Colors, useTheme, Button, Surface, Chip, Divider } from 'react-native-paper';
import { useGetSneakerByIdQuery } from '@/hooks/sneakerApi';
import useAuth from '@/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import Header from '@/components/Header';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import * as SecureStore from 'expo-secure-store';

interface Outfit {
  _id: string;
  outfitName: string;
  sneakerId: string;
  imageUrl: string;
  __v: number;
}

const { width } = Dimensions.get('window');

const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

const SneakerDetail = () => {
  const { sneakerId } = useLocalSearchParams<{ sneakerId: string }>();
  const { data: sneaker, error, isLoading: isSneakerLoading } = useGetSneakerByIdQuery(sneakerId!);
  const { checkIfInCloset, token, addToCloset } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [outfitError, setOutfitError] = useState<string | null>(null);

  const [isInCloset, setIsInCloset] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [isAddingToCloset, setIsAddingToCloset] = useState(false);
  const [addToClosetError, setAddToClosetError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onDismissSnackBar = () => {
    setVisible(false);
    setSuccessMessage(null);
  };

  const fetchOutfits = async () => {
    setOutfitError(null);
    try {
      if (!token) {
        setOutfits([]);
        return;
      }

      const response = await fetch(`https://talariafitsbackend.uk.r.appspot.com/outfit`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        setOutfits([]);
        return;
      }

      const data = await response.json();
      const sneakerOutfits = data.filter((outfit: Outfit) => outfit.sneakerId === sneakerId);
      setOutfits(sneakerOutfits);
    } catch (err: any) {
      setOutfits([]);
    }
  };

  useEffect(() => {
    const checkClosetStatus = async () => {
      if (sneakerId) {
        const inCloset = await checkIfInCloset(sneakerId);
        setIsInCloset(inCloset);
        if (inCloset) {
          fetchOutfits();
        }
      }
    };

    checkClosetStatus();
  }, [sneakerId, checkIfInCloset]);

  const handleAddToCloset = async () => {
    if (sneaker) {
      setIsAddingToCloset(true);
      setAddToClosetError(null);
      try {
        const success = await addToCloset(sneaker);
        if (success) {
          setSuccessMessage('Sneaker added to closet!');
          setVisible(true);
          setIsInCloset(true);
          fetchOutfits();
        }
      } catch (err: any) {
        setAddToClosetError(err.message || 'Failed to add to closet');
        setVisible(true);
      } finally {
        setIsAddingToCloset(false);
      }
    }
  };

  const handleViewOutfits = () => {
    router.push({ pathname: `/OutfitsScreen`, params: { sneakerId: sneakerId } });
  };

  if (isSneakerLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={MD3Colors.primary50} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {JSON.stringify(error)}</Text>
      </View>
    );
  }

  if (!sneaker) {
    return (
      <View style={styles.errorContainer}>
        <Text>Could not find sneaker.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header showBackButton={true} />
      
      {/* Hero Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: sneaker.image.original }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Details Section */}
      <Surface style={styles.detailsContainer} elevation={2}>
        <Text style={styles.brand}>{sneaker.brand}</Text>
        <Text style={styles.name}>{sneaker.name}</Text>
        <Text style={styles.colorway}>{sneaker.colorway}</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Release Date</Text>
            <Text style={styles.infoValue}>{formatReleaseDate(sneaker.releaseDate)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>SKU</Text>
            <Text style={styles.infoValue}>{sneaker.sku}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Action Button */}
        <Button
          mode="contained"
          onPress={isInCloset ? handleViewOutfits : handleAddToCloset}
          style={styles.actionButton}
          loading={isAddingToCloset}
          icon={isInCloset ? "hanger" : "plus"}
        >
          {isInCloset ? 'View Outfits' : 'Add to Closet'}
        </Button>

        {/* Outfits Preview Section */}
        {isInCloset && (
          <View style={styles.outfitsSection}>
            <Text style={styles.sectionTitle}>Outfit Inspirations</Text>
            {outfits.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.outfitsScroll}
              >
                {outfits.map((outfit) => (
                  <TouchableOpacity 
                    key={outfit._id}
                    style={styles.outfitCard}
                    onPress={() => router.push({ pathname: `/OutfitsScreen`, params: { sneakerId: sneakerId } })}
                  >
                    <Image 
                      source={{ uri: outfit.imageUrl }} 
                      style={styles.outfitImage}
                      resizeMode="cover"
                    />
                    <View style={styles.outfitInfo}>
                      <Text style={styles.outfitName} numberOfLines={1}>{outfit.outfitName}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noOutfitsContainer}>
                <Text style={styles.noOutfitsText}>No outfits for this sneaker</Text>
              </View>
            )}
          </View>
        )}

        {/* Error State for Outfits */}
        {outfitError && (
          <Text style={styles.outfitError}>{outfitError}</Text>
        )}
      </Surface>

      {/* Snackbar for Add to Closet */}
      {(addToClosetError || successMessage) && (
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={3000}
          action={{
            label: 'Dismiss',
            onPress: onDismissSnackBar,
          }}
        >
          {addToClosetError || successMessage}
        </Snackbar>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
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
  imageContainer: {
    position: 'relative',
    height: width * 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    marginTop: -SPACING.xl,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  brand: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  colorway: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text,
    fontWeight: '600',
  },
  divider: {
    marginVertical: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.lg,
  },
  outfitsSection: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  outfitsScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  outfitCard: {
    width: width * 0.4,
    marginRight: SPACING.md,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 2,
  },
  outfitImage: {
    width: '100%',
    height: width * 0.4,
  },
  outfitInfo: {
    padding: SPACING.sm,
  },
  outfitName: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.text,
    fontWeight: '500',
  },
  outfitsLoading: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  outfitError: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.caption.fontSize,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  noOutfitsContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: SPACING.sm,
  },
  noOutfitsText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SneakerDetail;