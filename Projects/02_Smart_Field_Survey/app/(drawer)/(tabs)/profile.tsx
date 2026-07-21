import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';
import { useSurveys } from '@/hooks/use-surveys';

const drawerLinks = [
  { label: 'Camera',    icon: 'camera-outline'   as const, route: '/(drawer)/camera-screen'    },
  { label: 'Location',  icon: 'location-outline' as const, route: '/(drawer)/location-screen'  },
  { label: 'Contacts',  icon: 'people-outline'   as const, route: '/(drawer)/contacts-screen'  },
  { label: 'Clipboard', icon: 'copy-outline'     as const, route: '/(drawer)/clipboard-screen' },
  { label: 'Settings',  icon: 'settings-outline' as const, route: '/(drawer)/settings-screen'  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { surveys } = useSurveys();

  const submitted = surveys.filter(s => !!s.submittedAt).length;
  const pending   = surveys.filter(s => !s.submittedAt).length;

  const statCards = [
    { label: 'Completed', value: String(submitted), icon: 'checkmark-done-circle-outline' as const, color: Palette.success },
    { label: 'Pending',   value: String(pending),   icon: 'document-outline'              as const, color: Palette.warning },
    { label: 'Total',     value: String(surveys.length), icon: 'clipboard-outline'         as const, color: Palette.primary },
  ];

  return (
    <SafeAreaView style={ps.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={ps.hero}>
          <Pressable 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
            style={{ position: 'absolute', top: 16, left: 16, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
            accessibilityLabel="Open navigation drawer"
          >
            <Ionicons name="menu-outline" size={24} color={Palette.white} />
          </Pressable>
          <View style={ps.heroBlobTL} />
          <View style={ps.heroBlobBR} />
          <View style={ps.avatar}>
            <Text style={ps.avatarText}>AS</Text>
          </View>
          <Text style={ps.name}>Anand Suthar</Text>
          <Text style={ps.role}>Field Surveyor · ID 108539</Text>
          <Text style={ps.campus}>Swaminarayan University · Class 714</Text>
          <View style={ps.onlineTag}>
            <View style={ps.onlineDot} />
            <Text style={ps.onlineText}>Active</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={ps.statsRow}>
          {statCards.map((m) => (
            <View key={m.label} style={ps.statCard}>
              <View style={[ps.statIcon, { backgroundColor: `${m.color}18` }]}>
                <Ionicons name={m.icon} size={20} color={m.color} />
              </View>
              <Text style={[ps.statVal, { color: m.color }]}>{m.value}</Text>
              <Text style={ps.statLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Info card */}
        <View style={ps.infoCard}>
          {[
            { label: 'Student ID',  value: '108539',                   icon: 'card-outline'     as const },
            { label: 'Class',       value: '714',                      icon: 'school-outline'   as const },
            { label: 'Role',        value: 'Field Surveyor',           icon: 'briefcase-outline' as const },
            { label: 'Campus',      value: 'Swaminarayan University',  icon: 'business-outline' as const },
          ].map((row, idx, arr) => (
            <View key={row.label} style={[ps.infoRow, idx === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={ps.infoLeft}>
                <Ionicons name={row.icon} size={15} color={Palette.inkSoft} />
                <Text style={ps.infoLabel}>{row.label}</Text>
              </View>
              <Text style={ps.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Quick links */}
        <Text style={ps.sectionTitle}>App Modules</Text>
        <View style={ps.linksCard}>
          {drawerLinks.map((link, idx) => (
            <Pressable
              key={link.label}
              style={[ps.linkRow, idx === drawerLinks.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => router.push(link.route as any)}
            >
              <View style={ps.linkIcon}>
                <Ionicons name={link.icon} size={18} color={Palette.primary} />
              </View>
              <Text style={ps.linkLabel}>{link.label}</Text>
              <Ionicons name="chevron-forward-outline" size={16} color={Palette.inkSoft} />
            </Pressable>
          ))}
        </View>

        {/* Sign out */}
        <Pressable style={ps.signOutBtn}>
          <Ionicons name="log-out-outline" size={18} color={Palette.danger} />
          <Text style={ps.signOutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ps = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },

  hero: {
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: Spacing.md,
    overflow: 'hidden',
  },
  heroBlobTL: {
    position: 'absolute', top: -50, left: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(99,102,241,0.3)',
  },
  heroBlobBR: {
    position: 'absolute', bottom: -30, right: -30,
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(16,185,129,0.2)',
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Palette.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3, borderColor: 'rgba(165,180,252,0.4)',
  },
  avatarText: { color: Palette.white, fontSize: 28, fontWeight: '800' },
  name:   { color: Palette.white,              fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  role:   { color: 'rgba(255,255,255,0.65)',   fontSize: 13, marginTop: 4 },
  campus: { color: '#A5B4FC',                  fontSize: 12, marginTop: 4 },
  onlineTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4,
    marginTop: 10,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Palette.success },
  onlineText: { color: Palette.success, fontSize: 11, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 10, padding: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Palette.white, borderRadius: Radius.lg,
    padding: 12, alignItems: 'center', ...Shadow.sm,
  },
  statIcon: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  statVal:  { fontSize: 20, fontWeight: '800' },
  statLabel: { color: Palette.inkSoft, fontSize: 9, textAlign: 'center', marginTop: 2 },

  infoCard: {
    backgroundColor: Palette.white, borderRadius: Radius.xl,
    marginHorizontal: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Palette.border,
  },
  infoLeft:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 13, color: Palette.inkSoft },
  infoValue: { fontSize: 13, fontWeight: '700', color: Palette.ink },

  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: Palette.ink,
    marginHorizontal: Spacing.md, marginBottom: 10,
  },
  linksCard: {
    backgroundColor: Palette.white, borderRadius: Radius.xl,
    marginHorizontal: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm,
  },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Palette.border,
  },
  linkIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center',
  },
  linkLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Palette.ink },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: Spacing.md, paddingVertical: 14,
    borderRadius: Radius.lg, backgroundColor: '#FEE2E2',
  },
  signOutText: { color: Palette.danger, fontWeight: '800', fontSize: 14 },
});
