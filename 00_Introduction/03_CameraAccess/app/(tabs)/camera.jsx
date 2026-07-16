// import { Button, StyleSheet, Text, View } from 'react-native'
// import React, { useState, useRef } from 'react'
// import { CameraView, useCameraPermissions } from "expo-camera"

// const camera = () => {
//     const CameraRef = useRef(null);
//     const [facing, setFacing] = useState("back");
//     const [permission, setPermission] = useCameraPermissions();
//     const [photo, setPhoto] = useState(null);

//     if(!permission?.granted){
//         return(
//             <View style={styles.container}>
//                 <Button title='Grant Permission' onPress={setPermission} />
//             </View>
//         )
//     }

//     const takePhoto = async() => {
//         const result = await CameraRef?.current.takePictureAsync()
//         if(result){
//             setPhoto(result.uri)
//         }
//     }

//     return (
//         <View style={styles.container}>
//             <Text>camera</Text>
//             <CameraView ref={CameraRef} style={styles.camera} facing={facing} />
//             <Button title='Flip Camera' onPress={() => setFacing(facing ==="back"?"front":"back")} />
//                 <Button title="CLick Picture" onPress={takePhoto}/>
//                 {
//                     photo && (
//                         <Image source={{uri}} style={{
//                             width:120,
//                             height:120,
//                             marginTop:20
//                         }}
//                         />
//                     )
//                 }
//         </View>
//     )
// }

// export default camera

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingTop: 50,
//         paddingHorizontal: 20,
//         backgroundColor: '#fff',
//     },
//     camera:{
//         flex:1,
//     }
// })


import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions({ writeOnly: true });
  const [photo, setPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Loading permissions...</Text>
      </View>
    );
  }

  if (!permission.granted || !mediaPermission?.granted) {
    // Camera or Media permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera and save photos</Text>
        <Button onPress={async () => {
          await requestPermission();
          await requestMediaPermission();
        }} title="Grant Permissions" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        const options = { quality: 1, base64: true, exif: false };
        const capturedPhoto = await cameraRef.current.takePictureAsync(options);
        if (capturedPhoto?.uri) {
          setPhoto(capturedPhoto.uri);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  }

  async function savePhoto() {
    if (photo) {
      try {
        setIsProcessing(true);
        await MediaLibrary.saveToLibraryAsync(photo);
        Alert.alert('Saved!', 'Photo has been saved to your gallery.');
        setPhoto(null);
      } catch (error) {
        console.error('Failed to save photo:', error);
        Alert.alert('Error', 'Failed to save photo.');
      } finally {
        setIsProcessing(false);
      }
    }
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { marginBottom: 15 }]} onPress={savePhoto}>
            {isProcessing ? <ActivityIndicator color="white" /> : <Text style={styles.text}>Save to Gallery</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
            <Text style={styles.text}>Take Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      
      {/* Overlay action buttons using absolute positioning */}
      <View style={styles.cameraActionContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.captureButtonInner} />
          )}
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  cameraActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  placeholder: {
    width: 50,
  },
});