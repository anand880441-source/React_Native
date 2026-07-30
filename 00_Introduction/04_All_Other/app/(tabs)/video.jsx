import { View, Text, Button } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useRef, useState } from "react";
import {useVideoPlayer, VideoView} from "expo-video"
import Slider from "@react-native-community/slider";

const Camera = () => {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microPhonePermission, requestMicroPhonePermission] = useMicrophonePermissions();
  const [video, setVideo] = useState(null);
  const [facing, setFacing] = useState("back");
  const [zoom, setZoom] = useState(0);
  const [mute, setMute] = useState(false)

  const player = useVideoPlayer(video);

  if (!cameraPermission || !microPhonePermission) {
    return <View />
  }
  if (!cameraPermission?.granted || !microPhonePermission?.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Grant Camera Permission" onPress={requestCameraPermission} />
        <View style={{ height: 10 }} />
        <Button title="Grant MicroPhone Permission" onPress={requestMicroPhonePermission} />
      </View>
    )
  }

  const handleStartRcording = async () => {
    const result = await cameraRef.current.recordAsync()
    console.log(result)
    setVideo(result.uri)
  }
  const handleStopRecording = async () => {
    await cameraRef.current.stopRecording();
  }
  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} ref={cameraRef} mode="video" facing={facing} zoom={zoom} mute={mute}/>

      <Button title="Start" onPress={handleStartRcording} />
      <View style={{ height: 10 }} />
      <Button title="Stop" onPress={handleStopRecording} />
      <View style={{ height: 10 }} />
      <Button title="Flip" onPress={() => setFacing(facing === "back" ? "front" : "back")} />
      <Slider minimumValue={0} maximumValue={1} value={zoom} onValueChange={setZoom}/>
      <Button title="mute" onPress={() => setMute(mute === true?false : true)} />

      {
        video && <VideoView style={{height:300, width:'100%'}} player={player}/>
      }

    </View>
  )
}
export default Camera;