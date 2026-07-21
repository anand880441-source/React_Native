/**
 * Module 6 — Clipboard
 * Copy Survey ID, contact number, current location
 * Paste Notes (read clipboard), Clear clipboard
 */
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';
import { getSurveys } from '@/hooks/use-surveys';

export default function ClipboardScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [log, setLog] = useState<{ text: string; time: string }[]>([]);

  const addLog = (text: string) => {
    setLog(prev => [{ text, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  };

  const copySurveyId = async () => {
    const surveys = getSurveys();
    const id = surveys[0]?.id ?? 'SRV-N/A';
    await Clipboard.setStringAsync(id);
    addLog(`Copied Survey ID: ${id}`);
    Alert.alert('✅ Copied!', `Survey ID "${id}" copied to clipboard.`);
  };

  const copyContactNumber = async () => {
    const number = '+91 98765 43210';
    await Clipboard.setStringAsync(number);
    addLog(`Copied number: ${number}`);
    Alert.alert('✅ Copied!', `Number "${number}" copied to clipboard.`);
  };

  const copyLocation = async () => {
    const text = 'Lat: 23.022505, Lon: 72.571365';
    await Clipboard.setStringAsync(text);
    addLog(`Copied location: ${text}`);
    Alert.alert('✅ Copied!', `Location copied:\n${text}`);
  };

  const pasteNotes = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setNotes(prev => prev ? `${prev}\n${text}` : text);
      addLog(`Pasted: "${text.slice(0, 30)}…"`);
    } else {
      Alert.alert('Clipboard Empty', 'Nothing to paste.');
    }
  };

  const clearClipboard = async () => {
    Alert.alert('Clear Clipboard', 'This will clear all clipboard data.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          await Clipboard.setStringAsync('');
          setNotes('');
          addLog('Clipboard cleared');
          Alert.alert('Cleared', 'Clipboard data has been cleared.');
        },
      },
    ]);
  };

  const actions = [
    { label: 'Copy Latest Survey ID', icon: 'document-text-outline' as const, color: Palette.primary, bg: Palette.primaryLt, onPress: copySurveyId },
    { label: 'Copy Contact Number', icon: 'call-outline' as const, color: '#0F766E', bg: '#CCFBF1', onPress: copyContactNumber },
    { label: 'Copy Current Location', icon: 'location-outline' as const, color: '#7C3AED', bg: '#EDE9FE', onPress: copyLocation },
  ];

  return (
    <SafeAreaView style={cb.container} edges={['top']}>
      {/* Header */}
      <View style={cb.header}>
        <Pressable onPress={() => router.back()} style={cb.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
        </Pressable>
        <View>
          <Text style={cb.headerTitle}>Clipboard</Text>
          <Text style={cb.headerSub}>Copy, paste, and manage data</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={cb.content} showsVerticalScrollIndicator={false}>

        {/* Copy Actions */}
        <Text style={cb.sectionTitle}>Copy Actions</Text>
        <View style={cb.actionsCard}>
          {actions.map((a, idx) => (
            <Pressable
              key={a.label}
              style={[cb.actionRow, idx === actions.length - 1 && { borderBottomWidth: 0 }]}
              onPress={a.onPress}
            >
              <View style={[cb.actionIcon, { backgroundColor: a.bg }]}>
                <Ionicons name={a.icon} size={18} color={a.color} />
              </View>
              <Text style={cb.actionLabel}>{a.label}</Text>
              <View style={cb.actionArrow}>
                <Ionicons name="copy-outline" size={16} color={a.color} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Paste Notes */}
        <Text style={cb.sectionTitle}>Paste Notes</Text>
        <View style={cb.notesCard}>
          <TextInput
            style={cb.notesInput}
            placeholder="Notes will appear here after pasting…"
            placeholderTextColor={Palette.inkSoft}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <View style={cb.notesActions}>
            <Pressable style={cb.pasteBtn} onPress={pasteNotes}>
              <Ionicons name="clipboard-outline" size={16} color={Palette.primary} />
              <Text style={cb.pasteBtnText}>Paste from Clipboard</Text>
            </Pressable>
            <Pressable style={cb.clearBtn} onPress={clearClipboard}>
              <Ionicons name="trash-outline" size={16} color={Palette.danger} />
            </Pressable>
          </View>
        </View>

        {/* Activity Log */}
        {log.length > 0 && (
          <>
            <Text style={cb.sectionTitle}>Activity Log</Text>
            <View style={cb.logCard}>
              {log.map((entry, i) => (
                <View key={i} style={[cb.logRow, i === log.length - 1 && { borderBottomWidth: 0 }]}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={Palette.success} />
                  <Text style={cb.logText} numberOfLines={1}>{entry.text}</Text>
                  <Text style={cb.logTime}>{entry.time}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const cb = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Palette.ink },
  headerSub: { fontSize: 11, color: Palette.inkSoft, marginTop: 1 },
  content: { padding: Spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Palette.ink, marginBottom: 10, letterSpacing: -0.1 },
  actionsCard: { backgroundColor: Palette.white, borderRadius: Radius.xl, marginBottom: Spacing.md, ...Shadow.sm },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Palette.border },
  actionIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Palette.ink },
  actionArrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center' },
  notesCard: { backgroundColor: Palette.white, borderRadius: Radius.xl, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm },
  notesInput: { minHeight: 120, fontSize: 14, color: Palette.ink, borderWidth: 1.5, borderColor: Palette.border, borderRadius: Radius.md, padding: 12, marginBottom: 10 },
  notesActions: { flexDirection: 'row', gap: 8 },
  pasteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: Palette.primary, borderRadius: Radius.md, paddingVertical: 10 },
  pasteBtnText: { color: Palette.primary, fontWeight: '700', fontSize: 13 },
  clearBtn: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  logCard: { backgroundColor: Palette.white, borderRadius: Radius.xl, padding: 4, ...Shadow.sm },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Palette.border },
  logText: { flex: 1, fontSize: 12, color: Palette.inkMid },
  logTime: { fontSize: 10, color: Palette.inkSoft },
});
