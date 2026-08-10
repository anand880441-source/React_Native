import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Linking,
  Share,
  RefreshControl,
  Modal,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const JOURNAL_STORAGE_KEY = 'location_og_journal_v1';
const HISTORY_STORAGE_KEY = 'location_og_history_v1';
const CACHE_STORAGE_KEY = 'location_og_address_cache_v1';
const MAX_HISTORY = 20;

// Haversine distance calculator
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2); // returns distance in km
}

export default function LocationOG() {
  // Part 4 & 5 State: Permissions & Location
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastKnownLocation, setLastKnownLocation] = useState(null);
  const [useHighAccuracy, setUseHighAccuracy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Part 5 State: Live Tracking & Compass & Geocoding
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const locationSubRef = useRef(null);
  const [compassHeading, setCompassHeading] = useState(null);
  const headingSubRef = useRef(null);
  const [reverseAddress, setReverseAddress] = useState(null);
  const [searchAddressText, setSearchAddressText] = useState('');
  const [geocodedResult, setGeocodedResult] = useState(null);

  // Part 6 State: Distance & History & Cache
  const [targetLatText, setTargetLatText] = useState('');
  const [targetLngText, setTargetLngText] = useState('');
  const [calcDistanceResult, setCalcDistanceResult] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [addressCache, setAddressCache] = useState({});

  // Part 7 & 8 State: Emergency Screen & Travel Journal
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');

  // Part 9 & 10 State: UI & Dark Mode
  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode ? darkTheme : lightTheme;

  // Location History helper
  const addToHistory = useCallback(async (coords) => {
    const newItem = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now().toString(),
    };
    setLocationHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Offline Address Cache + Reverse Geocoding
  const resolveReverseGeocode = useCallback(async (latitude, longitude) => {
    const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
    if (addressCache[cacheKey]) {
      setReverseAddress(addressCache[cacheKey]);
      return addressCache[cacheKey];
    }

    try {
      const res = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (res && res.length > 0) {
        const item = res[0];
        const formatted = [item.name, item.street, item.city, item.region, item.country]
          .filter(Boolean)
          .join(', ');
        setReverseAddress(formatted);

        setAddressCache((prevCache) => {
          const updatedCache = { ...prevCache, [cacheKey]: formatted };
          AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(updatedCache));
          return updatedCache;
        });
        return formatted;
      }
    } catch (_e) {
      setReverseAddress('Address offline / unavailable');
    }
    return 'Unknown Address';
  }, [addressCache]);

  // Compass Heading
  const startCompass = useCallback(async () => {
    try {
      const sub = await Location.watchHeadingAsync((h) => {
        setCompassHeading(Math.round(h.trueHeading >= 0 ? h.trueHeading : h.magHeading));
      });
      headingSubRef.current = sub;
    } catch (_e) {}
  }, []);

  const stopCompass = useCallback(() => {
    if (headingSubRef.current) {
      headingSubRef.current.remove();
      headingSubRef.current = null;
    }
  }, []);

  // High accuracy & Refresh Location
  const fetchLocation = useCallback(async () => {
    setLoading(true);
    try {
      const last = await Location.getLastKnownPositionAsync();
      if (last) setLastKnownLocation(last.coords);

      const location = await Location.getCurrentPositionAsync({
        accuracy: useHighAccuracy
          ? Location.Accuracy.Highest
          : Location.Accuracy.Balanced,
      });

      setCurrentLocation(location.coords);
      addToHistory(location.coords);
      resolveReverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (e) {
      Alert.alert('Location Error', e.message || 'Could not fetch current location.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [useHighAccuracy, addToHistory, resolveReverseGeocode]);

  const stopLiveTracking = useCallback(() => {
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
    setIsLiveTracking(false);
  }, []);

  // Initialize and load saved data
  useEffect(() => {
    const initLocationData = async () => {
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
        if (cachedData) setAddressCache(JSON.parse(cachedData));

        const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (savedHistory) setLocationHistory(JSON.parse(savedHistory));

        const savedJournal = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
        if (savedJournal) setJournalEntries(JSON.parse(savedJournal));

        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionGranted(status === 'granted');
        if (status === 'granted') {
          fetchLocation();
          startCompass();
        }
      } catch (_e) {}
    };

    initLocationData();
    return () => {
      stopLiveTracking();
      stopCompass();
    };
  }, [fetchLocation, startCompass, stopLiveTracking, stopCompass]);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
      if (status === 'granted') {
        fetchLocation();
        startCompass();
      } else {
        Alert.alert('Permission Required', 'Location permission is needed for GPS features.');
      }
    } catch (_e) {
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLocation();
  }, [fetchLocation]);

  // Live Location Tracking
  const toggleLiveTracking = async () => {
    if (isLiveTracking) {
      stopLiveTracking();
    } else {
      try {
        const sub = await Location.watchPositionAsync(
          {
            accuracy: useHighAccuracy
              ? Location.Accuracy.Highest
              : Location.Accuracy.Balanced,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (newLoc) => {
            setCurrentLocation(newLoc.coords);
            addToHistory(newLoc.coords);
            resolveReverseGeocode(newLoc.coords.latitude, newLoc.coords.longitude);
          }
        );
        locationSubRef.current = sub;
        setIsLiveTracking(true);
      } catch (_e) {
        Alert.alert('Tracking Error', 'Unable to start live location tracking.');
      }
    }
  };

  // Forward Geocoding
  const handleSearchAddress = async () => {
    if (!searchAddressText.trim()) return;
    try {
      const results = await Location.geocodeAsync(searchAddressText);
      if (results && results.length > 0) {
        setGeocodedResult(results[0]);
        setTargetLatText(results[0].latitude.toString());
        setTargetLngText(results[0].longitude.toString());
        if (currentLocation) {
          const dist = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            results[0].latitude,
            results[0].longitude
          );
          setCalcDistanceResult(dist);
        }
      } else {
        Alert.alert('Not Found', 'No coordinates found for this address.');
      }
    } catch (_e) {
      Alert.alert('Geocoding Error', 'Failed to search address.');
    }
  };

  // Distance Calculator
  const handleCalculateDistance = () => {
    const lat = parseFloat(targetLatText);
    const lng = parseFloat(targetLngText);
    if (isNaN(lat) || isNaN(lng) || !currentLocation) {
      Alert.alert('Invalid Input', 'Enter valid target latitude & longitude.');
      return;
    }
    const dist = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      lat,
      lng
    );
    setCalcDistanceResult(dist);
  };

  // Open Maps & Share
  const openInGoogleMaps = (lat, lng) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
    }) || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    });
  };

  const shareCoordinates = (lat, lng, addressStr) => {
    const text = `My Location:\nLatitude: ${lat}\nLongitude: ${lng}\nAddress: ${addressStr || 'N/A'}\nhttps://maps.google.com/?q=${lat},${lng}`;
    Share.share({ message: text });
  };

  const clearHistory = async () => {
    setLocationHistory([]);
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  // Travel Journal
  const addJournalEntry = async () => {
    if (!currentLocation) {
      Alert.alert('Location Missing', 'Current location is needed to save a journal entry.');
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      address: reverseAddress || 'Custom Location',
      note: newNoteText || 'Travel Memory',
    };

    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    setNewNoteText('');
    await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    Alert.alert('Saved', 'Added new entry to Travel Journal!');
  };

  const deleteJournalEntry = async (id) => {
    const updated = journalEntries.filter((item) => item.id !== id);
    setJournalEntries(updated);
    await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const exportJournalJSON = async () => {
    try {
      const jsonStr = JSON.stringify(journalEntries, null, 2);
      const fileUri = `${FileSystem.documentDirectory}travel_journal_export.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonStr);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Exported', `Journal saved to ${fileUri}`);
      }
    } catch (_e) {
      Alert.alert('Export Error', 'Could not export journal JSON.');
    }
  };

  // Accuracy Indicator Rating
  const getAccuracyBadge = (acc) => {
    if (acc == null) return { text: 'Unknown', color: '#888' };
    if (acc < 10) return { text: 'High (<10m)', color: '#22c55e' };
    if (acc < 30) return { text: 'Medium (<30m)', color: '#facc15' };
    return { text: 'Low (>30m)', color: '#ef4444' };
  };

  if (!permissionGranted) {
    return (
      <View style={[styles.centerContainer, theme.bg]}>
        <Text style={[styles.titleText, theme.text]}>Location Access Required</Text>
        <Text style={[styles.subText, theme.subText]}>
          Grant permission to enable high accuracy GPS, geocoding, live tracking, and location tools.
        </Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={requestPermission}>
          <Text style={styles.btnPrimaryText}>Grant Location Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accBadge = getAccuracyBadge(currentLocation?.accuracy);

  return (
    <ScrollView
      style={[styles.container, theme.bg]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkMode ? '#fff' : '#000'} />}
    >
      {/* Header & Dark Mode Toggle */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.mainTitle, theme.text]}>LocationOG Guardian</Text>
          <Text style={theme.subText}>Part 4–10 Location & Utilities</Text>
        </View>
        <TouchableOpacity style={styles.darkModeToggle} onPress={() => setDarkMode(!darkMode)}>
          <Text style={styles.darkModeText}>{darkMode ? '☀️ Light' : '🌙 Dark'}</Text>
        </TouchableOpacity>
      </View>

      {/* Part 4 & 5: High Accuracy & Current Location */}
      <View style={[styles.card, theme.card]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, theme.text]}>Current GPS Location</Text>
          <View style={[styles.badge, { backgroundColor: accBadge.color }]}>
            <Text style={styles.badgeText}>{accBadge.text}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginVertical: 15 }} />
        ) : currentLocation ? (
          <View style={styles.detailsGrid}>
            <Text style={theme.text}>Latitude: {currentLocation.latitude.toFixed(6)}°</Text>
            <Text style={theme.text}>Longitude: {currentLocation.longitude.toFixed(6)}°</Text>
            <Text style={theme.text}>Altitude: {currentLocation.altitude ? `${currentLocation.altitude.toFixed(1)} m` : 'N/A'}</Text>
            <Text style={theme.text}>Speed: {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}</Text>
            <Text style={theme.text}>Heading / Compass: {compassHeading !== null ? `${compassHeading}°` : 'N/A'}</Text>
            {lastKnownLocation && (
              <Text style={theme.subText}>Last Known GPS: {lastKnownLocation.latitude.toFixed(4)}°, {lastKnownLocation.longitude.toFixed(4)}°</Text>
            )}
            <Text style={[theme.subText, { marginTop: 6 }]}>Address: {reverseAddress || 'Fetching address...'}</Text>
          </View>
        ) : (
          <Text style={theme.subText}>No location data fetched yet.</Text>
        )}

        {/* High Accuracy Switch */}
        <View style={styles.switchRow}>
          <Text style={theme.text}>High Accuracy Mode</Text>
          <Switch value={useHighAccuracy} onValueChange={setUseHighAccuracy} />
        </View>

        {/* Action Controls */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnSmall} onPress={fetchLocation}>
            <Text style={styles.btnText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSmall, isLiveTracking ? styles.btnDanger : styles.btnSuccess]}
            onPress={toggleLiveTracking}
          >
            <Text style={styles.btnText}>{isLiveTracking ? 'Stop Live Track' : 'Start Live Track'}</Text>
          </TouchableOpacity>
          {currentLocation && (
            <>
              <TouchableOpacity style={styles.btnSmall} onPress={() => openInGoogleMaps(currentLocation.latitude, currentLocation.longitude)}>
                <Text style={styles.btnText}>Google Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSmall} onPress={() => shareCoordinates(currentLocation.latitude, currentLocation.longitude, reverseAddress)}>
                <Text style={styles.btnText}>Share</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Part 6: Address Search & Distance Calculator */}
      <View style={[styles.card, theme.card]}>
        <Text style={[styles.cardTitle, theme.text]}>Search Address (Geocoding)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.textInput, theme.input]}
            placeholder="Enter location name or city..."
            placeholderTextColor="#888"
            value={searchAddressText}
            onChangeText={setSearchAddressText}
          />
          <TouchableOpacity style={styles.btnAction} onPress={handleSearchAddress}>
            <Text style={styles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>
        {geocodedResult && (
          <Text style={[theme.subText, { marginTop: 6 }]}>
            Found: Lat {geocodedResult.latitude.toFixed(4)}, Lng {geocodedResult.longitude.toFixed(4)}
          </Text>
        )}

        <Text style={[styles.cardTitle, theme.text, { marginTop: 15 }]}>Distance Calculator</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.textInput, theme.input, { flex: 1 }]}
            placeholder="Target Lat"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={targetLatText}
            onChangeText={setTargetLatText}
          />
          <TextInput
            style={[styles.textInput, theme.input, { flex: 1 }]}
            placeholder="Target Lng"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={targetLngText}
            onChangeText={setTargetLngText}
          />
          <TouchableOpacity style={styles.btnAction} onPress={handleCalculateDistance}>
            <Text style={styles.btnText}>Calc</Text>
          </TouchableOpacity>
        </View>
        {calcDistanceResult !== null && (
          <Text style={[styles.highlightText, { color: '#3b82f6', marginTop: 6 }]}>
            Distance to target: {calcDistanceResult} km
          </Text>
        )}
      </View>

      {/* Part 7: Emergency SOS Trigger */}
      <View style={[styles.card, theme.card, { borderColor: '#ef4444', borderWidth: 1 }]}>
        <Text style={[styles.cardTitle, { color: '#ef4444' }]}>Emergency SOS Broadcast</Text>
        <Text style={theme.subText}>Broadcast current exact coordinates & google maps link for emergency assistance.</Text>
        <TouchableOpacity style={styles.btnEmergency} onPress={() => setEmergencyModalVisible(true)}>
          <Text style={styles.btnEmergencyText}>🚨 Open Emergency Screen</Text>
        </TouchableOpacity>
      </View>

      {/* Part 8: Travel Journal */}
      <View style={[styles.card, theme.card]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, theme.text]}>Travel Journal</Text>
          <TouchableOpacity style={styles.btnSmall} onPress={exportJournalJSON}>
            <Text style={styles.btnText}>Export JSON</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.textInput, theme.input]}
            placeholder="Write a travel note..."
            placeholderTextColor="#888"
            value={newNoteText}
            onChangeText={setNewNoteText}
          />
          <TouchableOpacity style={styles.btnAction} onPress={addJournalEntry}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>

        {journalEntries.map((item) => (
          <View key={item.id} style={styles.journalItem}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.journalNote, theme.text]}>{item.note}</Text>
              <Text style={theme.subText}>{item.address}</Text>
              <Text style={[theme.subText, { fontSize: 10 }]}>{item.date} • {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteJournalEntry(item.id)}>
              <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Part 6: Location History */}
      <View style={[styles.card, theme.card]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, theme.text]}>Recent Location History</Text>
          <TouchableOpacity onPress={clearHistory}>
            <Text style={{ color: '#ef4444', fontSize: 12 }}>Clear</Text>
          </TouchableOpacity>
        </View>
        {locationHistory.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <Text style={theme.subText}>{item.timestamp}</Text>
            <Text style={theme.text}>{item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°</Text>
          </View>
        ))}
      </View>

      {/* Emergency SOS Modal */}
      <Modal visible={emergencyModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, theme.card]}>
            <Text style={styles.emergencyTitle}>🚨 Emergency SOS Location</Text>
            <Text style={theme.subText}>Send your live coordinates to family or emergency services.</Text>
            {currentLocation && (
              <View style={styles.emergencyBox}>
                <Text style={styles.emergencyCoordText}>Lat: {currentLocation.latitude}</Text>
                <Text style={styles.emergencyCoordText}>Lng: {currentLocation.longitude}</Text>
                <Text style={theme.text}>Address: {reverseAddress || 'Locating...'}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.btnEmergency}
              onPress={() => {
                if (currentLocation) {
                  shareCoordinates(currentLocation.latitude, currentLocation.longitude, reverseAddress);
                }
              }}
            >
              <Text style={styles.btnEmergencyText}>Broadcast Emergency Coordinates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSmall, { marginTop: 12 }]} onPress={() => setEmergencyModalVisible(false)}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const darkTheme = {
  bg: { backgroundColor: '#09090b' },
  card: { backgroundColor: '#18181b', borderColor: '#27272a' },
  text: { color: '#f4f4f5' },
  subText: { color: '#a1a1aa' },
  input: { backgroundColor: '#27272a', color: '#fff' },
};

const lightTheme = {
  bg: { backgroundColor: '#f4f4f5' },
  card: { backgroundColor: '#ffffff', borderColor: '#e4e4e7' },
  text: { color: '#09090b' },
  subText: { color: '#71717a' },
  input: { backgroundColor: '#f4f4f5', color: '#000' },
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  titleText: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  mainTitle: { fontSize: 22, fontWeight: '800' },
  darkModeToggle: { backgroundColor: 'rgba(127,127,127,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  darkModeText: { fontSize: 12, fontWeight: '600', color: '#3b82f6' },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  detailsGrid: { gap: 4, marginVertical: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  btnRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 12 },
  btnSmall: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnSuccess: { backgroundColor: '#22c55e' },
  btnDanger: { backgroundColor: '#ef4444' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  inputRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  textInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, fontSize: 13 },
  btnAction: { backgroundColor: '#3b82f6', paddingHorizontal: 14, justifyContent: 'center', borderRadius: 8 },
  btnEmergency: { backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnEmergencyText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  highlightText: { fontSize: 13, fontWeight: '700' },
  journalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  journalNote: { fontWeight: '600', fontSize: 13 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  btnPrimary: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 16 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { padding: 20, borderRadius: 16, borderWidth: 1 },
  emergencyTitle: { fontSize: 18, fontWeight: 'bold', color: '#ef4444', marginBottom: 8 },
  emergencyBox: { backgroundColor: 'rgba(239,68,68,0.1)', padding: 12, borderRadius: 8, marginVertical: 12 },
  emergencyCoordText: { fontWeight: 'bold', fontSize: 14, color: '#ef4444' },
});