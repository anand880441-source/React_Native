import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';

export default function LocationTab() {
  const [permission, setPermission] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastKnownLocation, setLastKnownLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [headingSubscription, setHeadingSubscription] = useState(null);
  const [heading, setHeading] = useState(null);

  const [searchAddress, setSearchAddress] = useState('');
  const [geocodedResult, setGeocodedResult] = useState(null);

  useEffect(() => {
    let locSub = null;
    let headSub = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status === 'granted');
      if (status === 'granted') {
        const lastLoc = await Location.getLastKnownPositionAsync();
        if (lastLoc) setLastKnownLocation(lastLoc.coords);
        fetchCurrentLocation();
      }
    })();

    return () => {
      if (locSub) locSub.remove();
      if (headSub) headSub.remove();
    };
  }, []);

  const fetchCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(location.coords);
      reverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (e) {
      Alert.alert('Location Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (res && res.length > 0) {
        const item = res[0];
        setAddress(`${item.name || ''} ${item.street || ''}, ${item.city || item.subregion || ''}, ${item.region || ''}, ${item.country || ''}`.trim());
      }
    } catch (e) {
      console.log('Reverse geocode error:', e);
    }
  };

  const handleForwardGeocode = async () => {
    if (!searchAddress.trim()) return;
    try {
      const res = await Location.geocodeAsync(searchAddress);
      if (res && res.length > 0) {
        setGeocodedResult(res[0]);
      } else {
        Alert.alert('Geocode Result', 'No coordinates found.');
      }
    } catch (e) {
      Alert.alert('Geocode Error', e.message);
    }
  };

  const toggleLiveTracking = async () => {
    if (isTracking) {
      if (locationSubscription) locationSubscription.remove();
      if (headingSubscription) headingSubscription.remove();
      setLocationSubscription(null);
      setHeadingSubscription(null);
      setIsTracking(false);
    } else {
      setIsTracking(true);
      const locSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 1 },
        (loc) => {
          setCurrentLocation(loc.coords);
          reverseGeocode(loc.coords.latitude, loc.coords.longitude);
        }
      );
      setLocationSubscription(locSub);

      const headSub = await Location.watchHeadingAsync((headData) => {
        setHeading(Math.round(headData.trueHeading || headData.magHeading));
      });
      setHeadingSubscription(headSub);
    }
  };

  if (permission === null) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.infoText}>Requesting Location Permissions...</Text>
      </SafeAreaView>
    );
  }

  if (permission === false) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.infoText}>Location permission is denied.</Text>
        <Pressable style={styles.btn} onPress={() => Location.requestForegroundPermissionsAsync()}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Part 4 & 5: Location & Tracking</Text>

        <View style={[styles.statusBadge, isTracking ? styles.trackingBadge : styles.staticBadge]}>
          <Text style={styles.statusText}>
            {isTracking ? '📡 Live Tracking ACTIVE' : '📍 Static Location View'}
          </Text>
        </View>

        <View style={styles.btnRow}>
          <Pressable style={styles.btn} onPress={fetchCurrentLocation} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Fetching...' : '🔄 Refresh Location'}</Text>
          </Pressable>

          <Pressable style={[styles.btn, isTracking ? styles.stopBtn : styles.startBtn]} onPress={toggleLiveTracking}>
            <Text style={styles.btnText}>{isTracking ? '⏹ Stop Tracking' : '▶ Start Tracking'}</Text>
          </Pressable>
        </View>

        {currentLocation ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Location Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>{currentLocation.latitude.toFixed(6)}°</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>{currentLocation.longitude.toFixed(6)}°</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.value}>{currentLocation.accuracy?.toFixed(1)} meters</Text>
            </View>
            {heading !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>Compass:</Text>
                <Text style={styles.value}>{heading}° Heading</Text>
              </View>
            )}

            {address && (
              <View style={styles.addressBox}>
                <Text style={styles.addressLabel}>Reverse Geocoded Address:</Text>
                <Text style={styles.addressText}>{address}</Text>
              </View>
            )}
          </View>
        ) : (
          <ActivityIndicator size="large" color="#2196F3" style={{ marginVertical: 20 }} />
        )}

        {lastKnownLocation && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Known Location</Text>
            <Text style={styles.smallText}>
              Lat: {lastKnownLocation.latitude.toFixed(4)} | Lon: {lastKnownLocation.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Geocoding (Address Search)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city or landmark..."
            placeholderTextColor="#888"
            value={searchAddress}
            onChangeText={setSearchAddress}
          />
          <Pressable style={styles.btn} onPress={handleForwardGeocode}>
            <Text style={styles.btnText}>Search Coordinates</Text>
          </Pressable>

          {geocodedResult && (
            <View style={styles.geocodeResultBox}>
              <Text style={styles.value}>Lat: {geocodedResult.latitude}</Text>
              <Text style={styles.value}>Lon: {geocodedResult.longitude}</Text>
            </View>
          )}
        </View>
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
  statusBadge: { width: '100%', padding: 10, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  staticBadge: { backgroundColor: '#e3f2fd', borderWidth: 1, borderColor: '#2196F3' },
  trackingBadge: { backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#4caf50' },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 10, marginBottom: 14 },
  btn: { flex: 1, backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center' },
  startBtn: { backgroundColor: '#4CAF50' },
  stopBtn: { backgroundColor: '#f44336' },
  btnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  card: { width: '100%', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { color: '#666', fontSize: 13, fontWeight: '500' },
  value: { color: '#111', fontSize: 13, fontWeight: 'bold' },
  smallText: { fontSize: 12, color: '#555' },
  addressBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#eee' },
  addressLabel: { fontSize: 12, fontWeight: 'bold', color: '#555' },
  addressText: { fontSize: 13, color: '#222', marginTop: 2 },
  input: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 6, marginBottom: 8, fontSize: 13, color: '#000' },
  geocodeResultBox: { marginTop: 8, backgroundColor: '#e8f5e9', padding: 8, borderRadius: 6 },
});
