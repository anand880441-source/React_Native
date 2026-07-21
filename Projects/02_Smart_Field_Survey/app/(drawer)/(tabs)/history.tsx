/**
 * Module 8 — Survey History
 * FlatList, search, filter by priority, view details, delete with confirmation
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';
import { useSurveys, deleteSurvey, type Priority, type Survey } from '@/hooks/use-surveys';

const PRIORITY_COLOR: Record<Priority, string> = {
  High: Palette.danger, Medium: Palette.warning, Low: Palette.success,
};
const PRIORITY_BG: Record<Priority, string> = {
  High: '#FEE2E2', Medium: '#FEF3C7', Low: '#D1FAE5',
};

const ALL_FILTER = 'All';
type Filter = Priority | typeof ALL_FILTER;

function SurveyCard({ survey, onDelete, onView }: { survey: Survey; onDelete: () => void; onView: () => void }) {
  const initials = survey.clientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const pColor = PRIORITY_COLOR[survey.priority];
  const pBg = PRIORITY_BG[survey.priority];

  const confirmDelete = () => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete the survey for "${survey.clientName}" at ${survey.siteName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <View style={sc.card}>
      {/* Left accent */}
      <View style={[sc.accent, { backgroundColor: pColor }]} />

      <View style={sc.cardBody}>
        {/* Top row */}
        <View style={sc.cardTop}>
          <View style={sc.avatarWrap}>
            <Text style={sc.avatarText}>{initials}</Text>
          </View>
          <View style={sc.cardMeta}>
            <Text style={sc.cardClient}>{survey.clientName}</Text>
            <View style={sc.siteRow}>
              <Ionicons name="business-outline" size={11} color={Palette.inkSoft} />
              <Text style={sc.cardSite}>{survey.siteName}</Text>
            </View>
          </View>
          <View style={[sc.priorityBadge, { backgroundColor: pBg }]}>
            <Text style={[sc.priorityText, { color: pColor }]}>{survey.priority}</Text>
          </View>
        </View>

        {/* Description */}
        {!!survey.description && (
          <Text style={sc.cardDesc} numberOfLines={2}>{survey.description}</Text>
        )}

        {/* Bottom row */}
        <View style={sc.cardBottom}>
          <View style={sc.dateRow}>
            <Ionicons name="calendar-outline" size={12} color={Palette.inkSoft} />
            <Text style={sc.dateText}>{survey.date}</Text>
          </View>
          <Text style={sc.idText}>{survey.id}</Text>

          <View style={sc.cardActions}>
            <Pressable onPress={onView} style={sc.viewBtn}>
              <Ionicons name="eye-outline" size={16} color={Palette.primary} />
            </Pressable>
            <Pressable onPress={confirmDelete} style={sc.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color={Palette.danger} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { surveys } = useSurveys();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>(ALL_FILTER);

  const filters: Filter[] = [ALL_FILTER, 'High', 'Medium', 'Low'];

  const filtered = useMemo(() => {
    return surveys.filter((s) => {
      const matchPriority = filter === ALL_FILTER || s.priority === filter;
      const q = search.toLowerCase();
      const matchSearch = !q
        || s.clientName.toLowerCase().includes(q)
        || s.siteName.toLowerCase().includes(q)
        || s.id.toLowerCase().includes(q);
      return matchPriority && matchSearch;
    });
  }, [surveys, search, filter]);

  const handleDelete = (id: string) => deleteSurvey(id);

  const handleView = (survey: Survey) => {
    router.push({ pathname: '/(drawer)/survey-preview' as any, params: { surveyId: survey.id } });
  };

  return (
    <SafeAreaView style={sc.container} edges={['top']}>
      {/* Header */}
      <View style={sc.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
            style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border }}
            accessibilityLabel="Open navigation drawer"
          >
            <Ionicons name="menu-outline" size={24} color={Palette.ink} />
          </Pressable>
          <View>
            <Text style={sc.headerTitle}>Survey History</Text>
            <Text style={sc.headerSub}>{surveys.length} total surveys</Text>
          </View>
        </View>
        <Pressable onPress={() => router.push('/(drawer)/(tabs)/survey' as any)} style={sc.addBtn}>
          <Ionicons name="add" size={20} color={Palette.white} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={sc.searchWrap}>
        <Ionicons name="search-outline" size={16} color={Palette.inkSoft} />
        <TextInput
          style={sc.searchInput}
          placeholder="Search by client, site, or ID…"
          placeholderTextColor={Palette.inkSoft}
          value={search}
          onChangeText={setSearch}
        />
        {!!search && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={Palette.inkSoft} />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <View style={sc.filterRow}>
        {filters.map((f) => {
          const active = filter === f;
          const color = f === ALL_FILTER ? Palette.primary : PRIORITY_COLOR[f as Priority];
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[sc.chip, active && { backgroundColor: color, borderColor: color }]}>
              <Text style={[sc.chipText, active && { color: Palette.white }]}>{f}</Text>
            </Pressable>
          );
        })}
        <Text style={sc.countText}>{filtered.length} results</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        contentContainerStyle={sc.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={sc.emptyState}>
            <Ionicons name="clipboard-outline" size={52} color={Palette.border} />
            <Text style={sc.emptyTitle}>No surveys found</Text>
            <Text style={sc.emptyHint}>Try adjusting your search or filter</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SurveyCard
            survey={item}
            onDelete={() => handleDelete(item.id)}
            onView={() => handleView(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const sc = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Palette.ink, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: Palette.inkSoft, marginTop: 2 },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Palette.primary, justifyContent: 'center', alignItems: 'center', ...Shadow.md },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: Spacing.md, backgroundColor: Palette.white, borderRadius: Radius.lg, paddingHorizontal: 12, borderWidth: 1.5, borderColor: Palette.border },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 14, color: Palette.ink },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.md, marginBottom: 10 },
  chip: { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: Palette.border, backgroundColor: Palette.white },
  chipText: { fontSize: 12, fontWeight: '700', color: Palette.inkSoft },
  countText: { marginLeft: 'auto', color: Palette.inkSoft, fontSize: 12, fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: Palette.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  accent: { width: 4 },
  cardBody: { flex: 1, padding: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatarWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  avatarText: { color: Palette.primary, fontSize: 13, fontWeight: '800' },
  cardMeta: { flex: 1 },
  cardClient: { fontSize: 14, fontWeight: '800', color: Palette.ink },
  siteRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardSite: { fontSize: 11, color: Palette.inkSoft },
  priorityBadge: { borderRadius: Radius.full, paddingHorizontal: 9, paddingVertical: 4, flexShrink: 0 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  cardDesc: { fontSize: 12, color: Palette.inkSoft, lineHeight: 17, marginBottom: 8 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dateText: { fontSize: 11, color: Palette.inkSoft },
  idText: { flex: 1, fontSize: 10, color: Palette.inkSoft, textAlign: 'right' },
  cardActions: { flexDirection: 'row', gap: 6 },
  viewBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Palette.inkMid },
  emptyHint: { fontSize: 13, color: Palette.inkSoft },
});
