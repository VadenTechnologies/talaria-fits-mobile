import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Menu, IconButton } from 'react-native-paper';

const ShoeSizePicker = ({ onShoeSizeChange, currentValue }) => { // Add onShoeSizeChange prop
  const [shoeSize, setShoeSize] = useState<number | null>(currentValue); // Default size as number
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const sizes = Array.from({ length: 29 }, (_, i) => 6 + i * 0.5); // Sizes 6 to 20 with halves

  const handleSelect = (value: string) => {
    const numericShoeSize = parseFloat(value, currentValue);
    setShoeSize(numericShoeSize);
    onShoeSizeChange(numericShoeSize); // Notify parent component
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton icon="menu-down" onPress={openMenu} style={styles.icon} />
        }>
        {sizes.map((size) => (
          <Menu.Item
            key={size.toString()}
            onPress={() => handleSelect(size.toString())}
            title={size.toString()}
          />
        ))}
      </Menu>
      <Text style={styles.selectedSize}>{shoeSize}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 8,
  },
  selectedSize: {
    marginLeft: 8,
  },
});

export default ShoeSizePicker;