import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Slider from "@react-native-community/slider";

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Camera Screen Demo Class </Text>

      <CameraView
        zoom={zoom}
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      />

      <Slider
        minimumValue={0}
        maximumValue={1}
        value={zoom}
        onValueChange={setZoom}
      />

      <Button
        title="Flip"
        onPress={() => setFacing(facing === "back" ? "front" : "back")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
  },
  camera: {
    flex: 1,
  },
});