import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Palette } from '@/constants/theme';
import { StyleSheet, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.inkSoft,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* 1 — Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeWrap]}>
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={20} color={color} />
            </View>
          ),
        }}
      />

      {/* 2 — Create Survey */}
      <Tabs.Screen
        name="survey"
        options={{
          title: 'New Survey',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeWrap]}>
              <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* 3 — History */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeWrap]}>
              <Ionicons name={focused ? 'time' : 'time-outline'} size={20} color={color} />
            </View>
          ),
        }}
      />

      {/* 4 — Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeWrap]}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    height: Platform.OS === 'ios' ? 88 : 68,
    borderTopWidth: 0,
    shadowColor: '#64748B',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 30,
  },
  activeWrap: {
    backgroundColor: `${Palette.primary}15`,
    borderRadius: 12,
    width: 44,
    height: 30,
  },
});