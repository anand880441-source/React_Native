import { View, Text, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationTab() {

  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [geocodedResult, setGeocodedResult] = useState(null);
  const [heading, setHeading] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const liveRef = useRef(null);
  const headingRef = useRef(null);

  const handleGrantPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission?.granted) {
      Alert.alert("Permission Denied!", "Please give permission to access these features!!");
      return;
    }
    Alert.alert("Permission Granted!", "You can now use all location features.");
  };

  const handleGetCurrentLocation = async () => {
    const checkPermission = await Location.getForegroundPermissionsAsync();
    if (!checkPermission?.granted) {
      Alert.alert("Permission Denied!", "Please give permission to access these features!!");
      return;
    }
    try {
      const currentLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (currentLoc) {
        setCurrentLocation(currentLoc);
        console.log("Current Location:", currentLoc);
      }
    } catch (error) {
      Alert.alert("Error", `Unable to fetch current location: ${error.message}`);
    }
  };

  const handleGetLastLocation = async () => {
    const checkPermission = await Location.getForegroundPermissionsAsync();
    if (!checkPermission?.granted) {
      Alert.alert("Permission Denied!", "Please give permission to access these features!!");
      return;
    }
    try {
      const lastLoc = await Location.getLastKnownPositionAsync();
      if (lastLoc) {
        setLastLocation(lastLoc);
        console.log("Last Known Location:", lastLoc);
      } else {
        Alert.alert("Not Found", "No last known location cached on this device.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch last location!!");
    }
  };

  const handleTrackLocation = async () => {
    const checkPermission = await Location.getForegroundPermissionsAsync();
    if (!checkPermission?.granted) {
      Alert.alert("Permission Denied!", "Please give permission to access these features!!");
      return;
    }
    try {
      setIsTracking(true);

      liveRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 1 },
        (resLocation) => {
          setLiveLocation(resLocation);
          console.log("Live Location Update:", resLocation);
        }
      );

      headingRef.current = await Location.watchHeadingAsync((headData) => {
        setHeading(Math.round(headData.trueHeading || headData.magHeading));
      });
    } catch (error) {
      setIsTracking(false);
      Alert.alert("Error!", "Unable to start location tracking!");
    }
  };

  const handleStopTracker = () => {
    if (liveRef.current) {
      liveRef.current.remove();
      liveRef.current = null;
    }
    if (headingRef.current) {
      headingRef.current.remove();
      headingRef.current = null;
    }
    setIsTracking(false);
    setLiveLocation(null);
    setHeading(null);
  };

  const handleReverseGeocode = async () => {
    const checkPermission = await Location.getForegroundPermissionsAsync();
    if (!checkPermission?.granted) {
      Alert.alert("Permission Denied!", "Please give permission to access these features!!");
      return;
    }
    const source = currentLocation || liveLocation;
    if (!source) {
      Alert.alert("No Location", "Please fetch current location first.");
      return;
    }
    try {
      const res = await Location.reverseGeocodeAsync({
        latitude: source.coords.latitude,
        longitude: source.coords.longitude,
      });
      if (res && res.length > 0) {
        setAddress(res[0]);
        console.log("Reverse Geocode Result:", res);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to get address from coordinates.");
    }
  };

  const handleForwardGeocode = async () => {
    try {
      const res = await Location.geocodeAsync('Ahmedabad, Gujarat');
      if (res && res.length > 0) {
        setGeocodedResult(res[0]);
        console.log("Forward Geocode Result:", res);
      } else {
        Alert.alert("Not Found", "No coordinates found.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    handleTrackLocation();
    return () => {
      if (liveRef.current) liveRef.current.remove();
      if (headingRef.current) headingRef.current.remove();
    };
  }, []);

  const getAccuracyLabel = (accuracy) => {
    if (!accuracy) return 'Unknown';
    if (accuracy <= 5) return `${accuracy.toFixed(1)}m (Excellent)`;
    if (accuracy <= 15) return `${accuracy.toFixed(1)}m (Good)`;
    if (accuracy <= 50) return `${accuracy.toFixed(1)}m (Fair)`;
    return `${accuracy.toFixed(1)}m (Poor)`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Part 4 & 5: Location & Tracking</Text>

        <View style={[styles.statusBadge, isTracking ? styles.activeBadge : styles.idleBadge]}>
          <Text style={styles.statusText}>
            {isTracking ? '● Live Tracking ACTIVE' : '○ Tracking Stopped'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Part 4 – Location Basics</Text>
        <View style={styles.buttonContainer}>
          <Button title="Grant Permission" onPress={handleGrantPermission} />
          <Button title="Get Current Location" onPress={handleGetCurrentLocation} />
          <Button title="Get Last Known Location" onPress={handleGetLastLocation} />
          <Button title="Refresh Location" onPress={handleGetCurrentLocation} />
        </View>

        <Text style={styles.sectionTitle}>Part 5 – Advanced Location</Text>
        <View style={styles.buttonContainer}>
          <Button title="Start Live Tracking" onPress={handleTrackLocation} color="#4CAF50" />
          <Button title="Stop Live Tracking" onPress={handleStopTracker} color="#d32f2f" />
          <Button title="Reverse Geocode (Coords → Address)" onPress={handleReverseGeocode} />
          <Button title="Forward Geocode (Ahmedabad, GJ)" onPress={handleForwardGeocode} />
        </View>

        {currentLocation && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Current Location (High Accuracy):</Text>
            <Text>Latitude : {currentLocation.coords.latitude.toFixed(6)}</Text>
            <Text>Longitude : {currentLocation.coords.longitude.toFixed(6)}</Text>
            <Text>Altitude : {currentLocation.coords.altitude?.toFixed(1) ?? 'N/A'} m</Text>
            <Text>Speed : {currentLocation.coords.speed?.toFixed(2) ?? 'N/A'} m/s</Text>
            <Text>Accuracy : {getAccuracyLabel(currentLocation.coords.accuracy)}</Text>
            <Text>Timestamp : {new Date(currentLocation.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}

        {lastLocation && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Last Known Location:</Text>
            <Text>Latitude : {lastLocation.coords.latitude.toFixed(6)}</Text>
            <Text>Longitude : {lastLocation.coords.longitude.toFixed(6)}</Text>
            <Text>Accuracy : {getAccuracyLabel(lastLocation.coords.accuracy)}</Text>
            <Text>Cached At : {new Date(lastLocation.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}

        {liveLocation && (
          <View style={[styles.infoBox, styles.liveBox]}>
            <Text style={styles.infoTitle}>Live Location (Tracking Active):</Text>
            <Text>Latitude : {liveLocation.coords.latitude.toFixed(6)}</Text>
            <Text>Longitude : {liveLocation.coords.longitude.toFixed(6)}</Text>
            <Text>Speed : {liveLocation.coords.speed?.toFixed(2) ?? 'N/A'} m/s</Text>
            <Text>Accuracy : {getAccuracyLabel(liveLocation.coords.accuracy)}</Text>
            {heading !== null && (
              <Text>Compass Heading : {heading}° (N=0, E=90, S=180, W=270)</Text>
            )}
          </View>
        )}

        {address && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Reverse Geocoded Address:</Text>
            <Text>Name : {address.name}</Text>
            <Text>Street : {address.street}</Text>
            <Text>City : {address.city}</Text>
            <Text>District : {address.district}</Text>
            <Text>Region : {address.region}</Text>
            <Text>Postal Code : {address.postalCode}</Text>
            <Text>Country : {address.country} ({address.isoCountryCode})</Text>
          </View>
        )}

        {geocodedResult && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Geocoded Coordinates (Ahmedabad, GJ):</Text>
            <Text>Latitude : {geocodedResult.latitude}</Text>
            <Text>Longitude : {geocodedResult.longitude}</Text>
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
    marginBottom: 12,
  },
  statusBadge: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  activeBadge: { backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#4caf50' },
  idleBadge: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#bdbdbd' },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 8,
    color: '#1a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    paddingLeft: 8,
  },
  buttonContainer: { gap: 8, marginBottom: 12 },
  infoBox: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    gap: 4,
  },
  liveBox: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#1a1a1a',
  },
});
