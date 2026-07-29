// import React, { useRef, useState } from "react";
// import { Button, StyleSheet, Text, View, Image } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import Slider from "@react-native-community/slider";

// export default function CameraScreen() {
//   const [facing, setFacing] = useState("back");
//   const [zoom, setZoom] = useState(0);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const [photo, setPhoto] = useState(null);
//   const [flash, setFlash] = useState("off");

//   if (!permission?.granted) {
//     return (
//       <View style={styles.container}>
//         <Button title="Grant Permission" onPress={requestPermission} />
//       </View>
//     );
//   }

//   const handleTakePicture = async () => {
//     const result = await cameraRef?.current?.takePictureAsync()

//     if(result){
//       setPhoto(result.uri)
//     }
//     console.log(result);
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}> Camera Screen Demo Class </Text>

//       <CameraView
//         zoom={zoom}
//         style={styles.camera}
//         facing={facing}
//         ref={cameraRef}
//         flash={flash}
//         autofocus="on"
//         mirror={false}
//         mute={false}
//       />

//       <Slider
//         minimumValue={0}
//         maximumValue={1}
//         value={zoom}
//         onValueChange={setZoom}
//       />

//       <Button
//         title="Flip"
//         onPress={() => setFacing(facing === "back" ? "front" : "back")}
//       />

//       <Button title="Flash" 
//         onPress={() => setFlash(flash === "on" ? "off" : "on")}
//       />

//       <Button 
//         title="Take Picture" onPress={handleTakePicture}
//       />

//       {
//         photo && (
//           <Image source={{uri :photo}} style={{height : 200, width: 200}} />
//         )
//       }
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 22,
//   },
//   camera: {
//     flex: 1,
//   },
// });




import React, { useRef, useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Slider from "@react-native-community/slider";

const Camera = () => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [zoom, setZoom] = useState(0);
  const [photo, setPhoto] = useState(null);

  // Loading state for permissions
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Loading permissions...</Text>
      </View>
    );
  }

  // Permission denied state
  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>We need your permission to show the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      if (result && result.uri) {
        setPhoto(result.uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera Viewfinder */}
      <CameraView
        ref={cameraRef}
        facing={facing}
        zoom={zoom}
        flash="on"
        style={styles.camera}
      >
        {/* Floating Controls Overlay */}
        <View style={styles.controlsContainer}>

          {/* Zoom Slider Panel */}
          <View style={styles.sliderRow}>
            <Text style={styles.controlText}>Zoom</Text>
            <Slider
              style={styles.slider}
              value={zoom}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#666666"
              thumbTintColor="#FFFFFF"
              onValueChange={setZoom}
            />
          </View>

          {/* Action Row: Flip, Capture, Preview */}
          <View style={styles.actionRow}>

            {/* Flip Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>

            {/* Shutter Button */}
            <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
              <View style={styles.captureInnerCircle} />
            </TouchableOpacity>

            {/* Thumbnail Preview Area */}
            <View style={styles.previewContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.thumbnail} />
              ) : (
                <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
              )}
            </View>

          </View>
        </View>
      </CameraView>
    </View>
  );
};

// CSS-in-JS Component Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end", // Aligns overlay controls to the bottom
  },
  controlsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Translucent black panel
    paddingBottom: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
    height: 40,
  },
  controlText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 75,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
  },
  previewContainer: {
    width: 75,
    alignItems: "flex-end",
  },
  thumbnail: {
    width: 55,
    height: 55,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  thumbnailPlaceholder: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderStyle: "dashed",
  },
});

export default Camera;
