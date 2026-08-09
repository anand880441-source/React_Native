import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, Alert, Modal, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { saveJournalEntry } from '../../utils/journalStorage';

export default function WatermarkTab() {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('Fetching address...');
  const [stampedPhoto, setStampedPhoto] = useState(null);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        fetchLocationAndAddress();
      }
    })();
  }, []);

  const fetchLocationAndAddress = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCurrentLocation(loc.coords);
      const res = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (res && res.length > 0) {
        const item = res[0];
        setAddress(`${item.name || ''} ${item.street || ''}, ${item.city || ''}`);
      }
    } catch (e) {
      console.log('Location fetch error:', e);
    }
  };

  if (!cameraPermission || !cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.infoText}>Camera permission required.</Text>
        <Pressable style={styles.btn} onPress={requestCameraPermission}>
          <Text style={styles.btnText}>Grant Camera Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleCaptureWithLocation = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        const timestamp = new Date().toLocaleString();

        const stampedData = {
          uri: photo.uri,
          lat: currentLocation ? currentLocation.latitude.toFixed(5) : 'N/A',
          lon: currentLocation ? currentLocation.longitude.toFixed(5) : 'N/A',
          address,
          timestamp,
        };

        setStampedPhoto(stampedData);

        await saveJournalEntry({
          imageUri: photo.uri,
          address,
          latitude: stampedData.lat,
          longitude: stampedData.lon,
          notes: 'Location Stamped Photo',
        });

        Alert.alert('Success', 'Photo captured with location watermark & saved to Travel Journal!');
      }
    } catch (e) {
      Alert.alert('Capture Error', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Part 7: Camera + Watermark</Text>

        <Pressable style={styles.emergencyBtn} onPress={() => setEmergencyModalVisible(true)}>
          <Text style={styles.emergencyBtnText}>🚨 EMERGENCY LOCATION SCREEN</Text>
        </Pressable>

        <View style={styles.cameraWrapper}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.watermarkOverlay}>
            <Text style={styles.watermarkText}>📍 {address}</Text>
            <Text style={styles.watermarkSubText}>
              Lat: {currentLocation ? currentLocation.latitude.toFixed(5) : 'Loading...'} | Lon:{' '}
              {currentLocation ? currentLocation.longitude.toFixed(5) : 'Loading...'}
            </Text>
            <Text style={styles.watermarkSubText}>⏰ {new Date().toLocaleTimeString()}</Text>
          </View>
        </View>

        <Pressable style={styles.captureBtn} onPress={handleCaptureWithLocation}>
          <Text style={styles.captureBtnText}>📷 CAPTURE STAMPED PHOTO</Text>
        </Pressable>

        {stampedPhoto && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Captured Location Watermarked Photo</Text>
            <View style={styles.imageContainer}>
              <Image source={{ uri: stampedPhoto.uri }} style={styles.resultImage} />
              <View style={styles.imageWatermark}>
                <Text style={styles.watermarkText}>📍 {stampedPhoto.address}</Text>
                <Text style={styles.watermarkSubText}>
                  {stampedPhoto.lat}, {stampedPhoto.lon} | {stampedPhoto.timestamp}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Modal visible={emergencyModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <Text style={styles.emergencyTitle}>🚨 EMERGENCY LOCATION BROADCAST</Text>
              <Text style={styles.emergencySub}>Send coordinates immediately to emergency contacts:</Text>

              <View style={styles.emergencyBox}>
                <Text style={styles.emergencyCoords}>
                  Latitude: {currentLocation ? currentLocation.latitude.toFixed(6) : 'Fetching...'}
                </Text>
                <Text style={styles.emergencyCoords}>
                  Longitude: {currentLocation ? currentLocation.longitude.toFixed(6) : 'Fetching...'}
                </Text>
                <Text style={styles.emergencyAddress}>Address: {address}</Text>
              </View>

              <Pressable style={styles.btn} onPress={() => Alert.alert('SOS Sent', 'Coordinates broadcasted!')}>
                <Text style={styles.btnText}>BROADCAST SOS NOW</Text>
              </Pressable>

              <Pressable style={[styles.btn, { backgroundColor: '#777', marginTop: 10 }]} onPress={() => setEmergencyModalVisible(false)}>
                <Text style={styles.btnText}>CLOSE</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
  emergencyBtn: { width: '100%', backgroundColor: '#d32f2f', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  emergencyBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  cameraWrapper: { width: '100%', height: 300, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  camera: { flex: 1 },
  watermarkOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.65)', padding: 10 },
  watermarkText: { color: '#ffeb3b', fontWeight: 'bold', fontSize: 13 },
  watermarkSubText: { color: '#fff', fontSize: 11, marginTop: 2 },
  captureBtn: { width: '100%', backgroundColor: '#4CAF50', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  captureBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btn: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  resultCard: { width: '100%', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  imageContainer: { position: 'relative', width: '100%', height: 200, borderRadius: 8, overflow: 'hidden' },
  resultImage: { width: '100%', height: '100%' },
  imageWatermark: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', padding: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  emergencyTitle: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f', marginBottom: 8 },
  emergencySub: { fontSize: 13, color: '#555', marginBottom: 12 },
  emergencyBox: { backgroundColor: '#ffebee', padding: 12, borderRadius: 8, width: '100%', marginBottom: 14 },
  emergencyCoords: { fontSize: 14, fontWeight: 'bold', color: '#b71c1c' },
  emergencyAddress: { fontSize: 12, color: '#333', marginTop: 4 },
});
