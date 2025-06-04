// components/Header.tsx
import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons (or your preferred icon library)
import { useRouter } from 'expo-router';

interface HeaderProps {
    showBackButton?: boolean; // Optional boolean prop
  }
  
const Header: React.FC<HeaderProps> = ({ showBackButton = false }) => { // Default to false
    const router = useRouter();
  
    const handleGoBack = () => {
      router.back();
    };
  return (
    <View style={styles.headerContainer}>
    {showBackButton && ( // Conditionally render the back button
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Image
        source={require('../assets/images/Talaria-Fits-Transparent-Background.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginTop: 40,
      },
      logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
      },
      backButton: {
        padding: 10,
        position: 'absolute', // Absolute positioning for the back button
        left: 0, // Position on the left edge
        top: '50%',  //Vertically center
        transform: [{ translateY: -15 }], //Adjust positioning
    
      },
});

export default Header;