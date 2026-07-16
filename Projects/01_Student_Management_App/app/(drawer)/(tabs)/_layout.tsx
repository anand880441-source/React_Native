import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="vico"
        options={{
          title: 'Vico',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 24} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
