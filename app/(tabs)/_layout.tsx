import { Tabs } from 'expo-router';
import SneakerIcon from '@/components/SneakerIcon';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 80 },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <SneakerIcon color={color} size={size * 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="ClosetScreen"
        options={{
          title: 'Closet',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="door" size={size * 1.5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size * 1.5} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="(stacks)/SneakerDetail" options={{ href: null }} />
      <Tabs.Screen name="(stacks)/OutfitsScreen" options={{ href: null }} />
    </Tabs>
  );
}