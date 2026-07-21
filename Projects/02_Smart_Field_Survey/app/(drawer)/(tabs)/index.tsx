import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Palette, Shadow, Radius, Spacing } from '@/constants/theme';
import { useSurveys } from '@/hooks/use-surveys';

const { width: SCREEN_W } = Dimensions.get('window');

const quickActions = [
  { title: 'Start Survey',  description: 'Capture new field data',   icon: 'clipboard-outline' as const, color: Palette.primary,  bg: Palette.primaryLt },
  { title: 'View Queue',    description: 'Pending school visits',      icon: 'list-outline' as const,      color: '#0F766E',        bg: '#CCFBF1' },
  { title: 'Upload Data',   description: 'Sync collected surveys',     icon: 'cloud-upload-outline' as const, color: '#C2410C',    bg: '#FEF3C7' },
  { title: 'Reports',       description: 'Analytics & trends',         icon: 'bar-chart-outline' as const, color: '#7C3AED',       bg: '#EDE9FE' },
];

function ActionCard({ item, onPress }: { item: typeof quickActions[0], onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 8 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, friction: 8 }).start();
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.actionCard, { transform: [{ scale }] }]}>
        <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionDescription}>{item.description}</Text>
        <View style={[styles.actionAccent, { backgroundColor: item.color }]} />
      </Animated.View>
    </Pressable>
  );
}

const priorityColor: Record<string, string> = {
  High: Palette.danger, Medium: Palette.warning, Low: Palette.success,
};

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { surveys } = useSurveys();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = surveys.filter(s => s.date === todayStr || s.submittedAt?.startsWith(todayStr)).length;
  const submitted  = surveys.filter(s => !!s.submittedAt).length;
  const pending    = surveys.length - submitted;

  const handleQuickAction = (item: typeof quickActions[0]) => {
    if (item.title === 'Start Survey') {
      router.push('/(drawer)/(tabs)/survey' as any);
    } else if (item.title === 'View Queue') {
      router.push('/(drawer)/(tabs)/history' as any);
    } else if (item.title === 'Upload Data') {
      Alert.alert('Data Sync', 'All pending surveys have been synced to the server successfully.');
    } else {
      Alert.alert('Reports', 'Detailed analytics will be available in the next update.');
    }
  };

  const stats = [
    { label: 'Today',     value: String(todayCount), icon: 'document-text-outline' as const, color: Palette.primary },
    { label: 'Pending',   value: String(pending),    icon: 'time-outline' as const,           color: Palette.warning },
    { label: 'Submitted', value: String(submitted),  icon: 'checkmark-circle-outline' as const, color: Palette.success },
  ];

  const recent = surveys.slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
              style={styles.iconButton}
              accessibilityLabel="Open navigation drawer"
            >
              <Ionicons name="menu-outline" size={24} color={Palette.ink} />
            </Pressable>
            <View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.userName}>Anand Suthar</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <Pressable 
              style={styles.iconButton} 
              accessibilityLabel="Notifications"
              onPress={() => Alert.alert('Notifications', 'You have 1 new survey task assigned today.')}
            >
              <View style={styles.badge} />
              <Ionicons name="notifications-outline" size={20} color={Palette.ink} />
            </Pressable>
            <Pressable 
              style={styles.avatar} 
              accessibilityLabel="View Profile"
              onPress={() => router.push('/(drawer)/(tabs)/profile' as any)}
            >
              <Text style={styles.avatarText}>AS</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroBlobTL} /><View style={styles.heroBlobBR} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="person-circle-outline" size={14} color="#A5B4FC" />
              <Text style={styles.heroBadgeText}>Student Details</Text>
            </View>
            <Text style={styles.heroIdText}>ID · 108539</Text>
          </View>
          <Text style={styles.heroName}>Anand Suthar</Text>
          <View style={styles.heroDetails}>
            {[
              { label: 'Class',  value: '714' },
              { label: 'Campus', value: 'Swaminarayan University' },
              { label: 'Role',   value: 'Field Surveyor' },
            ].map((d) => (
              <View key={d.label} style={styles.heroDetailRow}>
                <Text style={styles.heroDetailLabel}>{d.label}</Text>
                <Text style={styles.heroDetailValue}>{d.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: `${s.color}18` }]}>
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Quick Actions ── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {quickActions.map((item) => (
            <ActionCard key={item.title} item={item} onPress={() => handleQuickAction(item)} />
          ))}
        </View>

        {/* ── Recent Surveys ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Surveys</Text>
          <Pressable onPress={() => router.push('/(drawer)/(tabs)/history' as any)}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          {recent.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={36} color={Palette.border} />
              <Text style={styles.emptyText}>No surveys yet. Start one!</Text>
            </View>
          ) : recent.map((survey, idx) => (
            <View key={survey.id} style={[styles.summaryRow, idx === recent.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.surveyAvatar}>
                <Text style={styles.surveyAvatarText}>
                  {survey.clientName.split(' ').map((n) => n[0]).join('').slice(0,2)}
                </Text>
              </View>
              <View style={styles.surveyInfo}>
                <Text style={styles.summaryName}>{survey.clientName}</Text>
                <View style={styles.surveyLocationRow}>
                  <Ionicons name="business-outline" size={11} color={Palette.inkSoft} />
                  <Text style={styles.summaryLocation}>{survey.siteName}</Text>
                </View>
              </View>
              <View style={styles.summaryMeta}>
                <View style={[styles.priorityDot, { backgroundColor: priorityColor[survey.priority] ?? Palette.inkSoft }]} />
                <View style={[styles.statusBadge, survey.submittedAt ? styles.statusBadgeComplete : styles.statusBadgePending]}>
                  <Text style={[styles.statusText, survey.submittedAt ? styles.statusTextComplete : styles.statusTextPending]}>
                    {survey.submittedAt ? 'Done' : 'Draft'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  greeting: { color: Palette.inkSoft, fontSize: 13, marginBottom: 2 },
  userName: { color: Palette.ink, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: Palette.white, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.danger, zIndex: 1, borderWidth: 1.5, borderColor: Palette.white },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Palette.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Palette.white, fontWeight: '800', fontSize: 15 },
  heroCard: { backgroundColor: '#1E1B4B', borderRadius: Radius.xl, padding: Spacing.md, marginBottom: Spacing.md, overflow: 'hidden', ...Shadow.lg },
  heroBlobTL: { position: 'absolute', top: -40, left: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(99,102,241,0.35)' },
  heroBlobBR: { position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(16,185,129,0.20)' },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(165,180,252,0.15)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(165,180,252,0.3)' },
  heroBadgeText: { color: '#A5B4FC', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  heroIdText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
  heroName: { color: Palette.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.4, marginBottom: Spacing.md },
  heroDetails: { gap: 8 },
  heroDetailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 8 },
  heroDetailLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  heroDetailValue: { color: Palette.white, fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  statCard: { flex: 1, backgroundColor: Palette.white, borderRadius: Radius.lg, padding: 12, alignItems: 'center', ...Shadow.sm },
  statIconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { color: Palette.inkSoft, fontSize: 10, fontWeight: '500', textAlign: 'center', marginTop: 2 },
  sectionTitle: { color: Palette.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.2, marginBottom: 10 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.md },
  actionCard: { width: (SCREEN_W - 32 - 10) / 2, backgroundColor: Palette.white, borderRadius: Radius.lg, padding: 14, minHeight: 120, justifyContent: 'center', overflow: 'hidden', ...Shadow.sm },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionTitle: { fontSize: 14, fontWeight: '800', color: Palette.ink, marginBottom: 3, letterSpacing: -0.2 },
  actionDescription: { fontSize: 11, color: Palette.inkSoft, lineHeight: 15 },
  actionAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg, opacity: 0.6 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAll: { color: Palette.primary, fontSize: 13, fontWeight: '700' },
  summaryCard: { backgroundColor: Palette.white, borderRadius: Radius.xl, padding: 4, ...Shadow.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: Palette.border },
  surveyAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  surveyAvatarText: { color: Palette.primary, fontSize: 13, fontWeight: '800' },
  surveyInfo: { flex: 1 },
  summaryName: { color: Palette.ink, fontWeight: '700', fontSize: 13, marginBottom: 2 },
  surveyLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  summaryLocation: { color: Palette.inkSoft, fontSize: 11 },
  summaryMeta: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  statusBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeComplete: { backgroundColor: '#D1FAE5' },
  statusBadgePending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusTextComplete: { color: Palette.success },
  statusTextPending: { color: Palette.warning },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyText: { color: Palette.inkSoft, fontSize: 14 },
});
