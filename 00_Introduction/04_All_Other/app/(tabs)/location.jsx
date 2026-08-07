// import React, { useEffect, useRef, useState } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import * as Location from "expo-location";

// export default function LocationScreen() {
//   const [location, setLocation] = useState(null);
//   const statRef = useRef(null);

//   const handleStartTracker = async () => {
//     const permission = await Location.requestForegroundPermissionsAsync();

//     if (!permission.granted) {
//       alert("Permission to access location was denied");
//       return;
//     }

//     statRef.current = await Location.watchPositionAsync(
//       {
//         accuracy: Location.Accuracy.High,
//         timeInterval: 2000, 
//         distanceInterval: 1,
//       },
//       (resLocation) => {
//         console.log(resLocation);   
//         setLocation(resLocation);
//       }
//     );
//   };

//   const handleStopTracker = () => {
//     if (statRef.current) {
//       statRef.current.remove();
//       statRef.current = null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Location Tracker</Text>

//       {location ? (
//         <View style={styles.locationBox}>
//           <Text style={styles.text}>
//             Latitude: {location.coords.latitude.toFixed(6)}
//           </Text>
//           <Text style={styles.text}>
//             Longitude: {location.coords.longitude.toFixed(6)}
//           </Text>
//           <Text style={styles.text}>
//             Accuracy: {location.coords.accuracy} m
//           </Text>
//         </View>
//       ) : (
//         <Text style={styles.text}>No location yet...</Text>
//       )}

//       <View style={styles.buttonRow}>
//         <Button title="Start Tracking" onPress={handleStartTracker} />
//         <Button title="Stop Tracking" onPress={handleStopTracker} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#006d77", 
//     padding: 20,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginBottom: 25,
//     color: "#edf6f9", 
//     textAlign: "center",
//   },
//   locationBox: {
//     marginBottom: 25,
//     padding: 20,
//     backgroundColor: "#83c5be",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5, 
//     width: "90%",
//   },
//   text: {
//     fontSize: 16,
//     color: "#073b4c",
//     marginBottom: 8,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "80%",
//     marginTop: 15,
//   },
//   buttonWrapper: {
//     flex: 1,
//     marginHorizontal: 5,
//     borderRadius: 8,
//     overflow: "hidden", 
//   },
// });



// import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
// import * as Location from "expo-location";
// import MapView, { Marker } from 'react-native-maps';
// import { useState } from 'react';

// const LocationScreen = () => {
//   const [location, setLocation] = useState(null);
//   const [lastLocation, setLastLocation] = useState(null);

//   const handleGrantPermission = async () => {
//     console.log("--- handleGrantPermission Triggered ---");
//     const permission = await Location.requestForegroundPermissionsAsync();

//     console.log("Permission Response Object:", JSON.stringify(permission, null, 2));

//     if (!permission.granted) {
//       Alert.alert("Permission Denied", "Location permission is required to use this feature.");
//       return;
//     }

//     Alert.alert("Success", "Location permission granted!");
//   };

//   const handleGetCurrentLocation = async () => {
//     console.log("--- handleGetCurrentLocation Triggered ---");
//     const isGranted = await Location.getForegroundPermissionsAsync();

//     if (!isGranted.granted) {
//       Alert.alert("Permission Required", "Please grant location access first.");
//       return;
//     }

//     try {
//       console.log("Requesting highest accuracy current position...");
//       const currentLocation = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest
//       });

//       console.log("Fetched Current Location Successfully:", JSON.stringify(currentLocation, null, 2));

//       if (currentLocation) {
//         setLocation(currentLocation);
//       }
//     } catch (error) {
//       console.error("Error caught in handleGetCurrentLocation:", error);
//       Alert.alert("Error", "Could not fetch location.");
//     }
//   };

//   const getLastLocation = async () => {
//     console.log("--- getLastLocation Triggered ---");
//     const isGranted = await Location.getForegroundPermissionsAsync();

//     if (!isGranted.granted) {
//       Alert.alert("Permission Required", "Please grant location access first.");
//       return;
//     }

//     console.log("Retrieving hardware cached position...");
//     const savedlastLocation = await Location.getLastKnownPositionAsync();

//     console.log("Fetched Last Known Cached Location Object:", JSON.stringify(savedlastLocation, null, 2));

//     if (savedlastLocation) {
//       setLastLocation(savedlastLocation);
//     } else {
//       Alert.alert("Not Found", "No last known location cached on this device.");
//     }
//   };

//   const activeLocation = location || lastLocation;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Location Screen</Text>

//       <Pressable style={styles.button} onPress={handleGrantPermission}>
//         <Text style={styles.buttonText}>Grant Permission</Text>
//       </Pressable>

//       <Pressable style={styles.button} onPress={handleGetCurrentLocation}>
//         <Text style={styles.buttonText}>Get Current Location</Text>
//       </Pressable>

//       <Pressable style={styles.button} onPress={getLastLocation}>
//         <Text style={styles.buttonText}>Get Last Location</Text>
//       </Pressable>

//       {location && (
//         <View style={styles.locationInfo}>
//           <Text style={styles.sectionHeader}>Current Location:</Text>
//           <Text style={styles.locationText}>Latitude: {location.coords.latitude}</Text>
//           <Text style={styles.locationText}>Longitude: {location.coords.longitude}</Text>
//         </View>
//       )}

//       {lastLocation && (
//         <View style={styles.locationInfo}>
//           <Text style={styles.sectionHeader}>Last Location:</Text>
//           <Text style={styles.locationText}>Latitude: {lastLocation.coords.latitude}</Text>
//           <Text style={styles.locationText}>Longitude: {lastLocation.coords.longitude}</Text>
//         </View>
//       )}

//       {activeLocation && (
//         <View style={styles.mapContainer}>
//           <MapView
//             style={styles.map}
//             region={{
//               latitude: activeLocation.coords.latitude,
//               longitude: activeLocation.coords.longitude,
//               latitudeDelta: 0.01,
//               longitudeDelta: 0.01,
//             }}
//             showsUserLocation={true}
//           >
//             <Marker
//               coordinate={{
//                 latitude: activeLocation.coords.latitude,
//                 longitude: activeLocation.coords.longitude,
//               }}
//               title="Selected Location"
//               description="This is the fetched coordinate point"
//             />
//           </MapView>
//         </View>
//       )}
//     </View>
//   );
// };

// export default LocationScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justify: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   locationInfo: {
//     marginVertical: 5,
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 8,
//     width: '80%',
//   },
//   locationText: {
//     fontSize: 14,
//     marginVertical: 1,
//     fontWeight: '500',
//   },
//   button: {
//     backgroundColor: '#4e4a4a',
//     borderWidth: 2,
//     borderColor: 'black',
//     padding: 15,
//     margin: 5,
//     borderRadius: 5,
//     width: '80%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   mapContainer: {
//     width: '90%',
//     height: 250,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });




// import { View, Text, Button, Alert, StyleSheet, Dimensions } from 'react-native'
// import * as Location from 'expo-location'
// import { useState, useRef, useEffect } from 'react'
// import MapView, { Marker } from 'react-native-maps'

// const LocationPage = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [lastLocation, setLastLocation] = useState(null);
//   const liveRef = useRef(null);
//   const [liveLocation, setLiveLocation] = useState(null);

//   const handleGrantPermission = async () => {
//     const permission = await Location.requestForegroundPermissionsAsync();
//     if (!permission?.granted) {
//       Alert.alert("Permission Denid!", "Plese give permission to access these feature!!")
//       return;
//     }
//   }

//   const handleGetCurrentLocation = async () => {
//     const checkPermission = await Location.getForegroundPermissionsAsync()
//     if (!checkPermission?.granted) {
//       Alert.alert("Permission Denid!", "Plese give permission to access these feature!!")
//       return;
//     }
//     try {
//       const currentLocation = await Location.getCurrentPositionAsync();
//       if (currentLocation) {
//         setCurrentLocation(currentLocation);
//         console.log(currentLocation);
//       }
//     } catch (error) {
//       Alert.alert(error, `Unable to fatch current location location!!`)
//     }
//   }

//   const handleGetLastLocation = async () => {
//     const checkPermission = await Location.getForegroundPermissionsAsync()
//     if (!checkPermission?.granted) {
//       Alert.alert("Permission Denid!", "Plese give permission to access these feature!!")
//       return;
//     }
//     try {
//       const lastLocation = await Location.getLastKnownPositionAsync()
//       if (lastLocation) {
//         setLastLocation(lastLocation);
//         console.log(lastLocation);
//       }
//     } catch (error) {
//       Alert.alert(error, "Unable to fatch Current location!!")
//     }
//   }

//   const handleTrackLocation = async () => {
//     const checkPermission = await Location.getForegroundPermissionsAsync()
//     if (!checkPermission?.granted) {
//       Alert.alert("Permission Denid!", "Plese give permission to access these feature!!")
//       return;
//     }
//     try {
//       liveRef.current = await Location.watchPositionAsync({}, (resLocation) => {
//         setLiveLocation(resLocation);
//       })
//     } catch (error) {
//       Alert.alert("Error!", "Unable to fatch Current Location!")
//     }
//   }

//   const handleStopTracker = async () => {
//     if (liveRef.current) {
//       liveRef.current.remove();
//       liveRef.current = null;
//     }
//   }

//   useEffect(() => {
//     handleTrackLocation();
//   }, [])

//   const activeLocation = handleGetCurrentLocation || handleGetLastLocation;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Location Page</Text>

//       <View style={styles.buttonContainer}>
//         <Button title='Grant Permission' onPress={handleGrantPermission} />
//         <Button title='Get Current Location' onPress={handleGetCurrentLocation} />
//         <Button title='Get Last Location' onPress={handleGetLastLocation} />
//         <Button title='Stop Live Tracker' onPress={handleStopTracker} />
//       </View>

//       {currentLocation && (
//         <View style={styles.infoBox}>
//           <Text style={styles.infoTitle}>Current Location:</Text>
//           <Text>Latitude : {currentLocation.coords.latitude}</Text>
//           <Text>Longititude : {currentLocation.coords.longitude}</Text>
//         </View>
//       )}

//       {lastLocation && (
//         <View style={styles.infoBox}>
//           <Text style={styles.infoTitle}>Last Location:</Text>
//           <Text>Latitude : {lastLocation.coords.latitude}</Text>
//           <Text>Longititude : {lastLocation.coords.longitude}</Text>
//         </View>
//       )}

//       {liveLocation && (
//         <View style={styles.infoBox}>
//           <Text style={styles.infoTitle}>Live Location:</Text>
//           <Text>Latitude : {liveLocation.coords.latitude}</Text>
//           <Text>Longititude : {liveLocation.coords.longitude}</Text>
//         </View>
//       )}

//       {activeLocation && (
//         <MapView
//           style={styles.map}
//           region={{
//             longitude: activeLocation.coords.longitude,
//             latitude: activeLocation.coords.latitude,
//           }}
//         >
//         </MapView>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   buttonContainer: {
//     gap: 10,
//     marginBottom: 20,
//   },
//   infoBox: {
//     marginVertical: 10,
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//   },
//   infoTitle: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   map: {
//     width: '100%',
//     height: 300,
//     marginTop: 20,
//   },
// });

// export default LocationPage;




import { View, Text, Button } from "react-native"
import * as Location from "expo-location"
import { useState } from "react"

export default function LocationScreen() {

  // const [address, setAddress] = useState(null);
  // const [currLocation, setCurrLocation] = useState(null);

  const handleGetAddress = async () => {
    // const permission = await Location.requestForegroundPermissionsAsync()

    // if (!permission.granted) {
    //   alert("permission denied")
    //   return;
    // }

    // const currentlocation = await Location.getCurrentPositionAsync({
    //   accuracy: Location.Accuracy.Highest,
    // })
    
    // const getAddress = await Location.reverseGeocodeAsync({
    //   latitude:currentlocation.coords.latitude,
    //   longitude:currentlocation.coords.longitude
    // })

    // console.log(currentlocation)
    // console.log(getAddress)
    // if(getAddress){
    //   setAddress(getAddress);
    // }
    // if(currLocation){
    //   setCurrLocation(currentlocation);
    // }

    const address = await Location.geocodeAsync('ahmedabad,gujarat')
    console.log(address)

  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "teal" }}>

      <Text>React Native Expo Location Class</Text>
      +

      <Button title="Get Address" onPress={handleGetAddress} />
      
      {/* {address &&
        <View>
          <Text>City: {address[0].city}</Text>
          <Text>Country: {address[0].country}</Text>
          <Text>District: {address[0].district}</Text>
          <Text>IsoCountryCode: {address[0].isoCountryCode}</Text>
          <Text>Name: {address[0].name}</Text>
          <Text>city: {address[0].city}, country: {address[0].country}, district: {address[0].district}, postalCode: {address[0].postalCode} regoin: {address[0].region}</Text>
        </View>
      } */}

    </View>
  )
}
