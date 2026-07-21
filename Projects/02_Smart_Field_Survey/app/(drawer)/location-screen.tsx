/**
 * Module 4 — Location
 * Permission, display lat/lon/accuracy, refresh, copy to clipboard, success alert
 */
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';

type LocState = 'idle' | 'requesting' | 'loading' | 'success' | 'denied';

interface LocationData {
  latitude:  number;
  longitude: number;
  accuracy:  number | null;
  altitude:  number | null;
  timestamp: number;
}

export default function LocationScreen() {
  const router = useRouter();
  const [state,    setState]    = useState<LocState>('idle');
  const [location, setLocation] = useState<LocationData | null>(null);

  const fetchLocation = async () => {
    setState('loading');
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({
        latitude:  loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy:  loc.coords.accuracy,
        altitude:  loc.coords.altitude,
        timestamp: loc.timestamp,
      });
      setState('success');
    } catch {
      Alert.alert('Error', 'Failed to get location.');
      setState('success');
    }
  };

  const requestPermission = async () => {
    setState('requesting');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      await fetchLocation();
    } else {
      setState('denied');
    }
  };

  useEffect(() => { requestPermission(); }, []);

  const handleCopy = async () => {
    if (!location) return;
    const text = `Lat: ${location.latitude.toFixed(6)}, Lon: ${location.longitude.toFixed(6)}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('✅ Copied!', `Location copied to clipboard:\n${text}`);
  };

  const infoRows = location ? [
    { label: 'Latitude',  value: location.latitude.toFixed(6),  icon: 'navigate-outline'    as const },
    { label: 'Longitude', value: location.longitude.toFixed(6), icon: 'navigate-circle-outline' as const },
    { label: 'Accuracy',  value: location.accuracy ? `±${location.accuracy.toFixed(1)} m` : 'N/A', icon: 'radio-button-on-outline' as const },
    { label: 'Altitude',  value: location.altitude  ? `${location.altitude.toFixed(1)} m` : 'N/A', icon: 'trending-up-outline'     as const },
    { label: 'Captured',  value: new Date(location.timestamp).toLocaleTimeString(), icon: 'time-outline' as const },
  ] : [];

  return (
    <SafeAreaView style={ls.container} edges={['top']}>
      {/* Header */}
      <View style={ls.header}>
        <Pressable onPress={() => router.back()} style={ls.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
        </Pressable>
        <View>
          <Text style={ls.headerTitle}>Location</Text>
          <Text style={ls.headerSub}>GPS Field Coordinates</Text>
        </View>
        {state === 'success' && (
          <Pressable style={ls.refreshBtn} onPress={fetchLocation}>
            <Ionicons name="refresh-outline" size={18} color={Palette.primary} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={ls.content} showsVerticalScrollIndicator={false}>

        {/* Map Placeholder */}
        <View style={ls.mapCard}>
          <View style={ls.mapInner}>
            {(state === 'loading' || state === 'requesting') ? (
              <View style={ls.mapCenter}>
                <ActivityIndicator size="large" color={Palette.primary} />
                <Text style={ls.mapHint}>Acquiring GPS signal…</Text>
              </View>
            ) : state === 'denied' ? (
              <View style={ls.mapCenter}>
                <Ionicons name="location-outline" size={44} color="rgba(255,255,255,0.4)" />
                <Text style={ls.mapHint}>Permission denied</Text>
              </View>
            ) : (
              <View style={ls.mapCenter}>
                <View style={ls.mapDot} />
                <Ionicons name="location" size={52} color={Palette.primary} />
                {location && (
                  <Text style={ls.mapCoordText}>
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Denied state */}
        {state === 'denied' && (
          <View style={ls.permCard}>
            <Ionicons name="location-outline" size={40} color={Palette.danger} />
            <Text style={ls.permTitle}>Location Permission Denied</Text>
            <Text style={ls.permSub}>Please enable location permissions in your device settings.</Text>
            <Pressable style={ls.permBtn} onPress={requestPermission}>
              <Text style={ls.permBtnText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {/* Info Rows */}
        {location && (
          <View style={ls.infoCard}>
            <View style={ls.infoHeader}>
              <View style={[ls.infoIcon, { backgroundColor: Palette.primaryLt }]}>
                <Ionicons name="location-outline" size={16} color={Palette.primary} />
              </View>
              <Text style={ls.infoTitle}>Coordinate Details</Text>
              <View style={[ls.accuracyBadge, { backgroundColor: (location.accuracy ?? 99) < 20 ? '#D1FAE5' : '#FEF3C7' }]}>
                <Text style={[ls.accuracyText, { color: (location.accuracy ?? 99) < 20 ? Palette.success : Palette.warning }]}>
                  {(location.accuracy ?? 99) < 20 ? 'High' : 'Medium'} Accuracy
                </Text>
              </View>
            </View>

            {infoRows.map((row) => (
              <View key={row.label} style={ls.infoRow}>
                <View style={ls.infoRowLeft}>
                  <Ionicons name={row.icon} size={16} color={Palette.inkSoft} />
                  <Text style={ls.infoLabel}>{row.label}</Text>
                </View>
                <Text style={ls.infoValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        {location && (
          <View style={ls.actions}>
            <Pressable style={ls.copyBtn} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={18} color={Palette.white} />
              <Text style={ls.copyBtnText}>Copy Location to Clipboard</Text>
            </Pressable>
            <Pressable style={ls.refreshFullBtn} onPress={fetchLocation}>
              <Ionicons name="refresh-outline" size={18} color={Palette.primary} />
              <Text style={ls.refreshBtnText}>Refresh Location</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ls = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Palette.ink },
  headerSub: { fontSize: 11, color: Palette.inkSoft },
  refreshBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.md },
  mapCard: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.md, ...Shadow.md },
  mapInner: { height: 220, backgroundColor: '#1E1B4B', justifyContent: 'center', alignItems: 'center' },
  mapCenter: { alignItems: 'center', gap: 10 },
  mapDot: { position: 'absolute', top: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: `${Palette.primary}20` },
  mapHint: { color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 8 },
  mapCoordText: { color: '#A5B4FC', fontSize: 13, fontWeight: '700', marginTop: 4 },
  permCard: { backgroundColor: Palette.white, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', gap: 8, marginBottom: Spacing.md, ...Shadow.sm },
  permTitle: { fontSize: 17, fontWeight: '800', color: Palette.ink },
  permSub: { fontSize: 13, color: Palette.inkSoft, textAlign: 'center' },
  permBtn: { backgroundColor: Palette.primary, borderRadius: Radius.lg, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  permBtnText: { color: Palette.white, fontWeight: '800' },
  infoCard: { backgroundColor: Palette.white, borderRadius: Radius.xl, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Palette.border },
  infoIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: Palette.ink },
  accuracyBadge: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  accuracyText: { fontSize: 11, fontWeight: '700' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Palette.border },
  infoRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 13, color: Palette.inkSoft },
  infoValue: { fontSize: 13, fontWeight: '700', color: Palette.ink },
  actions: { gap: 10 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 14, ...Shadow.lg },
  copyBtnText: { color: Palette.white, fontWeight: '800', fontSize: 14 },
  refreshFullBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 14 },
  refreshBtnText: { color: Palette.primary, fontWeight: '700', fontSize: 14 },
});
