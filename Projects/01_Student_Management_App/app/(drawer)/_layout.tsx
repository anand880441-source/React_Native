// import { Tabs } from 'expo-router';
// import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//       }}>
//       <Tabs.Screen
//         name="Home"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="Students"
//         options={{
//           title: 'Students',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="APIScreen"
//         options={{
//           title: 'APIScreen',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="Profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }



import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: true,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'Vico Tabs',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <IconSymbol size={size ?? 24} name="house.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Home"
          options={{
            title: 'Home',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <IconSymbol size={size ?? 24} name="house.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Students"
          options={{
            title: 'Students',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <IconSymbol size={size ?? 24} name="paperplane.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="APIScreen"
          options={{
            title: 'APIScreen',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <IconSymbol size={size ?? 24} name="house.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          options={{
            title: 'Profile',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <IconSymbol size={size ?? 24} name="house.fill" color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
