import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const statRef = useRef(null);

  const handleStartTracker = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      alert("Permission to access location was denied");
      return;
    }

    statRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000, // update every 2 seconds
        distanceInterval: 1, // update every 1 meter
      },
      (resLocation) => {
        console.log(resLocation);
        setLocation(resLocation);
      }
    );
  };

  const handleStopTracker = () => {
    if (statRef.current) {
      statRef.current.remove();
      statRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Tracker</Text>

      {location ? (
        <View style={styles.locationBox}>
          <Text style={styles.text}>
            Latitude: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.text}>
            Longitude: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.text}>
            Accuracy: {location.coords.accuracy} m
          </Text>
        </View>
      ) : (
        <Text style={styles.text}>No location yet...</Text>
      )}

      <View style={styles.buttonRow}>
        <Button title="Start Tracking" onPress={handleStartTracker} />
        <Button title="Stop Tracking" onPress={handleStopTracker} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#006d77", // deep teal
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#edf6f9", // soft white
    textAlign: "center",
  },
  locationBox: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: "#83c5be", // light teal
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
    width: "90%",
  },
  text: {
    fontSize: 16,
    color: "#073b4c", // dark navy
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 15,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: "hidden", // ensures button respects rounded corners
  },
});




// import { Pressable, StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState,useRef } from 'react'
// import * as Location from 'expo-location';

// const location = () => {
//   const [locationData, setLocationData] = useState(null);
//   const [location, setLocation] = useState(null);

//   const statRef = useRef(null);


//   const handleStartTracker = async () => {
//     const permission = await Location.requestForegroundPermissionsAsync();

//     if (!permission.granted) {
//       return;
//     }

//     statRef.current = await Location.watchPositionAsync({}, (resLocation) => {
//       console.log(resLocation);
//       setLocation(resLocation);
//     });
//   };

//   const handleStopTracker = () => {
//   if (statRef.current) {
//     statRef.current.remove();
//     statRef.current = null;
//   }
// };

//   const handleGrantPermission = async () => {
//     const permission = await Location.requestForegroundPermissionsAsync();

//     if (!permission.granted) {
//       alert("Location permission denied");
//       return;
//     }

//     await handleGetCurrentLocation();
//     await prevLocation();
//   }

//   const handleGetCurrentLocation = async () => {
//     const currentLocation = await Location.getCurrentPositionAsync({
//       accuracy: Location.Accuracy.Highest
//     });

//     setLocationData(currentLocation.coords);

//     console.log(currentLocation);
//   }

//   const prevLocation = async () => {
//     const result = await Location.getLastKnownPositionAsync();

//     if (result) {
//       console.log(result);
//       // setLocationData(result.coords);
//     }
//   }

//   useEffect(() => {
//     handleGrantPermission();
//   }, [])

//   return (
//     <View style={styles.container}>

//       <Text style={styles.title}>Location</Text>

//       {/* <Pressable onPress={handleGrantPermission} style={styles.button}>
//         <Text style={styles.buttonText}>Grant Permission</Text>
//       </Pressable>

//       <Pressable onPress={handleGetCurrentLocation} style={styles.button}>
//         <Text style={styles.buttonText}>Get Current Location</Text>
//       </Pressable> */}

//       <Pressable onPress={handleStartTracker} style={styles.button}>
//         <Text style={styles.buttonText}>Grant Permission</Text>
//       </Pressable>

//       <Pressable onPress={handleStopTracker} style={styles.button}>
//         <Text style={styles.buttonText}>Get Current Location</Text>
//       </Pressable>

//       {locationData && (
//         <>
//           <Text style={styles.locationText}>
//             Latitude: {locationData.latitude}
//           </Text>

//           <Text style={styles.locationText}>
//             Longitude: {locationData.longitude}
//           </Text>

//           <Text style={styles.locationText}>
//             Accuracy: {locationData.accuracy}
//           </Text>

//           <Text style={styles.locationText}>
//             Altitude: {locationData.altitude}
//           </Text>
//         </>
//       )}
//     </View>
//   )
// }

// export default location

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   map: {
//     width: '90%',
//     height: 300,
//     marginVertical: 12,
//     borderRadius: 12,
//   },
//   locationInfo: {
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 16,
//     marginVertical: 2,
//   },
//   button: {
//     backgroundColor: '#4e4a4a',
//     borderWidth: 5,
//     borderColor: 'black',
//     padding: 15,
//     margin: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// })





// import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import * as ExpoLocation from 'expo-location'
// import MapView, { Marker } from 'react-native-maps'


// type LocationCoords = {
//   latitude: number
//   longitude: number
// }

// const defaultRegion = {
//   latitude: 20.5937,
//   longitude: 78.9629,
//   latitudeDelta: 0.05,
//   longitudeDelta: 0.05,
// }

// const Location = () => {
//   const [location, setLocation] = useState<LocationCoords | null>(null)
//   const [region, setRegion] = useState(defaultRegion)

//   const getCurrentLocation = async () => {
//     const { status } = await ExpoLocation.requestForegroundPermissionsAsync()
//     if (status !== 'granted') {
//       Alert.alert('Access Denied', 'Permission to access location was denied')
//       return
//     }

//     const currentLocation = await ExpoLocation.getCurrentPositionAsync({
//       accuracy: ExpoLocation.Accuracy.High,
//     })

//     const coords = currentLocation.coords
//     setLocation(coords)
//     setRegion({
//       latitude: coords.latitude,
//       longitude: coords.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     })
//   }

//   useEffect(() => {
//     void getCurrentLocation()
//   }, [])

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Location</Text>
//       <MapView style={styles.map} region={region} showsUserLocation>
//         {location ? (
//           <Marker
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             title="Your Location"
//             description="Current position"
//           />
//         ) : null}
//       </MapView>

//       {location && (
//         <View style={styles.locationInfo}>
//           <Text style={styles.locationText}>
//             Latitude: {location.latitude.toFixed(4)}
//           </Text>
//           <Text style={styles.locationText}>
//             Longitude: {location.longitude.toFixed(4)}
//           </Text>
//         </View>
//       )}

//       <Pressable style={styles.button} onPress={() => void getCurrentLocation()}>
//         <Text style={styles.buttonText}>Get Current Location</Text>
//       </Pressable>
//     </View>
//   )
// }

// export default Location

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   map: {
//     width: '90%',
//     height: 300,
//     marginVertical: 12,
//     borderRadius: 12,
//   },
//   locationInfo: {
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 16,
//     marginVertical: 2,
//   },
//   button: {
//     backgroundColor: '#4e4a4a',
//     borderWidth: 5,
//     borderColor: 'black',
//     padding: 15,
//     margin: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// })
