import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as Location from "expo-location"

const locationScreen = () => {
  const [currLocation, setCurrLocation] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [currAddress, setCurrAddress] = useState(null);

  const handleGrantPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      alert("Please give permission first")
    }
  }

  const handleGetCurrentLocation = async () => {
    const isGranted = await Location.getForegroundPermissionsAsync();
    if (!isGranted.granted) {
      alert("Give permission first");
      return; 
    }
    
    const currentLocation = await Location.getCurrentPositionAsync();
    if (currentLocation) {
      console.log(currentLocation);
      setCurrLocation(currentLocation);
      

      const currentAddress = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      
      if (currentAddress && currentAddress.length > 0) {
        console.log(currentAddress);
        setCurrAddress(currentAddress);
      }
    }
  }

  const handleGetLastLocation = async () => {
    const isGranted = await Location.getForegroundPermissionsAsync();
    if (!isGranted.granted) {
      alert("Give permission first");
      return;
    }
    
    const lastLocation = await Location.getLastKnownPositionAsync();
    if (lastLocation) {
      console.log(lastLocation);
      setLastPosition(lastLocation);
    } else {
      alert("No last known location found on this device");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold',justifyContent: "center", alignItems: "center"}}>My Location Dashboard</Text>

      {currLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.title}>Current Location:</Text>
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
          <Text style={styles.title}>Current Address:</Text>
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
          <Text style={styles.title}>Last Location:</Text>
          <Text style={styles.header}>Last Location</Text>
          <Text>Longitude: {lastPosition.coords.longitude}</Text>
          <Text>Latitude: {lastPosition.coords.latitude}</Text>
          <Text>Accuracy: {lastPosition.coords.accuracy}</Text>
        </View>
      ) : (
        <Text style={{ marginTop: 10, color: 'gray' }}>No Last Known Location Found</Text>
      )}


      <Pressable style={styles.button} onPress={handleGrantPermission}>
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
    </View>
  )
}

export default locationScreen

const styles = StyleSheet.create({
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
    marginBottom: 5
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
})
