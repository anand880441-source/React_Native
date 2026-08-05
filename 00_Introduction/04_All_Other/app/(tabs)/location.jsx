import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';
import { useState } from 'react';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);

  const handleGrantPermission = async () => {
    console.log("--- handleGrantPermission Triggered ---");
    const permission = await Location.requestForegroundPermissionsAsync();
    
    console.log("Permission Response Object:", JSON.stringify(permission, null, 2));

    if (!permission.granted) {
      Alert.alert("Permission Denied", "Location permission is required to use this feature.");
      return;
    }
    
    Alert.alert("Success", "Location permission granted!");
  };

  const handleGetCurrentLocation = async () => {
    console.log("--- handleGetCurrentLocation Triggered ---");
    const isGranted = await Location.getForegroundPermissionsAsync();
    
    if (!isGranted.granted) {
      Alert.alert("Permission Required", "Please grant location access first.");
      return;
    }

    try {
      console.log("Requesting highest accuracy current position...");
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
      
      console.log("Fetched Current Location Successfully:", JSON.stringify(currentLocation, null, 2));
      
      if (currentLocation) {
        setLocation(currentLocation);
      }
    } catch (error) {
      console.error("Error caught in handleGetCurrentLocation:", error);
      Alert.alert("Error", "Could not fetch location.");
    }
  };

  const getLastLocation = async () => {
    console.log("--- getLastLocation Triggered ---");
    const isGranted = await Location.getForegroundPermissionsAsync();
    
    if (!isGranted.granted) {
      Alert.alert("Permission Required", "Please grant location access first.");
      return;
    }

    console.log("Retrieving hardware cached position...");
    const savedlastLocation = await Location.getLastKnownPositionAsync();

    console.log("Fetched Last Known Cached Location Object:", JSON.stringify(savedlastLocation, null, 2));

    if (savedlastLocation) {
      setLastLocation(savedlastLocation);
    } else {
      Alert.alert("Not Found", "No last known location cached on this device.");
    }
  };

  const activeLocation = location || lastLocation;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Screen</Text>
      
      <Pressable style={styles.button} onPress={handleGrantPermission}>
        <Text style={styles.buttonText}>Grant Permission</Text>
      </Pressable>
      
      <Pressable style={styles.button} onPress={handleGetCurrentLocation}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={getLastLocation}>
        <Text style={styles.buttonText}>Get Last Location</Text>
      </Pressable>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.sectionHeader}>Current Location:</Text>
          <Text style={styles.locationText}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {location.coords.longitude}</Text>
        </View>
      )}

      {lastLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.sectionHeader}>Last Location:</Text>
          <Text style={styles.locationText}>Latitude: {lastLocation.coords.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {lastLocation.coords.longitude}</Text>
        </View>
      )}

      {activeLocation && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: activeLocation.coords.latitude,
              longitude: activeLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: activeLocation.coords.latitude,
                longitude: activeLocation.coords.longitude,
              }}
              title="Selected Location"
              description="This is the fetched coordinate point"
            />
          </MapView>
        </View>
      )}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justify: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  locationInfo: {
    marginVertical: 5,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '80%',
  },
  locationText: {
    fontSize: 14,
    marginVertical: 1,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4e4a4a',
    borderWidth: 2,
    borderColor: 'black',
    padding: 15,
    margin: 5,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  mapContainer: {
    width: '90%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});