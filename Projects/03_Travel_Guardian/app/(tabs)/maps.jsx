import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Alert, Linking, Share, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';

export default function MapsTab() {
  const [currentCoords, setCurrentCoords] = useState(null);
  const [targetLat, setTargetLat] = useState('');
  const [targetLon, setTargetLon] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationHistory, setLocationHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setCurrentCoords(loc.coords);
      }
    })();
  }, []);

  const calculateDistance = () => {
    if (!currentCoords || !targetLat || !targetLon) {
      Alert.alert('Input Error', 'Please enter target Latitude and Longitude.');
      return;
    }

    const lat1 = currentCoords.latitude;
    const lon1 = currentCoords.longitude;
    const lat2 = parseFloat(targetLat);
    const lon2 = parseFloat(targetLon);

    if (isNaN(lat2) || isNaN(lon2)) {
      Alert.alert('Invalid Input', 'Latitude and Longitude must be numeric.');
      return;
    }

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    setCalculatedDistance(dist.toFixed(2));
  };

  const openInGoogleMaps = (lat, lon) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    Linking.openURL(url).catch((err) => Alert.alert('Error', 'Unable to open Maps: ' + err.message));
  };

  const shareCoordinates = async () => {
    if (!currentCoords) return;
    try {
      await Share.share({
        message: `My Location: Lat ${currentCoords.latitude}, Lon ${currentCoords.longitude} (https://maps.google.com/?q=${currentCoords.latitude},${currentCoords.longitude})`,
      });
    } catch (error) {
      Alert.alert('Share Error', error.message);
    }
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const found = results[0];
        const newRecord = {
          query: searchQuery,
          lat: found.latitude,
          lon: found.longitude,
          time: new Date().toLocaleTimeString(),
        };
        setLocationHistory((prev) => [newRecord, ...prev]);
        setTargetLat(found.latitude.toString());
        setTargetLon(found.longitude.toString());
        Alert.alert('Found Location', `Address: ${searchQuery}\nLat: ${found.latitude}\nLon: ${found.longitude}`);
      } else {
        Alert.alert('Not Found', 'No location results found.');
      }
    } catch (e) {
      Alert.alert('Search Error', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Part 6: Maps & Utilities</Text>

        {currentCoords && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Coordinates Action Bar</Text>
            <Text style={styles.smallText}>
              Lat: {currentCoords.latitude.toFixed(6)} | Lon: {currentCoords.longitude.toFixed(6)}
            </Text>

            <View style={styles.btnRow}>
              <Pressable style={styles.btn} onPress={() => openInGoogleMaps(currentCoords.latitude, currentCoords.longitude)}>
                <Text style={styles.btnText}>🗺 Google Maps</Text>
              </Pressable>

              <Pressable style={[styles.btn, styles.shareBtn]} onPress={shareCoordinates}>
                <Text style={styles.btnText}>🔗 Share Location</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distance Calculator (Haversine)</Text>
          <TextInput
            style={styles.input}
            placeholder="Target Latitude (e.g., 28.6139)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={targetLat}
            onChangeText={setTargetLat}
          />
          <TextInput
            style={styles.input}
            placeholder="Target Longitude (e.g., 77.2090)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={targetLon}
            onChangeText={setTargetLon}
          />

          <Pressable style={styles.btn} onPress={calculateDistance}>
            <Text style={styles.btnText}>📐 Calculate Distance</Text>
          </Pressable>

          {calculatedDistance !== null && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>Distance: {calculatedDistance} km</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Search Location by Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Search address or landmark..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable style={styles.btn} onPress={handleSearchLocation}>
            <Text style={styles.btnText}>🔍 Search Location</Text>
          </Pressable>
        </View>

        {locationHistory.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Location History</Text>
            {locationHistory.map((item, idx) => (
              <View key={idx} style={styles.historyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyQuery}>{item.query}</Text>
                  <Text style={styles.historyCoords}>
                    {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
                  </Text>
                </View>
                <Pressable style={styles.smallMapBtn} onPress={() => openInGoogleMaps(item.lat, item.lon)}>
                  <Text style={styles.smallMapBtnText}>Maps</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  card: { width: '100%', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  smallText: { fontSize: 12, color: '#666', marginBottom: 10 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { flex: 1, backgroundColor: '#2196F3', padding: 11, borderRadius: 8, alignItems: 'center' },
  shareBtn: { backgroundColor: '#FF9800' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  input: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 6, marginBottom: 8, fontSize: 13, color: '#000' },
  resultBox: { marginTop: 10, backgroundColor: '#e8f5e9', padding: 10, borderRadius: 6, alignItems: 'center' },
  resultText: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32' },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#eee' },
  historyQuery: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  historyCoords: { fontSize: 11, color: '#777' },
  smallMapBtn: { backgroundColor: '#4caf50', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  smallMapBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
