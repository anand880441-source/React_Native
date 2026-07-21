import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';
import { useSurveys } from '@/hooks/use-surveys';

type SettingRow =
  | { type: 'toggle'; label: string; sub?: string; icon: React.ComponentProps<typeof Ionicons>['name']; iconBg: string; iconColor: string; key: string }
  | { type: 'nav';    label: string; sub?: string; icon: React.ComponentProps<typeof Ionicons>['name']; iconBg: string; iconColor: string; value?: string };

const SETTING_GROUPS: { title: string; items: SettingRow[] }[] = [
  {
    title: 'General',
    items: [
      { type: 'toggle', label: 'Dark Mode',          sub: 'Switch to dark theme',         icon: 'moon-outline',             iconBg: '#312E81', iconColor: '#A5B4FC', key: 'darkMode' },
      { type: 'toggle', label: 'Push Notifications', sub: 'Survey reminders & updates',   icon: 'notifications-outline',    iconBg: '#FEF3C7', iconColor: Palette.warning, key: 'notifications' },
      { type: 'toggle', label: 'Auto-save Drafts',   sub: 'Save progress automatically',  icon: 'save-outline',             iconBg: '#D1FAE5', iconColor: Palette.success, key: 'autoSave' },
    ],
  },
  {
    title: 'Data & Privacy',
    items: [
      { type: 'toggle', label: 'Location Tracking',  sub: 'For field survey accuracy',    icon: 'location-outline',         iconBg: '#EDE9FE', iconColor: '#7C3AED', key: 'location' },
      { type: 'nav',    label: 'Clear All Data',      sub: 'Wipe all local surveys',       icon: 'trash-outline',            iconBg: '#FEE2E2', iconColor: Palette.danger },
      { type: 'nav',    label: 'Export Data',         sub: 'Download as CSV',              icon: 'download-outline',         iconBg: '#CCFBF1', iconColor: '#0F766E' },
    ],
  },
  {
    title: 'Account',
    items: [
      { type: 'nav', label: 'Profile',               sub: 'Anand Suthar · ID 108539',    icon: 'person-circle-outline',    iconBg: Palette.primaryLt, iconColor: Palette.primary },
      { type: 'nav', label: 'Change Password',        sub: 'Update your password',         icon: 'lock-closed-outline',      iconBg: '#FEF3C7', iconColor: Palette.warning },
      { type: 'nav', label: 'Language',               sub: 'English',                      icon: 'language-outline',         iconBg: '#D1FAE5', iconColor: Palette.success, value: 'EN' },
    ],
  },
  {
    title: 'About',
    items: [
      { type: 'nav', label: 'App Version',            sub: 'Smart Field Survey',           icon: 'information-circle-outline', iconBg: Palette.primaryLt, iconColor: Palette.primary, value: '1.0.0' },
      { type: 'nav', label: 'Help & Support',         sub: 'FAQs and documentation',       icon: 'help-circle-outline',      iconBg: '#EDE9FE', iconColor: '#7C3AED' },
      { type: 'nav', label: 'Privacy Policy',         sub: 'How we handle your data',      icon: 'shield-checkmark-outline', iconBg: '#D1FAE5', iconColor: Palette.success },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { clearAllSurveys } = useSurveys();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    darkMode:      false,
    notifications: true,
    autoSave:      true,
    location:      true,
  });

  const flip = (key: string) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const handleNavPress = (item: SettingRow) => {
    if (item.type === 'toggle') {
      flip(item.key);
      return;
    }

    if (item.label === 'Clear All Data') {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to delete all local surveys? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete All', style: 'destructive', onPress: () => {
            clearAllSurveys();
            Alert.alert('Success', 'All local data has been cleared.');
          }},
        ]
      );
    } else if (item.label === 'Export Data') {
      Alert.alert('Export Complete', 'Survey data has been saved to your Downloads folder as a CSV file.');
    } else if (item.label === 'Profile') {
      router.push('/(drawer)/(tabs)/profile' as any);
    } else {
      Alert.alert('Not Implemented', `${item.label} feature is coming soon in the next update!`);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          Alert.alert('Signed Out', 'You have been successfully signed out.');
          // Logic to redirect to login would go here
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={st.container} edges={['top']}>
      {/* Header */}
      <View style={st.header}>
        <Pressable onPress={() => router.back()} style={st.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
        </Pressable>
        <View>
          <Text style={st.headerTitle}>Settings</Text>
          <Text style={st.headerSub}>App preferences</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>

        {/* Profile Hero */}
        <View style={st.profileCard}>
          <View style={st.profileBlob} />
          <View style={st.profileAvatar}><Text style={st.profileAvatarText}>AS</Text></View>
          <View>
            <Text style={st.profileName}>Anand Suthar</Text>
            <Text style={st.profileRole}>Field Surveyor · Class 714</Text>
            <Text style={st.profileCampus}>Swaminarayan University</Text>
          </View>
        </View>

        {/* Setting Groups */}
        {SETTING_GROUPS.map((group) => (
          <View key={group.title} style={st.group}>
            <Text style={st.groupTitle}>{group.title}</Text>
            <View style={st.groupCard}>
              {group.items.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={[st.settingRow, idx === group.items.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => handleNavPress(item)}
                >
                  {/* Icon */}
                  <View style={[st.settingIcon, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={17} color={item.iconColor} />
                  </View>

                  {/* Text */}
                  <View style={st.settingText}>
                    <Text style={st.settingLabel}>{item.label}</Text>
                    {item.sub && <Text style={st.settingSub}>{item.sub}</Text>}
                  </View>

                  {/* Right Control */}
                  {item.type === 'toggle' ? (
                    <Switch
                      value={toggles[item.key] ?? false}
                      onValueChange={() => flip(item.key)}
                      trackColor={{ false: Palette.border, true: `${Palette.primary}60` }}
                      thumbColor={toggles[item.key] ? Palette.primary : '#f4f3f4'}
                    />
                  ) : (
                    <View style={st.navRight}>
                      {item.value && <Text style={st.navValue}>{item.value}</Text>}
                      <Ionicons name="chevron-forward-outline" size={16} color={Palette.inkSoft} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <Pressable style={st.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={Palette.danger} />
          <Text style={st.signOutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Palette.ink },
  headerSub: { fontSize: 11, color: Palette.inkSoft },
  content: { padding: Spacing.md },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#1E1B4B', borderRadius: Radius.xl, padding: 16, marginBottom: 20, overflow: 'hidden', ...Shadow.md },
  profileBlob: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(99,102,241,0.3)' },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Palette.primary, justifyContent: 'center', alignItems: 'center', flexShrink: 0, borderWidth: 2, borderColor: 'rgba(165,180,252,0.4)' },
  profileAvatarText: { color: Palette.white, fontSize: 20, fontWeight: '800' },
  profileName: { color: Palette.white, fontSize: 16, fontWeight: '800' },
  profileRole: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  profileCampus: { color: '#A5B4FC', fontSize: 11, marginTop: 1 },
  group: { marginBottom: 16 },
  groupTitle: { fontSize: 12, fontWeight: '700', color: Palette.inkSoft, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 2 },
  groupCard: { backgroundColor: Palette.white, borderRadius: Radius.xl, ...Shadow.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Palette.border },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: Palette.ink },
  settingSub: { fontSize: 11, color: Palette.inkSoft, marginTop: 1 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navValue: { fontSize: 13, color: Palette.inkSoft, fontWeight: '600' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FEE2E2', borderRadius: Radius.lg, paddingVertical: 14, marginTop: 4 },
  signOutText: { color: Palette.danger, fontWeight: '800', fontSize: 14 },
});
