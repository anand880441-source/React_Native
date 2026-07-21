/**
 * Module 5 — Contacts
 * Permission, fetch, search, counter, pull-to-refresh,
 * avatar initials, copy number, "No Number", empty state
 */
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import React, { useState, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';

type ContactItem = {
  id: string;
  name: string;
  phone?: string;
  initials: string;
};

const AVATAR_COLORS = [Palette.primary, '#0F766E', '#7C3AED', '#C2410C', '#0EA5E9', '#059669'];

function getColor(name: string) {
  let hash = 0;
  for (const ch of name) hash += ch.charCodeAt(0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function ContactCard({ contact, onCopy }: { contact: ContactItem; onCopy: () => void }) {
  const color = getColor(contact.name);
  return (
    <View style={cs.card}>
      <View style={[cs.avatar, { backgroundColor: `${color}20` }]}>
        <Text style={[cs.avatarText, { color }]}>{contact.initials}</Text>
      </View>
      <View style={cs.info}>
        <Text style={cs.name}>{contact.name}</Text>
        <Text style={[cs.phone, !contact.phone && cs.noNumber]}>
          {contact.phone ?? 'No Number'}
        </Text>
      </View>
      {contact.phone && (
        <Pressable style={cs.copyBtn} onPress={onCopy}>
          <Ionicons name="copy-outline" size={16} color={Palette.primary} />
        </Pressable>
      )}
    </View>
  );
}

export default function ContactsScreen() {
  const router = useRouter();
  const [contacts,   setContacts]   = useState<ContactItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [denied,     setDenied]     = useState(false);
  const [search,     setSearch]     = useState('');

  const fetchContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') { setDenied(true); setLoading(false); return; }
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
      const mapped: ContactItem[] = data
        .filter(c => !!c.name)
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
        .map(c => ({
          id:       c.id ?? c.name ?? Math.random().toString(),
          name:     c.name ?? 'Unknown',
          phone:    c.phoneNumbers?.[0]?.number,
          initials: (c.name ?? '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        }));
      setContacts(mapped);
    } catch {
      Alert.alert('Error', 'Could not load contacts.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchContacts(); };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return contacts;
    return contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.phone?.includes(q) ?? false)
    );
  }, [contacts, search]);

  const handleCopy = async (contact: ContactItem) => {
    if (!contact.phone) return;
    await Clipboard.setStringAsync(contact.phone);
    Alert.alert('✅ Copied!', `${contact.phone} copied to clipboard.`);
  };

  if (loading) {
    return (
      <SafeAreaView style={cs.container} edges={['top']}>
        <View style={cs.header}>
          <Pressable onPress={() => router.back()} style={cs.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
          </Pressable>
          <Text style={cs.headerTitle}>Contacts</Text>
        </View>
        <View style={cs.center}>
          <ActivityIndicator size="large" color={Palette.primary} />
          <Text style={cs.loadingText}>Loading contacts…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (denied) {
    return (
      <SafeAreaView style={cs.container} edges={['top']}>
        <View style={cs.header}>
          <Pressable onPress={() => router.back()} style={cs.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
          </Pressable>
          <Text style={cs.headerTitle}>Contacts</Text>
        </View>
        <View style={cs.center}>
          <Ionicons name="people-outline" size={60} color={Palette.border} />
          <Text style={cs.emptyTitle}>Permission Denied</Text>
          <Text style={cs.emptySub}>Enable contacts access in your device settings.</Text>
          <Pressable style={cs.permBtn} onPress={fetchContacts}>
            <Text style={cs.permBtnText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={cs.container} edges={['top']}>
      {/* Header */}
      <View style={cs.header}>
        <Pressable onPress={() => router.back()} style={cs.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={cs.headerTitle}>Contacts</Text>
          <Text style={cs.headerSub}>{contacts.length} contacts</Text>
        </View>
      </View>

      {/* Search */}
      <View style={cs.searchWrap}>
        <Ionicons name="search-outline" size={16} color={Palette.inkSoft} />
        <TextInput
          style={cs.searchInput}
          placeholder="Search name or number…"
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

      {/* Counter */}
      <View style={cs.counter}>
        <Text style={cs.counterText}>Showing {filtered.length} of {contacts.length} contacts</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={cs.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Palette.primary]} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={cs.emptyState}>
            <Ionicons name="people-outline" size={52} color={Palette.border} />
            <Text style={cs.emptyTitle}>No contacts found</Text>
            <Text style={cs.emptySub}>Try a different search term</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ContactCard contact={item} onCopy={() => handleCopy(item)} />
        )}
      />
    </SafeAreaView>
  );
}

const cs = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Palette.ink },
  headerSub: { fontSize: 11, color: Palette.inkSoft },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: Spacing.xl },
  loadingText: { fontSize: 14, color: Palette.inkSoft },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: Spacing.md, backgroundColor: Palette.white, borderRadius: Radius.lg, paddingHorizontal: 12, borderWidth: 1.5, borderColor: Palette.border },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 14, color: Palette.ink },
  counter: { paddingHorizontal: Spacing.md, marginBottom: 8 },
  counterText: { fontSize: 12, color: Palette.inkSoft, fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: 40 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Palette.white, borderRadius: Radius.lg, padding: 12, ...Shadow.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  avatarText: { fontSize: 14, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: Palette.ink },
  phone: { fontSize: 12, color: Palette.inkSoft, marginTop: 2 },
  noNumber: { fontStyle: 'italic', color: Palette.border },
  copyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Palette.inkMid },
  emptySub: { fontSize: 13, color: Palette.inkSoft },
  permBtn: { backgroundColor: Palette.primary, borderRadius: Radius.lg, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  permBtnText: { color: Palette.white, fontWeight: '800' },
});
