import React, { useRef, useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useVideoPlayer, VideoView } from "expo-video";

const TravelGuardian = () => {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [torch, setTorch] = useState(false);
  const [picture, setPicture] = useState(null);
  const [mode, setMode] = useState("picture");
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);
  const [timer, setTimer] = useState(0);

  const player = useVideoPlayer(video);


  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!cameraPermission || !micPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Loading...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Camera and Microphone permissions are required.</Text>
        <Pressable
          style={[styles.button, { marginTop: 20 }]}
          onPress={async () => {
            await requestCameraPermission();
            await requestMicPermission();
          }}
        >
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </Pressable>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (mode !== "picture") {
      Alert.alert("Error", "Switch to camera mode first");
      return;
    }
    try {
      if (cameraRef.current) {
        const result = await cameraRef.current.takePictureAsync();
        if (result) {
          console.log("Picture saved:", result.uri);
          setPicture(result.uri);
        }
      }
    } catch (error) {
      Alert.alert("Error", `Unable to Take Picture: ${error.message}`);
    }
  };

  const handleRecordVideo = async () => {
    if (mode !== "video") {
      Alert.alert("Error", "Switch to video mode first");
      return;
    }
    if (isRecording) {
      try {
        await cameraRef.current?.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.error("Failed to stop recording", error);
      }
      return;
    }
    try {
      if (cameraRef.current) {
        setIsRecording(true);
        console.log("Starting Video Recording...");
        const result = await cameraRef.current.recordAsync();
        console.log("Video saved:", result?.uri);
        setVideo(result.uri);
      }
    } catch (error) {
      setIsRecording(false);
      Alert.alert("Error", `Unable to Record Video: ${error.message}`);
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "picture" ? "video" : "picture"));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Guardian</Text>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        flash={flash}
        enableTorch={torch}
        mode={mode}
      />
      {isRecording && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Recording: {timer}s</Text>
        </View>
      )}
      <View style={styles.controlsContainer}>
        <Pressable style={styles.button} onPress={() => setFacing(facing === "back" ? "front" : "back")}>
          <Text style={styles.buttonText}>FLIP CAMERA</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setFlash(flash === "on" ? "off" : "on")}>
          <Text style={styles.buttonText}>FLASH: {flash.toUpperCase()}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setTorch(!torch)}>
          <Text style={styles.buttonText}>TORCH: {torch ? "ON" : "OFF"}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={toggleMode}>
          <Text style={styles.buttonText}>MODE: {mode.toUpperCase()}</Text>
        </Pressable>
        {mode === "picture" ? (
          <Pressable style={[styles.button, styles.captureBtn]} onPress={handleTakePicture}>
            <Text style={styles.buttonText}>CAPTURE PHOTO</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, styles.captureBtn, isRecording && styles.recordingBtn]}
            onPress={handleRecordVideo}
          >
            <Text style={styles.buttonText}>
              {isRecording ? "STOP RECORDING" : "START RECORDING"}
            </Text>
          </Pressable>
        )}
        {picture && (
          <Image source={{ uri: picture }} style={{ height: 200, width: 200, marginTop: 10 }} />
        )}
        {video && (
          <VideoView style={{ height: 200, width: '100%', marginTop: 10 }} player={player} />
        )}
      </View>
    </View>
  );
};

export default TravelGuardian;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  camera: {
    flex: 1,
    width: '100%'
  },
  timerContainer: {
    position: 'absolute',
    top: 80,
    selfAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 5
  },
  timerText: {
    color: 'white',
    fontWeight: 'bold'
  },
  controlsContainer: {
    padding: 20,
    alignItems: 'center', gap: 10
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333"
  },
  button: {
    backgroundColor: '#4e4a4a',
    borderWidth: 1,
    borderColor: 'black',
    padding: 12,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center'
  },
  captureBtn: {
    backgroundColor: '#2e7d32',
    marginTop: 10
  },
  recordingBtn: {
    backgroundColor: '#d32f2f'
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
});
