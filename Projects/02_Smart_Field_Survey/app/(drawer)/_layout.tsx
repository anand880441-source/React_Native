import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSurveys } from '@/hooks/use-surveys';


const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'grid-outline' as const, activeIcon: 'grid' as const, route: '/(drawer)/(tabs)' },
  { label: 'Survey', icon: 'clipboard-outline' as const, activeIcon: 'clipboard' as const, route: '/(drawer)/(tabs)/survey' },
  { label: 'Camera', icon: 'camera-outline' as const, activeIcon: 'camera' as const, route: '/(drawer)/camera-screen' },
  { label: 'Contacts', icon: 'people-outline' as const, activeIcon: 'people' as const, route: '/(drawer)/contacts-screen' },
  { label: 'Location', icon: 'location-outline' as const, activeIcon: 'location' as const, route: '/(drawer)/location-screen' },
  { label: 'Clipboard', icon: 'copy-outline' as const, activeIcon: 'copy' as const, route: '/(drawer)/clipboard-screen' },
  { label: 'History', icon: 'time-outline' as const, activeIcon: 'time' as const, route: '/(drawer)/(tabs)/history' },
  { label: 'Settings', icon: 'settings-outline' as const, activeIcon: 'settings' as const, route: '/(drawer)/settings-screen' },
];


function CustomDrawerContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { surveys } = useSurveys();

  const pendingCount = surveys.filter(s => !s.submittedAt).length;

  const isActive = (route: string) => {
    if (route === '/(drawer)/(tabs)') return pathname === '/' || pathname === '/index' || pathname.endsWith('/(tabs)');
    return pathname.includes(route.replace('/(drawer)/', '').replace('/(tabs)/', ''));
  };

  return (
    <View style={dr.container}>
      <View style={dr.profileHeader}>
        <View style={dr.heroBlobTL} />
        <View style={dr.heroBlobBR} />
        <View style={dr.profileRow}>
          <View style={dr.avatar}>
            <Text style={dr.avatarText}>AS</Text>
          </View>
          <View style={dr.profileInfo}>
            <Text style={dr.profileName}>Anand Suthar</Text>
            <Text style={dr.profileRole}>Field Surveyor</Text>
            <View style={dr.idBadge}>
              <Text style={dr.idText}>ID · 108539</Text>
            </View>
          </View>
        </View>
        <View style={dr.miniStats}>
          <View style={dr.miniStat}>
            <Text style={dr.miniStatVal}>{surveys.length}</Text>
            <Text style={dr.miniStatLabel}>Total</Text>
          </View>
          <View style={dr.miniStatDivider} />
          <View style={dr.miniStat}>
            <Text style={[dr.miniStatVal, { color: Palette.warning }]}>{pendingCount}</Text>
            <Text style={dr.miniStatLabel}>Pending</Text>
          </View>
          <View style={dr.miniStatDivider} />
          <View style={dr.miniStat}>
            <Text style={[dr.miniStatVal, { color: Palette.success }]}>{surveys.length - pendingCount}</Text>
            <Text style={dr.miniStatLabel}>Done</Text>
          </View>
        </View>
      </View>

      <ScrollView style={dr.nav} showsVerticalScrollIndicator={false}>
        <Text style={dr.navSection}>NAVIGATION</Text>
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const active = isActive(item.route);
          return (
            <Pressable
              key={item.label}
              style={[dr.navItem, active && dr.navItemActive]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[dr.navIconWrap, active && dr.navIconWrapActive]}>
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={19}
                  color={active ? Palette.primary : Palette.inkSoft}
                />
              </View>
              <Text style={[dr.navLabel, active && dr.navLabelActive]}>{item.label}</Text>
              {active && <View style={dr.activeDot} />}
            </Pressable>
          );
        })}

        <Text style={[dr.navSection, { marginTop: 16 }]}>EXPO APIS</Text>
        {NAV_ITEMS.slice(2, 6).map((item) => {
          const active = isActive(item.route);
          return (
            <Pressable
              key={item.label}
              style={[dr.navItem, active && dr.navItemActive]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[dr.navIconWrap, active && dr.navIconWrapActive]}>
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={19}
                  color={active ? Palette.primary : Palette.inkSoft}
                />
              </View>
              <Text style={[dr.navLabel, active && dr.navLabelActive]}>{item.label}</Text>
              {active && <View style={dr.activeDot} />}
            </Pressable>
          );
        })}

        <Text style={[dr.navSection, { marginTop: 16 }]}>MORE</Text>
        {NAV_ITEMS.slice(6).map((item) => {
          const active = isActive(item.route);
          return (
            <Pressable
              key={item.label}
              style={[dr.navItem, active && dr.navItemActive]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[dr.navIconWrap, active && dr.navIconWrapActive]}>
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={19}
                  color={active ? Palette.primary : Palette.inkSoft}
                />
              </View>
              <Text style={[dr.navLabel, active && dr.navLabelActive]}>{item.label}</Text>
              {active && <View style={dr.activeDot} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={dr.footer}>
        <View style={dr.footerInfo}>
          <Ionicons name="shield-checkmark-outline" size={14} color={Palette.success} />
          <Text style={dr.footerText}>Smart Field Survey v1.0.0</Text>
        </View>
        <Pressable style={dr.signOutBtn}>
          <Ionicons name="log-out-outline" size={16} color={Palette.danger} />
          <Text style={dr.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}


export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={() => <CustomDrawerContent />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { width: 300 },
          swipeEdgeWidth: 50,
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
        <Drawer.Screen name="camera-screen" options={{ headerShown: false }} />
        <Drawer.Screen name="contacts-screen" options={{ headerShown: false }} />
        <Drawer.Screen name="location-screen" options={{ headerShown: false }} />
        <Drawer.Screen name="clipboard-screen" options={{ headerShown: false }} />
        <Drawer.Screen name="settings-screen" options={{ headerShown: false }} />
        <Drawer.Screen name="survey-preview" options={{ headerShown: false }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}


const dr = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.white,
  },

  profileHeader: {
    backgroundColor: '#1E1B4B',
    padding: Spacing.md,
    paddingTop: 52,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  heroBlobTL: {
    position: 'absolute', top: -40, left: -40,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(99,102,241,0.35)',
  },
  heroBlobBR: {
    position: 'absolute', bottom: -30, right: -20,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(16,185,129,0.20)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(165,180,252,0.4)',
  },
  avatarText: {
    color: Palette.white,
    fontSize: 18,
    fontWeight: '800',
  },
  profileInfo: { flex: 1 },
  profileName: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  profileRole: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  idBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(165,180,252,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(165,180,252,0.3)',
  },
  idText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '700',
  },

  miniStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.md,
    paddingVertical: 10,
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
  },
  miniStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  miniStatVal: {
    color: Palette.white,
    fontSize: 18,
    fontWeight: '800',
  },
  miniStatLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 2,
  },

  nav: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: 12,
  },
  navSection: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.inkSoft,
    letterSpacing: 1.2,
    marginLeft: 10,
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 11,
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: `${Palette.primary}12`,
  },
  navIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${Palette.inkSoft}12`,
  },
  navIconWrapActive: {
    backgroundColor: `${Palette.primary}20`,
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.inkSoft,
  },
  navLabelActive: {
    color: Palette.primary,
    fontWeight: '800',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.primary,
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    padding: Spacing.md,
    gap: 10,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: Palette.inkSoft,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: '#FEE2E2',
  },
  signOutText: {
    color: Palette.danger,
    fontWeight: '700',
    fontSize: 14,
  },
});
