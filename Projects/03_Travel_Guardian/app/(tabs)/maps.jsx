import { View, Text, Button, Alert, StyleSheet, TextInput, ScrollView, Share } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapsTab() {

  const [currentCoords, setCurrentCoords] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null); 
  const [locationHistory, setLocationHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetLat, setTargetLat] = useState('');
  const [targetLon, setTargetLon] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState(null);

  const activeLocation = searchedLocation || currentCoords;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (loc) {
        setCurrentCoords(loc.coords);
        console.log("Current Coords:", loc.coords);
      }
    })();
  }, []);

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Input Required", "Please enter an address to search.");
      return;
    }
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const found = results[0];
        setSearchedLocation({ latitude: found.latitude, longitude: found.longitude });

        const newRecord = {
          id: Date.now().toString(),
          query: searchQuery,
          lat: found.latitude,
          lon: found.longitude,
        };
        setLocationHistory((prev) => [newRecord, ...prev]);

        setTargetLat(found.latitude.toString());
        setTargetLon(found.longitude.toString());

        console.log("Geocoded Result:", found);
      } else {
        Alert.alert("Not Found", "No location results for this address.");
      }
    } catch (error) {
      Alert.alert("Search Error", error.message);
    }
  };

  const handleCalculateDistance = () => {
    if (!currentCoords) {
      Alert.alert("No Location", "Please wait for current location to load.");
      return;
    }
    if (!targetLat || !targetLon) {
      Alert.alert("Input Error", "Please enter target Latitude and Longitude.");
      return;
    }

    const lat1 = currentCoords.latitude;
    const lon1 = currentCoords.longitude;
    const lat2 = parseFloat(targetLat);
    const lon2 = parseFloat(targetLon);

    if (isNaN(lat2) || isNaN(lon2)) {
      Alert.alert("Invalid Input", "Latitude and Longitude must be numbers.");
      return;
    }

    const R = 6371; // Earth radius in km
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
    console.log("Distance:", dist.toFixed(2), "km");
  };

  const handleShareCoordinates = async () => {
    if (!currentCoords) {
      Alert.alert("No Location", "Please wait for current location to load.");
      return;
    }
    try {
      await Share.share({
        message: `My Location:\nLatitude: ${currentCoords.latitude}\nLongitude: ${currentCoords.longitude}\n\nMaps: https://maps.google.com/?q=${currentCoords.latitude},${currentCoords.longitude}`,
      });
    } catch (error) {
      Alert.alert("Share Error", error.message);
    }
  };

  const handleSelectHistory = (item) => {
    setSearchedLocation({ latitude: item.lat, longitude: item.lon });
    setTargetLat(item.lat.toString());
    setTargetLon(item.lon.toString());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Part 6: Maps & Utilities</Text>

        {activeLocation ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: activeLocation.latitude,
                longitude: activeLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
            >
              {currentCoords && (
                <Marker
                  coordinate={{
                    latitude: currentCoords.latitude,
                    longitude: currentCoords.longitude,
                  }}
                  title="My Location"
                  description="Your current position"
                  pinColor="blue"
                />
              )}

              {searchedLocation && (
                <Marker
                  coordinate={{
                    latitude: searchedLocation.latitude,
                    longitude: searchedLocation.longitude,
                  }}
                  title="Searched Location"
                  description={searchQuery}
                  pinColor="red"
                />
              )}
            </MapView>
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.placeholderText}>Fetching location for Map...</Text>
          </View>
        )}

        {currentCoords && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Current Location:</Text>
            <Text>Latitude : {currentCoords.latitude.toFixed(6)}</Text>
            <Text>Longitude : {currentCoords.longitude.toFixed(6)}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Share Coordinates</Text>
        <Button title="Share My Coordinates" onPress={handleShareCoordinates} />

        <Text style={styles.sectionTitle}>Search Location by Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address or city name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search Location" onPress={handleSearchLocation} />

        <Text style={styles.sectionTitle}>Distance Calculator (Haversine)</Text>
        <TextInput
          style={styles.input}
          placeholder="Target Latitude (e.g., 28.6139)"
          keyboardType="numeric"
          value={targetLat}
          onChangeText={setTargetLat}
        />
        <TextInput
          style={styles.input}
          placeholder="Target Longitude (e.g., 77.2090)"
          keyboardType="numeric"
          value={targetLon}
          onChangeText={setTargetLon}
        />
        <Button title="Calculate Distance" onPress={handleCalculateDistance} />

        {calculatedDistance !== null && (
          <View style={[styles.infoBox, styles.resultBox]}>
            <Text style={styles.resultText}>Distance: {calculatedDistance} km</Text>
          </View>
        )}

        {locationHistory.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Recent Location History</Text>
            {locationHistory.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyQuery}>{item.query}</Text>
                  <Text style={styles.historyCoords}>
                    {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
                  </Text>
                </View>
                <Button title="View" onPress={() => handleSelectHistory(item)} />
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  mapContainer: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  map: { width: '100%', height: '100%' },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  placeholderText: { color: '#888', fontSize: 14 },
  infoBox: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    gap: 4,
  },
  resultBox: {
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  resultText: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  infoTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 4, color: '#1a1a1a' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    paddingLeft: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    fontSize: 13,
    color: '#000',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 6,
  },
  historyQuery: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  historyCoords: { fontSize: 11, color: '#777', marginTop: 2 },
});
