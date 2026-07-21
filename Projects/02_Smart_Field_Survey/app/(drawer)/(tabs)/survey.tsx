/**
 * Module 2 — Create Survey
 * Fields: Site Name, Client Name, Description, Priority, Date
 * Expo Integration: Camera attachment, Contacts selection, and Location fetching.
 * Validates required fields → saves to store → navigates to preview
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';
import { addSurvey, generateId, type Priority } from '@/hooks/use-surveys';

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

const PRIORITY_META: Record<Priority, { color: string; bg: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  High:   { color: Palette.danger,  bg: '#FEE2E2', icon: 'flame-outline' },
  Medium: { color: Palette.warning, bg: '#FEF3C7', icon: 'alert-circle-outline' },
  Low:    { color: Palette.success, bg: '#D1FAE5', icon: 'leaf-outline' },
};

// ─── Reusable Field ───────────────────────────────────────────────────────────

function FormField({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  required = false,
  error = false,
}: {
  label: string;
  placeholder: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  required?: boolean;
  error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={sf.fieldWrap}>
      <View style={sf.labelRow}>
        <Text style={sf.fieldLabel}>{label}</Text>
        {required && <Text style={sf.required}>*</Text>}
      </View>
      <View style={[sf.inputRow, focused && sf.inputFocused, error && sf.inputError, multiline && sf.inputMultiRow]}>
        <Ionicons name={icon} size={16} color={focused ? (error ? Palette.danger : Palette.primary) : Palette.inkSoft} style={sf.inputIcon} />
        <TextInput
          style={[sf.input, multiline && sf.inputMulti]}
          placeholder={placeholder}
          placeholderTextColor={Palette.inkSoft}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error && <Text style={sf.errorText}>This field is required</Text>}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreateSurveyScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Core Survey Details
  const [siteName,    setSiteName]    = useState('');
  const [clientName,  setClientName]  = useState('');
  const [description, setDescription] = useState('');
  const [priority,    setPriority]    = useState<Priority>('Medium');
  const [date,        setDate]        = useState(new Date().toISOString().split('T')[0]);

  // Integrated Expo API state
  const [photoUri,    setPhotoUri]    = useState<string | undefined>(undefined);
  const [capturedAt,  setCapturedAt]  = useState<string | undefined>(undefined);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [latitude,    setLatitude]    = useState<number | undefined>(undefined);
  const [longitude,   setLongitude]   = useState<number | undefined>(undefined);
  const [accuracy,    setAccuracy]    = useState<number | undefined>(undefined);
  
  // UI Helpers
  const [locLoading,  setLocLoading]  = useState(false);
  const [errors,      setErrors]      = useState<Record<string, boolean>>({});

  // 1. Pick/Capture Image helper
  const handleAttachImage = async () => {
    Alert.alert('Attach Site Image', 'Choose an action to add evidence', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permissions are required.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setPhotoUri(result.assets[0].uri);
            setCapturedAt(new Date().toLocaleTimeString());
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Gallery access permissions are required.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setPhotoUri(result.assets[0].uri);
            setCapturedAt(new Date().toLocaleTimeString());
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // 2. Select Contact helper
  const handleSelectContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Contacts access is required.');
      return;
    }
    try {
      const contact = await Contacts.presentContactPickerAsync();
      if (contact) {
        setContactName(contact.name);
        const phone = contact.phoneNumbers?.[0]?.number ?? '';
        setContactPhone(phone);
        if (!clientName) setClientName(contact.name); // convenience auto-fill
      }
    } catch {
      Alert.alert('Error', 'Failed to retrieve selected contact.');
    }
  };

  // 3. Fetch current location helper
  const handleFetchLocation = async () => {
    setLocLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permissions are required.');
      setLocLoading(false);
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      setAccuracy(loc.coords.accuracy ?? undefined);
    } catch {
      Alert.alert('Error', 'Failed to fetch location coordinate.');
    } finally {
      setLocLoading(false);
    }
  };

  const validate = () => {
    const e: Record<string, boolean> = {};
    if (!siteName.trim())   e.siteName   = true;
    if (!clientName.trim()) e.clientName = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const constructSurveyPayload = (id: string) => {
    return {
      id,
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date,
      photoUri,
      capturedAt,
      contactName: contactName.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      latitude,
      longitude,
      accuracy,
    };
  };

  const handleSaveDraft = () => {
    if (!validate()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields before saving.');
      return;
    }
    const id = generateId();
    addSurvey(constructSurveyPayload(id));
    Alert.alert('Draft Saved', `Survey ${id} saved as draft.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleNext = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Site Name and Client Name are required.');
      return;
    }
    const id = generateId();
    addSurvey(constructSurveyPayload(id));
    router.push({ pathname: '/(drawer)/survey-preview' as any, params: { surveyId: id } });
  };

  return (
    <SafeAreaView style={sf.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>

        {/* Header */}
        <View style={sf.header}>
          <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={sf.backBtn}>
            <Ionicons name="menu-outline" size={24} color={Palette.ink} />
          </Pressable>
          <View>
            <Text style={sf.headerTitle}>New Survey</Text>
            <Text style={sf.headerSub}>Fill in the field details</Text>
          </View>
          <View style={sf.stepBadge}><Text style={sf.stepText}>Step 1 / 2</Text></View>
        </View>

        <ScrollView contentContainerStyle={sf.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Section: Site Info */}
          <View style={sf.section}>
            <View style={sf.sectionHeader}>
              <View style={[sf.sectionIcon, { backgroundColor: Palette.primaryLt }]}>
                <Ionicons name="business-outline" size={16} color={Palette.primary} />
              </View>
              <Text style={sf.sectionTitle}>Site Information</Text>
            </View>
            <FormField label="Site Name" placeholder="e.g. Swaminarayan Campus" icon="location-outline" value={siteName} onChangeText={setSiteName} required error={!!errors.siteName} />
            <FormField label="Client Name" placeholder="e.g. Harshil Patel" icon="person-outline" value={clientName} onChangeText={setClientName} required error={!!errors.clientName} />
            <FormField label="Description" placeholder="Describe the survey purpose…" icon="document-text-outline" value={description} onChangeText={setDescription} multiline />
          </View>

          {/* Section: Camera & Evidence */}
          <View style={sf.section}>
            <View style={sf.sectionHeader}>
              <View style={[sf.sectionIcon, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="camera-outline" size={16} color="#7C3AED" />
              </View>
              <Text style={sf.sectionTitle}>Attach Site Image</Text>
            </View>
            
            {photoUri ? (
              <View style={sf.photoWrap}>
                <Image source={{ uri: photoUri }} style={sf.photoPreview} />
                <Pressable style={sf.deletePhotoBtn} onPress={() => { setPhotoUri(undefined); setCapturedAt(undefined); }}>
                  <Ionicons name="trash-outline" size={18} color={Palette.white} />
                </Pressable>
                {capturedAt && <Text style={sf.capturedAtText}>Captured: {capturedAt}</Text>}
              </View>
            ) : (
              <Pressable style={sf.mediaPlaceholder} onPress={handleAttachImage}>
                <Ionicons name="camera-outline" size={32} color={Palette.primary} />
                <Text style={sf.mediaPlaceholderText}>Take Photo or Choose Gallery</Text>
              </Pressable>
            )}
          </View>

          {/* Section: Contact Details */}
          <View style={sf.section}>
            <View style={sf.sectionHeader}>
              <View style={[sf.sectionIcon, { backgroundColor: '#CCFBF1' }]}>
                <Ionicons name="call-outline" size={16} color="#0F766E" />
              </View>
              <Text style={sf.sectionTitle}>Contact Details</Text>
              <Pressable style={sf.contactPickBtn} onPress={handleSelectContact}>
                <Ionicons name="people-outline" size={14} color={Palette.primary} />
                <Text style={sf.contactPickText}>Pick Contact</Text>
              </Pressable>
            </View>
            
            <FormField label="Contact Name" placeholder="Contact Person Name" icon="person-outline" value={contactName} onChangeText={setContactName} />
            <FormField label="Contact Phone" placeholder="Phone Number" icon="call-outline" value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />
          </View>

          {/* Section: GPS Location */}
          <View style={sf.section}>
            <View style={sf.sectionHeader}>
              <View style={[sf.sectionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="navigate-outline" size={16} color={Palette.warning} />
              </View>
              <Text style={sf.sectionTitle}>Location Coordinates</Text>
              <Pressable style={sf.locFetchBtn} onPress={handleFetchLocation} disabled={locLoading}>
                {locLoading ? (
                  <ActivityIndicator size="small" color={Palette.primary} />
                ) : (
                  <>
                    <Ionicons name="location-outline" size={14} color={Palette.primary} />
                    <Text style={sf.locFetchText}>Get GPS</Text>
                  </>
                )}
              </Pressable>
            </View>

            {latitude && longitude ? (
              <View style={sf.gpsInfoWrap}>
                <View style={sf.gpsRow}>
                  <Text style={sf.gpsLabel}>Latitude:</Text>
                  <Text style={sf.gpsValue}>{latitude.toFixed(6)}</Text>
                </View>
                <View style={sf.gpsRow}>
                  <Text style={sf.gpsLabel}>Longitude:</Text>
                  <Text style={sf.gpsValue}>{longitude.toFixed(6)}</Text>
                </View>
                {accuracy && (
                  <View style={sf.gpsRow}>
                    <Text style={sf.gpsLabel}>Accuracy:</Text>
                    <Text style={sf.gpsValue}>±{accuracy.toFixed(1)} m</Text>
                  </View>
                )}
                <Pressable style={sf.clearGpsBtn} onPress={() => { setLatitude(undefined); setLongitude(undefined); setAccuracy(undefined); }}>
                  <Text style={sf.clearGpsText}>Clear GPS Coordinates</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={sf.mediaPlaceholder} onPress={handleFetchLocation}>
                <Ionicons name="location-outline" size={32} color={Palette.warning} />
                <Text style={sf.mediaPlaceholderText}>Tap to Fetch GPS Coordinates</Text>
              </Pressable>
            )}
          </View>

          {/* Section: Priority */}
          <View style={sf.section}>
            <View style={sf.sectionHeader}>
              <View style={[sf.sectionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="flag-outline" size={16} color={Palette.danger} />
              </View>
              <Text style={sf.sectionTitle}>Priority</Text>
            </View>
            <View style={sf.priorityRow}>
              {PRIORITIES.map((p) => {
                const meta = PRIORITY_META[p];
                const active = priority === p;
                return (
                  <Pressable key={p} onPress={() => setPriority(p)} style={[sf.priorityBtn, active && { backgroundColor: meta.bg, borderColor: meta.color }]}>
                    <Ionicons name={meta.icon} size={16} color={active ? meta.color : Palette.inkSoft} />
                    <Text style={[sf.priorityLabel, active && { color: meta.color, fontWeight: '800' }]}>{p}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section: Date */}
          <View style={sf.section}>
            <View style={sf.sectionHeader}>
              <View style={[sf.sectionIcon, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="calendar-outline" size={16} color="#7C3AED" />
              </View>
              <Text style={sf.sectionTitle}>Survey Date</Text>
            </View>
            <FormField label="Date (YYYY-MM-DD)" placeholder="2026-07-20" icon="calendar-outline" value={date} onChangeText={setDate} />
          </View>

          {/* Actions */}
          <View style={sf.actions}>
            <Pressable style={sf.btnOutline} onPress={handleSaveDraft}>
              <Ionicons name="save-outline" size={18} color={Palette.primary} />
              <Text style={sf.btnOutlineText}>Save Draft</Text>
            </Pressable>
            <Pressable style={sf.btnPrimary} onPress={handleNext}>
              <Text style={sf.btnPrimaryText}>Next (Preview) →</Text>
            </Pressable>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const sf = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Palette.ink, letterSpacing: -0.3 },
  headerSub: { fontSize: 11, color: Palette.inkSoft, marginTop: 1 },
  stepBadge: { marginLeft: 'auto', backgroundColor: Palette.primaryLt, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  stepText: { color: Palette.primary, fontSize: 12, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  section: { backgroundColor: Palette.white, borderRadius: Radius.xl, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.md, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Palette.border },
  sectionIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Palette.ink },
  fieldWrap: { marginBottom: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: Palette.inkMid, letterSpacing: 0.2 },
  required: { color: Palette.danger, fontWeight: '800', fontSize: 13 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Palette.surface, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Palette.border, paddingHorizontal: 10, gap: 8 },
  inputFocused: { borderColor: Palette.primary, backgroundColor: Palette.primaryLt },
  inputError: { borderColor: Palette.danger, backgroundColor: '#FEF2F2' },
  inputMultiRow: { alignItems: 'flex-start', paddingTop: 10 },
  inputIcon: { marginTop: 2 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: Palette.ink },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  errorText: { color: Palette.danger, fontSize: 11, marginTop: 4 },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Palette.border, backgroundColor: Palette.surface },
  priorityLabel: { fontSize: 13, fontWeight: '600', color: Palette.inkSoft },
  actions: { flexDirection: 'row', gap: 10 },
  btnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 14 },
  btnOutlineText: { color: Palette.primary, fontWeight: '700', fontSize: 14 },
  btnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 14, ...Shadow.lg },
  btnPrimaryText: { color: Palette.white, fontWeight: '800', fontSize: 14 },
  
  // Native integration additions
  mediaPlaceholder: { height: 100, borderStyle: 'dashed', borderWidth: 2, borderColor: Palette.border, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', gap: 8 },
  mediaPlaceholderText: { color: Palette.inkSoft, fontSize: 13, fontWeight: '600' },
  photoWrap: { borderRadius: Radius.md, overflow: 'hidden', height: 160, backgroundColor: Palette.surface, position: 'relative' },
  photoPreview: { width: '100%', height: '100%' },
  deletePhotoBtn: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(220, 38, 38, 0.85)', justifyContent: 'center', alignItems: 'center' },
  capturedAtText: { position: 'absolute', bottom: 8, left: 12, color: Palette.white, fontSize: 11, backgroundColor: 'rgba(15, 23, 42, 0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  contactPickBtn: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Palette.primaryLt, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.md },
  contactPickText: { color: Palette.primary, fontSize: 12, fontWeight: '700' },
  locFetchBtn: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Palette.primaryLt, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.md },
  locFetchText: { color: Palette.primary, fontSize: 12, fontWeight: '700' },
  gpsInfoWrap: { backgroundColor: Palette.surface, borderRadius: Radius.md, padding: 12, gap: 8 },
  gpsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gpsLabel: { fontSize: 13, color: Palette.inkSoft, fontWeight: '600' },
  gpsValue: { fontSize: 13, color: Palette.ink, fontWeight: '700' },
  clearGpsBtn: { marginTop: 4, paddingVertical: 8, alignItems: 'center' },
  clearGpsText: { color: Palette.danger, fontSize: 12, fontWeight: '700' },
});
