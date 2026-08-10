import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Alert,
  Share,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JOURNAL_KEY = 'camera_og_journal_v1';
const TIMER_OPTIONS = [0, 3, 5, 10];

// Video Preview Component
const VideoPreviewItem = ({ uri }) => {
  const player = useVideoPlayer(uri);
  return <VideoView style={styles.videoPreview} player={player} nativeControls />;
};

export default function CameraOG() {
  // Part 1: Permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaLibPermission, requestMediaLibPermission] = MediaLibrary.usePermissions({
    writeOnly: true,
  });

  // Camera Settings
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [torch, setTorch] = useState('off');
  const [mode, setMode] = useState('picture'); // picture | video | scan
  const [zoom, setZoom] = useState(0); // 0 to 1

  // Part 10: Enhancements
  const [gridOn, setGridOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [selfTimer, setSelfTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [focusPoint, setFocusPoint] = useState(null);
  const captureFlashAnim = useRef(new Animated.Value(0)).current;

  // Scanner State
  const scanLock = useRef(false);
  const [scannedData, setScannedData] = useState(null);
  const [scannedType, setScannedType] = useState(null);

  // Part 7: Location Integration & Watermark
  const [currentLoc, setCurrentLoc] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [showWatermark, setShowWatermark] = useState(true);

  // Part 8 & 9: Travel Journal & Gallery State
  const [journalMedia, setJournalMedia] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameText, setRenameText] = useState('');
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

  // Dark Mode Toggle
  const [darkMode, setDarkMode] = useState(true);

  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        await Location.requestForegroundPermissionsAsync();
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCurrentLoc(loc.coords);

      const rev = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (rev && rev.length > 0) {
        const item = rev[0];
        setCurrentAddress([item.city, item.street, item.country].filter(Boolean).join(', '));
      }
    } catch (_e) {
      setCurrentAddress('Location unavailable');
    }
  }, []);

  const loadJournal = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(JOURNAL_KEY);
      if (data) setJournalMedia(JSON.parse(data));
    } catch (_e) {}
  }, []);

  // Init & Permissions
  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!cameraPermission?.granted) await requestCameraPermission();
        if (!micPermission?.granted) await requestMicPermission();
        if (!mediaLibPermission?.granted) await requestMediaLibPermission();
      } catch (_e) {}

      fetchLocation();
      loadJournal();
    };

    bootstrap();
  }, [
    cameraPermission?.granted,
    micPermission?.granted,
    mediaLibPermission?.granted,
    requestCameraPermission,
    requestMicPermission,
    requestMediaLibPermission,
    fetchLocation,
    loadJournal,
  ]);

  const saveJournal = async (newList) => {
    setJournalMedia(newList);
    try {
      await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(newList));
    } catch (_e) {}
  };

  // Trigger Sound/Haptics
  const triggerFeedback = () => {
    if (soundOn) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // Flash Capture Animation
  const triggerCaptureAnimation = () => {
    captureFlashAnim.setValue(1);
    Animated.timing(captureFlashAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Tap to Focus Handler
  const handleTouchFocus = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setFocusPoint({ x: locationX, y: locationY });
    setTimeout(() => setFocusPoint(null), 1500);
  };

  // Countdown Helper
  const runTimerCountdown = (secs) =>
    new Promise((resolve) => {
      let currentSec = secs;
      setCountdown(currentSec);
      const iv = setInterval(() => {
        currentSec -= 1;
        if (currentSec <= 0) {
          clearInterval(iv);
          setCountdown(null);
          resolve();
        } else {
          setCountdown(currentSec);
        }
      }, 1000);
    });

  // Capture Photo
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    triggerFeedback();

    if (selfTimer > 0) {
      await runTimerCountdown(selfTimer);
    }

    triggerCaptureAnimation();
    try {
      const photo = await cameraRef.current.takePictureAsync();
      await fetchLocation();

      const newEntry = {
        id: Date.now().toString(),
        uri: photo.uri,
        type: 'photo',
        timestamp: new Date().toLocaleString(),
        latitude: currentLoc?.latitude || null,
        longitude: currentLoc?.longitude || null,
        address: currentAddress || 'Unknown Address',
        favorite: false,
        title: `Photo_${Date.now()}`,
      };

      const updated = [newEntry, ...journalMedia];
      await saveJournal(updated);
      setPreviewMedia(newEntry);

      // Save to device library
      if (mediaLibPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(photo.uri).catch(() => {});
      }
    } catch (e) {
      Alert.alert('Capture Error', e.message || 'Failed to take photo');
    }
  };

  // Record Video
  const recordVideo = async () => {
    if (!cameraRef.current) return;
    triggerFeedback();
    try {
      const vid = await cameraRef.current.recordAsync({ maxDuration: 60 });
      await fetchLocation();

      const newEntry = {
        id: Date.now().toString(),
        uri: vid.uri,
        type: 'video',
        timestamp: new Date().toLocaleString(),
        latitude: currentLoc?.latitude || null,
        longitude: currentLoc?.longitude || null,
        address: currentAddress || 'Unknown Address',
        favorite: false,
        title: `Video_${Date.now()}`,
      };

      const updated = [newEntry, ...journalMedia];
      await saveJournal(updated);
      setPreviewMedia(newEntry);

      if (mediaLibPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(vid.uri).catch(() => {});
      }
    } catch (e) {
      Alert.alert('Recording Error', e.message || 'Failed to record video');
    }
  };

  // Barcode Scanner
  const handleBarcodeScanned = ({ data, type }) => {
    if (scanLock.current) return;
    scanLock.current = true;
    triggerFeedback();
    setScannedData(data);
    setScannedType(type);
  };

  // Gallery Actions: Rename, Favorite, Delete
  const toggleFavorite = async (id) => {
    const updated = journalMedia.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    await saveJournal(updated);
  };

  const deleteMedia = async (id) => {
    const updated = journalMedia.filter((item) => item.id !== id);
    await saveJournal(updated);
    if (previewMedia?.id === id) setPreviewMedia(null);
  };

  const handleRename = async (id) => {
    if (!renameText.trim()) return;
    const updated = journalMedia.map((item) =>
      item.id === id ? { ...item, title: renameText.trim() } : item
    );
    await saveJournal(updated);
    setRenameId(null);
    setRenameText('');
  };

  // Export Journal JSON
  const exportJournalJSON = async () => {
    try {
      const jsonStr = JSON.stringify(journalMedia, null, 2);
      const fileUri = `${FileSystem.documentDirectory}camera_journal_export.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonStr);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Exported', `Saved to ${fileUri}`);
      }
    } catch (_e) {
      Alert.alert('Export Error', 'Could not export journal.');
    }
  };

  if (!cameraPermission?.granted) {
    return (
      <View style={styles.permissionCenter}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSub}>Grant permission to take photos, record videos, and scan codes.</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={requestCameraPermission}>
          <Text style={styles.btnPrimaryText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CAMERA VIEW & TOUCH FOCUS */}
      <Pressable style={styles.cameraContainer} onPress={handleTouchFocus}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          flash={flash}
          enableTorch={torch === 'on'}
          zoom={zoom}
          mode={mode === 'scan' ? 'picture' : mode}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'code128', 'upc_a'],
          }}
          onBarcodeScanned={mode === 'scan' ? handleBarcodeScanned : undefined}
        />

        {/* Part 10: Grid Overlay */}
        {gridOn && (
          <View style={styles.gridOverlay} pointerEvents="none">
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
          </View>
        )}

        {/* Tap to Focus Ring */}
        {focusPoint && (
          <View style={[styles.focusRing, { left: focusPoint.x - 25, top: focusPoint.y - 25 }]} />
        )}

        {/* Capture Flash Overlay */}
        <Animated.View style={[styles.captureFlash, { opacity: captureFlashAnim }]} pointerEvents="none" />

        {/* Part 7: Location Watermark Overlay */}
        {showWatermark && currentLoc && (
          <View style={styles.watermarkContainer}>
            <Text style={styles.watermarkText}>📍 {currentAddress || 'Locating...'}</Text>
            <Text style={styles.watermarkSub}>
              {currentLoc.latitude.toFixed(4)}°, {currentLoc.longitude.toFixed(4)}° • {new Date().toLocaleTimeString()}
            </Text>
          </View>
        )}

        {/* Timer Countdown Overlay */}
        {countdown !== null && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}
      </Pressable>

      {/* TOP CONTROLS */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
          <Text style={styles.iconText}>🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setFlash(flash === 'on' ? 'off' : 'on')}>
          <Text style={styles.iconText}>⚡ {flash.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setTorch(torch === 'on' ? 'off' : 'on')}>
          <Text style={styles.iconText}>🔦 {torch.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setGridOn(!gridOn)}>
          <Text style={styles.iconText}>🌐 {gridOn ? 'GRID' : 'OFF'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setSoundOn(!soundOn)}>
          <Text style={styles.iconText}>{soundOn ? '🔊' : '🔇'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowWatermark(!showWatermark)}>
          <Text style={styles.iconText}>{showWatermark ? '🏷️ WM' : '🏷️ OFF'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            const nextIdx = (TIMER_OPTIONS.indexOf(selfTimer) + 1) % TIMER_OPTIONS.length;
            setSelfTimer(TIMER_OPTIONS[nextIdx]);
          }}
        >
          <Text style={styles.iconText}>⏱️ {selfTimer}s</Text>
        </TouchableOpacity>
      </View>

      {/* ZOOM SLIDER CONTROL */}
      <View style={styles.zoomRow}>
        <Text style={styles.zoomText}>Zoom</Text>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom((z) => Math.max(0, z - 0.1))}>
          <Text style={styles.zoomBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.zoomValue}>{(zoom * 10).toFixed(1)}x</Text>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom((z) => Math.min(1, z + 0.1))}>
          <Text style={styles.zoomBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* MODE SWITCHER */}
      <View style={styles.modeRow}>
        {['picture', 'video', 'scan'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
            onPress={() => {
              setMode(m);
              setScannedData(null);
              scanLock.current = false;
            }}
          >
            <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>
              {m.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BOTTOM ACTION ROW */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.galleryThumbBtn} onPress={() => setGalleryVisible(true)}>
          {journalMedia.length > 0 ? (
            <Image source={{ uri: journalMedia[0].uri }} style={styles.thumbImg} />
          ) : (
            <Text style={styles.iconText}>🖼️</Text>
          )}
        </TouchableOpacity>

        {/* SHUTTER BUTTON */}
        {mode === 'picture' && (
          <TouchableOpacity style={styles.shutterBtn} onPress={takePhoto}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        )}
        {mode === 'video' && (
          <TouchableOpacity style={styles.shutterBtnVideo} onPress={recordVideo}>
            <View style={styles.shutterInnerVideo} />
          </TouchableOpacity>
        )}
        {mode === 'scan' && (
          <TouchableOpacity
            style={styles.btnScanReset}
            onPress={() => {
              setScannedData(null);
              scanLock.current = false;
            }}
          >
            <Text style={styles.btnScanResetText}>Rescan</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.sosBtn} onPress={() => setEmergencyModalVisible(true)}>
          <Text style={styles.sosBtnText}>🚨 SOS</Text>
        </TouchableOpacity>
      </View>

      {/* BARCODE RESULT POPUP */}
      {scannedData && (
        <View style={styles.scanResultCard}>
          <Text style={styles.scanResultTitle}>Barcode Scanned ({scannedType})</Text>
          <Text style={styles.scanResultData}>{scannedData}</Text>
        </View>
      )}

      {/* GALLERY & TRAVEL JOURNAL MODAL */}
      <Modal visible={galleryVisible} animationType="slide">
        <View style={[styles.modalContainer, darkMode ? styles.darkBg : styles.lightBg]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, darkMode ? styles.whiteText : styles.blackText]}>
              Travel Journal Gallery
            </Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity style={styles.btnSmall} onPress={() => setDarkMode(!darkMode)}>
                <Text style={styles.btnSmallText}>{darkMode ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSmall} onPress={exportJournalJSON}>
                <Text style={styles.btnSmallText}>Export JSON</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSmall} onPress={() => setGalleryVisible(false)}>
                <Text style={styles.btnSmallText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={journalMedia}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => (
              <View style={styles.galleryCard}>
                <TouchableOpacity onPress={() => setPreviewMedia(item)}>
                  {item.type === 'video' ? (
                    <VideoPreviewItem uri={item.uri} />
                  ) : (
                    <Image source={{ uri: item.uri }} style={styles.galleryImg} />
                  )}
                </TouchableOpacity>

                <View style={styles.cardInfo}>
                  {renameId === item.id ? (
                    <View style={styles.renameRow}>
                      <TextInput
                        style={styles.renameInput}
                        value={renameText}
                        onChangeText={setRenameText}
                        placeholder="Title..."
                        placeholderTextColor="#888"
                      />
                      <TouchableOpacity onPress={() => handleRename(item.id)}>
                        <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.galleryTitle}>{item.title}</Text>
                  )}
                  <Text style={styles.gallerySub}>{item.address}</Text>
                  <Text style={styles.galleryDate}>{item.timestamp}</Text>

                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                      <Text style={{ fontSize: 16 }}>{item.favorite ? '⭐' : '☆'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setRenameId(item.id);
                        setRenameText(item.title);
                      }}
                    >
                      <Text style={{ color: '#3b82f6', fontSize: 12 }}>Rename</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteMedia(item.id)}>
                      <Text style={{ color: '#ef4444', fontSize: 12 }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
                No photos/videos captured yet.
              </Text>
            }
          />
        </View>
      </Modal>

      {/* EMERGENCY SOS MODAL */}
      <Modal visible={emergencyModalVisible} animationType="slide" transparent>
        <View style={styles.sosModalOverlay}>
          <View style={styles.sosModalContent}>
            <Text style={styles.sosTitle}>🚨 Emergency SOS</Text>
            <Text style={styles.sosSub}>Quickly share current coordinates and location details.</Text>
            {currentLoc && (
              <View style={styles.sosInfoBox}>
                <Text style={styles.sosText}>Lat: {currentLoc.latitude.toFixed(6)}</Text>
                <Text style={styles.sosText}>Lng: {currentLoc.longitude.toFixed(6)}</Text>
                <Text style={styles.sosText}>Address: {currentAddress}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.sosBroadcastBtn}
              onPress={() => {
                if (currentLoc) {
                  Share.share({
                    message: `EMERGENCY SOS!\nLatitude: ${currentLoc.latitude}\nLongitude: ${currentLoc.longitude}\nAddress: ${currentAddress}\nhttps://maps.google.com/?q=${currentLoc.latitude},${currentLoc.longitude}`,
                  });
                }
              }}
            >
              <Text style={styles.sosBroadcastText}>Broadcast Emergency SOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSmall, { marginTop: 12 }]} onPress={() => setEmergencyModalVisible(false)}>
              <Text style={styles.btnSmallText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#000' },
  permissionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  permissionSub: { color: '#aaa', textAlign: 'center', marginBottom: 20 },
  btnPrimary: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold' },

  cameraContainer: { flex: 1 },
  watermarkContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  watermarkText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  watermarkSub: { color: '#22c55e', fontSize: 10 },

  gridOverlay: { ...StyleSheet.absoluteFillObject },
  gridRow: { flex: 1, flexDirection: 'row' },
  gridCell: { flex: 1, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.25)' },
  focusRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#facc15',
  },
  captureFlash: { ...StyleSheet.absoluteFillObject, backgroundColor: '#fff' },

  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  countdownText: { fontSize: 80, fontWeight: 'bold', color: '#fff' },

  topControls: {
    position: 'absolute',
    top: 45,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  iconText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  zoomRow: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 10,
  },
  zoomText: { color: '#aaa', fontSize: 12 },
  zoomValue: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  zoomBtn: { backgroundColor: '#333', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  zoomBtnText: { color: '#fff', fontWeight: 'bold' },

  modeRow: {
    position: 'absolute',
    bottom: 75,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 4,
  },
  modeBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  modeBtnActive: { backgroundColor: '#fff' },
  modeText: { color: '#aaa', fontWeight: 'bold', fontSize: 12 },
  modeTextActive: { color: '#000' },

  bottomControls: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  galleryThumbBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbImg: { width: 48, height: 48 },
  shutterBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: { width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: '#000' },
  shutterBtnVideo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerVideo: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#ef4444' },
  btnScanReset: { backgroundColor: '#facc15', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  btnScanResetText: { color: '#000', fontWeight: 'bold' },
  sosBtn: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  sosBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  scanResultCard: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 14,
    borderRadius: 12,
    maxWidth: '85%',
  },
  scanResultTitle: { color: '#facc15', fontWeight: 'bold', marginBottom: 4 },
  scanResultData: { color: '#fff', fontSize: 12 },

  videoPreview: { width: '100%', height: 120, borderRadius: 8 },
  modalContainer: { flex: 1, paddingTop: 45 },
  darkBg: { backgroundColor: '#09090b' },
  lightBg: { backgroundColor: '#f4f4f5' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  whiteText: { color: '#fff' },
  blackText: { color: '#000' },
  btnSmall: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnSmallText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  galleryCard: { flex: 0.5, margin: 6, backgroundColor: '#18181b', borderRadius: 10, padding: 8 },
  galleryImg: { width: '100%', height: 120, borderRadius: 8 },
  cardInfo: { marginTop: 6 },
  galleryTitle: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  gallerySub: { color: '#aaa', fontSize: 10 },
  galleryDate: { color: '#22c55e', fontSize: 9 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  renameRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  renameInput: { flex: 1, backgroundColor: '#27272a', color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 11 },

  sosModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  sosModalContent: { backgroundColor: '#18181b', padding: 20, borderRadius: 16 },
  sosTitle: { color: '#ef4444', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  sosSub: { color: '#aaa', fontSize: 12, marginBottom: 10 },
  sosInfoBox: { backgroundColor: 'rgba(239,68,68,0.15)', padding: 12, borderRadius: 8, marginBottom: 12 },
  sosText: { color: '#ef4444', fontWeight: 'bold' },
  sosBroadcastBtn: { backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  sosBroadcastText: { color: '#fff', fontWeight: 'bold' },
});