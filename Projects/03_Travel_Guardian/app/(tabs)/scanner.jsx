import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Loading permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.infoText}>Camera permission is required to scan QR & Barcodes.</Text>
        <Pressable style={styles.actionBtn} onPress={requestPermission}>
          <Text style={styles.actionBtnText}>Grant Camera Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    const result = { type, data, timestamp: new Date().toLocaleTimeString() };
    setScannedData(result);
    console.log(result);
    Alert.alert('Code Scanned!', `Type: ${type}\nData: ${data}`);
  };

  const handleResetScanner = () => {
    setScanned(false);
    setScannedData(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Part 3: QR & Barcode Scanner</Text>

        <View style={[styles.statusBadge, scanned ? styles.lockedBadge : styles.activeBadge]}>
          <Text style={styles.statusText}>
            Camera Status: {scanned ? 'Scan Locked' : 'Active Scanning'}
          </Text>
        </View>

        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: [
                'qr',
                'ean13',
                'ean8',
                'code128',
                'code39',
                'upc_a',
                'upc_e',
                'pdf417',
                'aztec',
              ],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          <View style={styles.scanTargetFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {scanned && (
          <Pressable style={styles.resetBtn} onPress={handleResetScanner}>
            <Text style={styles.resetBtnText}>🔄 RESET SCANNER (SCAN AGAIN)</Text>
          </Pressable>
        )}

        {scannedData && (
          <View style={styles.resultCard}>
            <Text style={styles.resultHeader}>Latest Scanned Code</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Type:</Text>
              <Text style={styles.resultValue}>{scannedData.type}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Value:</Text>
              <Text style={styles.resultValue}>{scannedData.data}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Time:</Text>
              <Text style={styles.resultValue}>{scannedData.timestamp}</Text>
            </View>
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
  actionBtn: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginTop: 12 },
  actionBtnText: { color: '#fff', fontWeight: 'bold' },
  statusBadge: { width: '100%', padding: 10, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  activeBadge: { backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#4caf50' },
  lockedBadge: { backgroundColor: '#fff3e0', borderWidth: 1, borderColor: '#ff9800' },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  cameraWrapper: { width: '100%', height: 300, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  camera: { flex: 1 },
  scanTargetFrame: { width: 180, height: 180, position: 'absolute', top: 60, alignSelf: 'center' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#00e676' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  resetBtn: { width: '100%', backgroundColor: '#2196F3', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  resetBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  resultCard: { width: '100%', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginTop: 16 },
  resultHeader: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  resultRow: { flexDirection: 'row', marginBottom: 4 },
  resultLabel: { fontWeight: 'bold', width: 60, color: '#555' },
  resultValue: { flex: 1, color: '#111' },
  historyContainer: { width: '100%', marginTop: 20 },
  subTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  historyItem: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginBottom: 6 },
  historyText: { fontSize: 13, color: '#333', fontWeight: '500' },
  historyTime: { fontSize: 11, color: '#888', marginTop: 2 },
});
