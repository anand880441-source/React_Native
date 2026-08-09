import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View, TextInput, Alert, ScrollView } from 'react-native';
import * as Location from "expo-location";

const LocationScreen = () => {
  const [currLocation, setCurrLocation] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [currAddress, setCurrAddress] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedCoords, setSearchedCoords] = useState(null);

  const handleGrantPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Please give permission first");
    } else {
      Alert.alert("Success", "Permission granted!");
    }
  };

  const handleGetCurrentLocation = async () => {
    const isGranted = await Location.getForegroundPermissionsAsync();
    if (!isGranted.granted) {
      Alert.alert("Permission Required", "Give permission first");
      return;
    }
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation) {
        setCurrLocation(currentLocation);
        const currentAddress = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });
        if (currentAddress && currentAddress.length > 0) {
          setCurrAddress(currentAddress);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch current location");
    }
  };

  const handleGetLastLocation = async () => {
    const isGranted = await Location.getForegroundPermissionsAsync();
    if (!isGranted.granted) {
      Alert.alert("Permission Required", "Give permission first");
      return;
    }
    const lastLocation = await Location.getLastKnownPositionAsync({});
    if (lastLocation) {
      setLastPosition(lastLocation);
    } else {
      Alert.alert("Not Found", "No last known location found on this device");
    }
  };

  const handleSearchLocation = async () => {
    if (!searchText.trim()) {
      Alert.alert("Empty Search", "Please enter an address to search.");
      return;
    }
    const isGranted = await Location.getForegroundPermissionsAsync();
    if (!isGranted.granted) {
      Alert.alert("Permission Required", "Give permission first");
      return;
    }

    const results = await Location.geocodeAsync(searchText);
    if (results && results.length > 0) {
      setSearchedCoords(results[0]);
    } else {
      Alert.alert("No Results", "No coordinates found for this address.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Location Dashboard</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter address to search"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <Pressable style={styles.button} onPress={handleSearchLocation}>
        <Text style={styles.buttonText}>Search Address Coordinates</Text>
      </Pressable>

      {searchedCoords && (
        <View style={styles.infoBox}>
          <Text style={styles.header}>Searched Address Coordinates</Text>
          <Text>Latitude: {searchedCoords.latitude}</Text>
          <Text>Longitude: {searchedCoords.longitude}</Text>
        </View>
      )}

      {currLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.header}>Current Location</Text>
          <Text>Longitude: {currLocation.coords.longitude}</Text>
          <Text>Latitude: {currLocation.coords.latitude}</Text>
          <Text>Accuracy: {currLocation.coords.accuracy}</Text>
          <Text>Altitude: {currLocation.coords.altitude}</Text>
          <Text>Heading: {currLocation.coords.heading}</Text>
          <Text>Speed: {currLocation.coords.speed}</Text>
          <Text>Timestamp: {currLocation.timestamp}</Text>
        </View>
      )}

      {currAddress && (
        <View style={styles.infoBox}>
          <Text style={styles.header}>Current Address</Text>
          <Text>Name: {currAddress[0].name}</Text>
          <Text>Street: {currAddress[0].street || "N/A"}</Text>
          <Text>City: {currAddress[0].city}</Text>
          <Text>District: {currAddress[0].district}</Text>
          <Text>State: {currAddress[0].region}</Text>
          <Text>Country: {currAddress[0].country}</Text>
          <Text>Postal Code: {currAddress[0].postalCode}</Text>
        </View>
      )}

      {lastPosition ? (
        <View style={styles.infoBox}>
          <Text style={styles.header}>Last Location</Text>
          <Text>Longitude: {lastPosition.coords.longitude}</Text>
          <Text>Latitude: {lastPosition.coords.latitude}</Text>
          <Text>Accuracy: {lastPosition.coords.accuracy}</Text>
        </View>
      ) : (
        <Text style={{ marginTop: 10, color: 'gray' }}>No Last Known Location Found</Text>
      )}

      <Pressable style={[styles.button, { marginTop: 20 }]} onPress={handleGrantPermission}>
        <Text style={styles.buttonText}>Grant Permission</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleGetCurrentLocation}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleGetLastLocation}>
        <Text style={styles.buttonText}>Get Last Known Location</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleGetCurrentLocation}>
        <Text style={styles.buttonText}>Refresh Location</Text>
      </Pressable>
    </ScrollView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 40,
  },
  infoBox: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%'
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  }
});
