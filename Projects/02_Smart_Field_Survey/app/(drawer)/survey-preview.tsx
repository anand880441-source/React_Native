/**
 * Module 7 — Survey Preview
 * Displays Site, Client, Photo, Contact, Location, Notes
 * Edit and Submit buttons
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';
import { useSurveys, updateSurvey, type Priority } from '@/hooks/use-surveys';

const PRIORITY_COLOR: Record<Priority, string> = {
  High: Palette.danger, Medium: Palette.warning, Low: Palette.success,
};

function InfoRow({ label, value, icon }: { label: string; value?: string; icon: React.ComponentProps<typeof Ionicons>['name'] }) {
  return (
    <View style={pv.infoRow}>
      <View style={pv.infoLeft}>
        <Ionicons name={icon} size={16} color={Palette.inkSoft} />
        <Text style={pv.infoLabel}>{label}</Text>
      </View>
      <Text style={pv.infoValue}>{value ?? 'Not provided'}</Text>
    </View>
  );
}

export default function SurveyPreviewScreen() {
  const router = useRouter();
  const { surveyId } = useLocalSearchParams<{ surveyId: string }>();
  const { surveys } = useSurveys();
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return (
      <SafeAreaView style={pv.container} edges={['top']}>
        <View style={pv.header}>
          <Pressable onPress={() => router.back()} style={pv.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
          </Pressable>
          <Text style={pv.headerTitle}>Survey Preview</Text>
        </View>
        <View style={pv.center}>
          <Ionicons name="clipboard-outline" size={52} color={Palette.border} />
          <Text style={pv.emptyTitle}>Survey not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = () => {
    Alert.alert(
      'Submit Survey',
      `Are you sure you want to submit survey ${survey.id}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            updateSurvey({ ...survey, submittedAt: new Date().toISOString() });
            Alert.alert('✅ Submitted!', `Survey ${survey.id} submitted successfully.`, [
              { text: 'OK', onPress: () => router.push('/(drawer)/(tabs)/history' as any) },
            ]);
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    router.back();
  };

  const pColor = PRIORITY_COLOR[survey.priority];

  return (
    <SafeAreaView style={pv.container} edges={['top']}>
      {/* Header */}
      <View style={pv.header}>
        <Pressable onPress={() => router.back()} style={pv.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={pv.headerTitle}>Survey Preview</Text>
          <Text style={pv.headerSub}>{survey.id}</Text>
        </View>
        <View style={[pv.priorityBadge, { backgroundColor: `${pColor}20` }]}>
          <Text style={[pv.priorityText, { color: pColor }]}>{survey.priority}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={pv.content} showsVerticalScrollIndicator={false}>

        {/* Photo */}
        <View style={pv.photoCard}>
          {survey.photoUri ? (
            <Image source={{ uri: survey.photoUri }} style={pv.photo} resizeMode="cover" />
          ) : (
            <View style={pv.noPhoto}>
              <Ionicons name="camera-outline" size={40} color="rgba(255,255,255,0.4)" />
              <Text style={pv.noPhotoText}>No photo captured</Text>
              {survey.capturedAt && <Text style={pv.capturedAt}>Captured at: {survey.capturedAt}</Text>}
            </View>
          )}
        </View>

        {/* Site Info */}
        <View style={pv.section}>
          <View style={pv.sectionHeader}>
            <View style={[pv.sectionIcon, { backgroundColor: Palette.primaryLt }]}>
              <Ionicons name="business-outline" size={16} color={Palette.primary} />
            </View>
            <Text style={pv.sectionTitle}>Site Details</Text>
          </View>
          <InfoRow label="Site Name"   value={survey.siteName}   icon="location-outline" />
          <InfoRow label="Client Name" value={survey.clientName} icon="person-outline" />
          <InfoRow label="Date"        value={survey.date}       icon="calendar-outline" />
          {survey.description ? (
            <View style={pv.descWrap}>
              <Ionicons name="document-text-outline" size={14} color={Palette.inkSoft} />
              <Text style={pv.descText}>{survey.description}</Text>
            </View>
          ) : null}
        </View>

        {/* Contact */}
        <View style={pv.section}>
          <View style={pv.sectionHeader}>
            <View style={[pv.sectionIcon, { backgroundColor: '#CCFBF1' }]}>
              <Ionicons name="people-outline" size={16} color="#0F766E" />
            </View>
            <Text style={pv.sectionTitle}>Contact</Text>
          </View>
          <InfoRow label="Contact Name"   value={survey.contactName}  icon="person-outline" />
          <InfoRow label="Contact Phone"  value={survey.contactPhone} icon="call-outline" />
        </View>

        {/* Location */}
        <View style={pv.section}>
          <View style={pv.sectionHeader}>
            <View style={[pv.sectionIcon, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="location-outline" size={16} color="#7C3AED" />
            </View>
            <Text style={pv.sectionTitle}>Location</Text>
          </View>
          <InfoRow label="Latitude"  value={survey.latitude  ? survey.latitude.toFixed(6)  : undefined} icon="navigate-outline" />
          <InfoRow label="Longitude" value={survey.longitude ? survey.longitude.toFixed(6) : undefined} icon="navigate-circle-outline" />
          <InfoRow label="Accuracy"  value={survey.accuracy  ? `±${survey.accuracy.toFixed(1)} m` : undefined} icon="radio-button-on-outline" />
        </View>

        {/* Notes */}
        {survey.notes && (
          <View style={pv.section}>
            <View style={pv.sectionHeader}>
              <View style={[pv.sectionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="create-outline" size={16} color={Palette.warning} />
              </View>
              <Text style={pv.sectionTitle}>Field Notes</Text>
            </View>
            <Text style={pv.notesText}>{survey.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={pv.actions}>
          <Pressable style={pv.editBtn} onPress={handleEdit}>
            <Ionicons name="pencil-outline" size={18} color={Palette.primary} />
            <Text style={pv.editBtnText}>Edit Survey</Text>
          </Pressable>
          <Pressable style={pv.submitBtn} onPress={handleSubmit}>
            <Ionicons name="checkmark-circle-outline" size={18} color={Palette.white} />
            <Text style={pv.submitBtnText}>Submit Survey</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const pv = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Palette.ink },
  headerSub: { fontSize: 11, color: Palette.inkSoft },
  priorityBadge: { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  priorityText: { fontSize: 12, fontWeight: '800' },
  content: { padding: Spacing.md },
  photoCard: { borderRadius: Radius.xl, overflow: 'hidden', height: 200, marginBottom: Spacing.md, ...Shadow.md },
  photo: { flex: 1 },
  noPhoto: { flex: 1, backgroundColor: '#1E1B4B', justifyContent: 'center', alignItems: 'center', gap: 8 },
  noPhotoText: { color: 'rgba(255,255,255,0.45)', fontSize: 14 },
  capturedAt: { color: '#A5B4FC', fontSize: 12 },
  section: { backgroundColor: Palette.white, borderRadius: Radius.xl, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Palette.border },
  sectionIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Palette.ink },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Palette.border },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 13, color: Palette.inkSoft },
  infoValue: { fontSize: 13, fontWeight: '700', color: Palette.ink, flexShrink: 1, textAlign: 'right', maxWidth: '55%' },
  descWrap: { flexDirection: 'row', gap: 8, paddingTop: 10 },
  descText: { flex: 1, fontSize: 13, color: Palette.inkMid, lineHeight: 20 },
  notesText: { fontSize: 13, color: Palette.inkMid, lineHeight: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Palette.inkMid },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 14 },
  editBtnText: { color: Palette.primary, fontWeight: '700', fontSize: 14 },
  submitBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 14, ...Shadow.lg },
  submitBtnText: { color: Palette.white, fontWeight: '800', fontSize: 14 },
});
