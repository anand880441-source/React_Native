import { Drawer } from 'expo-router/drawer';
import { useNavigation } from 'expo-router';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

function MenuButton() {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();
  return (
    <Pressable onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
      <Ionicons name="menu" size={24} color="#000" />
    </Pressable>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        drawerStyle: { width: 260 },
        headerLeft: () => <MenuButton />,
      }}
    >
      <Drawer.Screen name="index" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen
        name="home"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: 'Explore',
          drawerIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="location"
        options={{
          title: 'Location',
          drawerIcon: ({ color, size }) => <Ionicons name="location-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="camera"
        options={{
          title: 'Camera',
          drawerIcon: ({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="clipboard"
        options={{
          title: 'Clipboard',
          drawerIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="network"
        options={{
          title: 'Network',
          drawerIcon: ({ color, size }) => <Ionicons name="wifi-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          drawerIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="share"
        options={{
          title: 'Share',
          drawerIcon: ({ color, size }) => <Ionicons name="share-social-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="video"
        options={{
          title: 'Video',
          drawerIcon: ({ color, size }) => <Ionicons name="videocam-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="asyncStorage"
        options={{
          title: 'AsyncStorage',
          drawerIcon: ({ color, size }) => <Ionicons name="server-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          title: 'Authentication',
          drawerIcon: ({ color, size }) => <Ionicons name="finger-print-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
