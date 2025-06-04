// components/SneakerIcon.tsx
import React from 'react';
import { Image } from 'react-native';

interface SneakerIconProps {
  color: string;
  size: number;
}

const SneakerIcon = ({ color, size }: SneakerIconProps) => (
  <Image
    source={require('../assets/images/sneakerIcon.png')} // Replace with the actual path to your icon image
    style={{ width: size, height: size, tintColor: color }}
  />
);

export default SneakerIcon;