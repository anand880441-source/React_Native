import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, Alert } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraTab() {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [torch, setTorch] = useState(false);
  const [mode, setMode] = useState('picture');
  const [zoom, setZoom] = useState(0);

  const [gridOverlay, setGridOverlay] = useState(false);
  const [selfTimer, setSelfTimer] = useState(0);
  const [timerCountdown, setTimerCountdown] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const videoPlayer = useVideoPlayer(capturedVideo ? capturedVideo.uri : null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!cameraPermission || !micPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Loading permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Camera & Microphone permissions are required.</Text>
        <Pressable
          style={styles.actionBtn}
          onPress={async () => {
            await requestCameraPermission();
            await requestMicPermission();
          }}
        >
          <Text style={styles.actionBtnText}>Grant Permissions</Text>
        </Pressable>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (mode !== 'picture') {
      Alert.alert('Mode Error', 'Please switch to Picture mode first.');
      return;
    }

    if (selfTimer > 0) {
      let count = selfTimer;
      setTimerCountdown(count);
      const timerInterval = setInterval(() => {
        count -= 1;
        setTimerCountdown(count);
        if (count <= 0) {
          clearInterval(timerInterval);
          executePhotoCapture();
        }
      }, 1000);
    } else {
      executePhotoCapture();
    }
  };

  const executePhotoCapture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) setCapturedPhoto(photo);
      }
    } catch (error) {
      Alert.alert('Capture Error', error.message);
    }
  };

  const handleRecordVideo = async () => {
    if (mode !== 'video') {
      Alert.alert('Mode Error', 'Please switch to Video mode first.');
      return;
    }

    if (isRecording) {
      try {
        await cameraRef.current?.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.error('Stop recording error:', error);
      }
      return;
    }

    try {
      if (cameraRef.current) {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        if (video) setCapturedVideo(video);
      }
    } catch (error) {
      setIsRecording(false);
      Alert.alert('Recording Error', error.message);
    }
  };

  const toggleFlash = () => {
    if (flash === 'off') setFlash('on');
    else if (flash === 'on') setFlash('auto');
    else setFlash('off');
  };

  const cycleTimer = () => {
    if (selfTimer === 0) setSelfTimer(3);
    else if (selfTimer === 3) setSelfTimer(5);
    else if (selfTimer === 5) setSelfTimer(10);
    else setSelfTimer(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Part 1, 2 & 10: Camera & Media</Text>

        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
            enableTorch={torch}
            mode={mode}
            zoom={zoom}
          />
          {gridOverlay && (
            <View style={styles.gridContainer} pointerEvents="none">
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

          {timerCountdown > 0 && (
            <View style={styles.timerBadge}>
              <Text style={styles.timerBadgeText}>{timerCountdown}</Text>
            </View>
          )}

          {isRecording && (
            <View style={styles.recordingBadge}>
              <View style={styles.redDot} />
              <Text style={styles.recordingText}>REC {recordingTime}s</Text>
            </View>
          )}
        </View>

        <View style={styles.controlsRow}>
          <Pressable style={styles.controlBtn} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <Text style={styles.controlBtnText}>FLIP ({facing})</Text>
          </Pressable>

          <Pressable style={styles.controlBtn} onPress={toggleFlash}>
            <Text style={styles.controlBtnText}>FLASH: {flash}</Text>
          </Pressable>

          <Pressable style={styles.controlBtn} onPress={() => setTorch(!torch)}>
            <Text style={styles.controlBtnText}>TORCH: {torch ? 'ON' : 'OFF'}</Text>
          </Pressable>

          <Pressable style={styles.controlBtn} onPress={() => setMode(mode === 'picture' ? 'video' : 'picture')}>
            <Text style={styles.controlBtnText}>MODE: {mode}</Text>
          </Pressable>
        </View>

        <View style={styles.enhancementsBox}>
          <Text style={styles.subTitle}>Camera Options & Enhancements</Text>

          <View style={styles.toggleRow}>
            <Pressable style={styles.smallBtn} onPress={cycleTimer}>
              <Text style={styles.smallBtnText}>TIMER: {selfTimer ? `${selfTimer}s` : 'OFF'}</Text>
            </Pressable>

            <Pressable style={styles.smallBtn} onPress={() => setZoom(zoom === 0 ? 0.5 : zoom === 0.5 ? 1 : 0)}>
              <Text style={styles.smallBtnText}>ZOOM: {Math.round(zoom * 100)}%</Text>
            </Pressable>
          </View>
        </View>

        {mode === 'picture' ? (
          <Pressable style={styles.captureBtn} onPress={handleTakePicture}>
            <Text style={styles.captureBtnText}>TAKE PHOTO</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.captureBtn, isRecording ? styles.recordingActiveBtn : styles.recordVideoBtn]}
            onPress={handleRecordVideo}
          >
            <Text style={styles.captureBtnText}>
              {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
            </Text>
          </Pressable>
        )}

        {capturedPhoto && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Photo Preview</Text>
            <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
            <Text style={styles.uriText}>
              URI: {capturedPhoto.uri}
            </Text>
            <Text style={styles.detailsText}>
              Size: {capturedPhoto.width}x{capturedPhoto.height}
            </Text>
          </View>
        )}

        {capturedVideo && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Video Preview</Text>
            <VideoView style={styles.previewVideo} player={videoPlayer} />
            <Text style={styles.uriText}>
              URI: {capturedVideo.uri}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 16, alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  infoText: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 12 },
  cameraWrapper: { width: '100%', height: 300, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' },
  camera: { flex: 1 },
  gridContainer: { ...StyleSheet.absoluteFillObject },
  gridRow: { flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  gridCell: { flex: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  focusRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffeb3b',
  },
  timerBadge: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerBadgeText: { color: '#ffeb3b', fontSize: 24, fontWeight: 'bold' },
  recordingBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f44336', marginRight: 6 },
  recordingText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  controlsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginTop: 12, gap: 8 },
  controlBtn: { flex: 1, minWidth: '45%', backgroundColor: '#333', padding: 10, borderRadius: 8, alignItems: 'center' },
  controlBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  enhancementsBox: { width: '100%', marginTop: 12, backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8 },
  subTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#333' },
  smallBtn: { backgroundColor: '#555', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  smallBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actionBtn: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginTop: 12 },
  actionBtnText: { color: '#fff', fontWeight: 'bold' },
  captureBtn: { width: '100%', backgroundColor: '#4CAF50', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  recordVideoBtn: { backgroundColor: '#E91E63' },
  recordingActiveBtn: { backgroundColor: '#d32f2f' },
  captureBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  previewCard: { width: '100%', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 16, alignItems: 'center' },
  previewTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  previewImage: { width: 220, height: 180, borderRadius: 8 },
  previewVideo: { width: 280, height: 180, borderRadius: 8 },
  uriText: { fontSize: 11, color: '#666', marginTop: 6, textAlign: 'center' },
  detailsText: { fontSize: 12, color: '#333', fontWeight: 'bold', marginTop: 2 },
});
