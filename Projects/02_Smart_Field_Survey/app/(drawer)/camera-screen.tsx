import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type CameraCapturedPicture } from 'expo-camera';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';

type Mode = 'permission' | 'loading' | 'viewfinder' | 'preview';

const recentCaptures = [
  { label: 'Campus Gate', time: '10:32 AM', count: 3 },
  { label: 'Library Building', time: '11:05 AM', count: 1 },
  { label: 'Lab Equipment', time: '11:48 AM', count: 5 },
];

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>('permission');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [capturedAt, setCapturedAt] = useState<string>('');
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<CameraView>(null);

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result.granted) {
      setMode('loading');
      setTimeout(() => setMode('viewfinder'), 1200);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (pic) {
        setPhoto(pic);
        setCapturedAt(new Date().toLocaleTimeString());
        setMode('preview');
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo.');
    }
  };

  const handleRetake = () => { setPhoto(null); setMode('viewfinder'); };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { setPhoto(null); setMode('viewfinder'); } },
      ],
    );
  };

  const handleUsePhoto = () => {
    Alert.alert('Photo Saved', 'Photo has been attached to the survey.');
    router.back();
  };

  if (!permission?.granted || mode === 'permission') {
    return (
      <SafeAreaView style={cam.container} edges={['top']}>
        <View style={cam.header}>
          <Pressable onPress={() => router.back()} style={cam.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
          </Pressable>
          <Text style={cam.headerTitle}>Camera</Text>
        </View>
        <View style={cam.permCenter}>
          <View style={cam.permIconWrap}>
            <Ionicons name="camera-outline" size={52} color={Palette.primary} />
          </View>
          <Text style={cam.permTitle}>Camera Access Required</Text>
          <Text style={cam.permSub}>
            We need camera permission to capture site photos for your survey.
          </Text>
          <Pressable style={cam.permBtn} onPress={handleRequestPermission}>
            <Ionicons name="camera-outline" size={18} color={Palette.white} />
            <Text style={cam.permBtnText}>Grant Camera Permission</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === 'loading') {
    return (
      <SafeAreaView style={cam.container} edges={['top']}>
        <View style={cam.header}>
          <Pressable onPress={() => router.back()} style={cam.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
          </Pressable>
          <Text style={cam.headerTitle}>Camera</Text>
        </View>
        <View style={cam.permCenter}>
          <ActivityIndicator size="large" color={Palette.primary} />
          <Text style={[cam.permSub, { marginTop: 16 }]}>Opening camera…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === 'preview' && photo) {
    return (
      <SafeAreaView style={cam.container} edges={['top']}>
        <View style={cam.header}>
          <Pressable onPress={handleRetake} style={cam.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
          </Pressable>
          <Text style={cam.headerTitle}>Preview</Text>
          <View style={cam.captureTimeBadge}>
            <Ionicons name="time-outline" size={12} color={Palette.primary} />
            <Text style={cam.captureTimeText}>{capturedAt}</Text>
          </View>
        </View>

        <View style={cam.previewWrap}>
          <Image source={{ uri: photo.uri }} style={cam.previewImage} resizeMode="cover" />
        </View>

        <View style={cam.previewActions}>
          <Pressable style={cam.retakeBtn} onPress={handleRetake}>
            <Ionicons name="refresh-outline" size={18} color={Palette.primary} />
            <Text style={cam.retakeBtnText}>Retake</Text>
          </Pressable>
          <Pressable style={cam.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={Palette.danger} />
            <Text style={cam.deleteBtnText}>Delete</Text>
          </Pressable>
          <Pressable style={cam.useBtn} onPress={handleUsePhoto}>
            <Ionicons name="checkmark-outline" size={18} color={Palette.white} />
            <Text style={cam.useBtnText}>Use Photo</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={cam.container} edges={['top']}>
      <View style={cam.header}>
        <Pressable onPress={() => router.back()} style={cam.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={Palette.ink} />
        </Pressable>
        <Text style={cam.headerTitle}>Camera</Text>
        <View style={cam.headerTools}>
          <Pressable
            style={[cam.toolBtn, flash === 'on' && cam.toolBtnActive]}
            onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}
          >
            <Ionicons name={flash === 'on' ? 'flash' : 'flash-outline'} size={18} color={flash === 'on' ? Palette.primary : Palette.inkSoft} />
          </Pressable>
        </View>
      </View>

      <View style={cam.viewfinderWrap}>
        <CameraView ref={cameraRef} style={cam.camera} facing={facing} flash={flash}>
          <View style={[cam.corner, cam.tl]} />
          <View style={[cam.corner, cam.tr]} />
          <View style={[cam.corner, cam.bl]} />
          <View style={[cam.corner, cam.br]} />
        </CameraView>
      </View>

      <View style={cam.controls}>
        <Pressable style={cam.flipBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}>
          <Ionicons name="camera-reverse-outline" size={24} color={Palette.ink} />
        </Pressable>
        <Pressable style={cam.shutter} onPress={handleCapture}>
          <View style={cam.shutterInner} />
        </Pressable>
        <View style={{ width: 48 }} />
      </View>

      <View style={cam.recentSection}>
        <Text style={cam.recentTitle}>Recent Captures</Text>
        {recentCaptures.map((p, i) => (
          <View key={p.label} style={[cam.photoRow, i === recentCaptures.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={cam.thumbPlaceholder}>
              <Ionicons name="image-outline" size={20} color={Palette.primary} />
            </View>
            <View style={cam.photoInfo}>
              <Text style={cam.photoLabel}>{p.label}</Text>
              <Text style={cam.photoTime}>{p.time}</Text>
            </View>
            <View style={cam.photoBadge}>
              <Text style={cam.photoBadgeText}>{p.count} photo{p.count > 1 ? 's' : ''}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 20 }} />
    </SafeAreaView>
  );
}

const CORNER = 3;
const cam = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.white, borderBottomWidth: 1, borderBottomColor: Palette.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Palette.ink },
  headerTools: { flexDirection: 'row', gap: 8 },
  toolBtn: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.surface, borderWidth: 1.5, borderColor: Palette.border },
  toolBtnActive: { backgroundColor: Palette.primaryLt, borderColor: Palette.primary },
  captureTimeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Palette.primaryLt, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  captureTimeText: { color: Palette.primary, fontSize: 12, fontWeight: '700' },
  permCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  permIconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  permTitle: { fontSize: 20, fontWeight: '800', color: Palette.ink, marginBottom: 10, textAlign: 'center' },
  permSub: { fontSize: 14, color: Palette.inkSoft, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  permBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Palette.primary, borderRadius: Radius.lg, paddingHorizontal: 24, paddingVertical: 14, ...Shadow.lg },
  permBtnText: { color: Palette.white, fontWeight: '800', fontSize: 15 },
  viewfinderWrap: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  camera: { height: 280, borderRadius: Radius.xl, overflow: 'hidden' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: Palette.primary },
  tl: { top: 16, left: 16, borderTopWidth: CORNER, borderLeftWidth: CORNER, borderTopLeftRadius: 6 },
  tr: { top: 16, right: 16, borderTopWidth: CORNER, borderRightWidth: CORNER, borderTopRightRadius: 6 },
  bl: { bottom: 16, left: 16, borderBottomWidth: CORNER, borderLeftWidth: CORNER, borderBottomLeftRadius: 6 },
  br: { bottom: 16, right: 16, borderBottomWidth: CORNER, borderRightWidth: CORNER, borderBottomRightRadius: 6 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: 10, backgroundColor: Palette.white, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Palette.border },
  shutter: { width: 68, height: 68, borderRadius: 34, borderWidth: 3, borderColor: Palette.primary, justifyContent: 'center', alignItems: 'center', ...Shadow.lg },
  shutterInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: Palette.primary },
  flipBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: Palette.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Palette.border },
  previewWrap: { flex: 1, margin: Spacing.md, borderRadius: Radius.xl, overflow: 'hidden' },
  previewImage: { flex: 1 },
  previewActions: { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.md, paddingVertical: 12, backgroundColor: Palette.white, borderTopWidth: 1, borderTopColor: Palette.border },
  retakeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 12 },
  retakeBtnText: { color: Palette.primary, fontWeight: '700' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: Palette.danger, borderRadius: Radius.lg, paddingVertical: 12, paddingHorizontal: 16 },
  deleteBtnText: { color: Palette.danger, fontWeight: '700' },
  useBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Palette.primary, borderRadius: Radius.lg, paddingVertical: 12, ...Shadow.md },
  useBtnText: { color: Palette.white, fontWeight: '800' },
  recentSection: { backgroundColor: Palette.white, marginHorizontal: Spacing.md, borderRadius: Radius.xl, padding: 4, marginTop: Spacing.sm, ...Shadow.sm },
  recentTitle: { fontSize: 14, fontWeight: '800', color: Palette.ink, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Palette.border },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Palette.border },
  thumbPlaceholder: { width: 44, height: 44, borderRadius: 10, backgroundColor: Palette.primaryLt, justifyContent: 'center', alignItems: 'center' },
  photoInfo: { flex: 1 },
  photoLabel: { fontSize: 13, fontWeight: '700', color: Palette.ink },
  photoTime: { fontSize: 11, color: Palette.inkSoft },
  photoBadge: { backgroundColor: Palette.primaryLt, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  photoBadgeText: { color: Palette.primary, fontSize: 11, fontWeight: '700' },
});
