import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ExpoLocation from 'expo-location'
import MapView, { Marker } from 'react-native-maps'

type LocationCoords = {
  latitude: number
  longitude: number
}

const defaultRegion = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

const Location = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null)
  const [region, setRegion] = useState(defaultRegion)

  const getCurrentLocation = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Access Denied', 'Permission to access location was denied')
      return
    }

    const currentLocation = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.High,
    })

    const coords = currentLocation.coords
    setLocation(coords)
    setRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  }

  useEffect(() => {
    void getCurrentLocation()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>

      <MapView style={styles.map} region={region} showsUserLocation>
        {location ? (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description="Current position"
          />
        ) : null}
      </MapView>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>Latitude: {location.latitude.toFixed(4)}</Text>
          <Text style={styles.locationText}>Longitude: {location.longitude.toFixed(4)}</Text>
        </View>
      )}

      <Pressable style={styles.button} onPress={() => void getCurrentLocation()}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </Pressable>
    </View>
  )
}

export default Location

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  map: {
    width: '90%',
    height: 300,
    marginVertical: 12,
    borderRadius: 12,
  },
  locationInfo: {
    marginVertical: 10,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#4e4a4a',
    borderWidth: 5,
    borderColor: 'black',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})