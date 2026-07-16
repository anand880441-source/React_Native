import React from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const handleFollow = () => {
    Alert.alert("Success", "You are now following Anand Suthar!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/profile.png")}
          style={styles.image}
        />

        <Text style={styles.name}>Anand Suthar</Text>

        <Text style={styles.role}>Fullstack Developer</Text>
        <Text style={styles.name}>Computer Engineering</Text>
        <Text style={styles.name}>Gandlotiya University</Text>

        <Text style={styles.bio}>
          Architecting immersive digital experiences by merging cutting-edge 3D graphics with robust frontend engineering. Specialized in making the impossible, interactive.
        </Text>

        <Pressable
          onPress={handleFollow}
          android_ripple={{
            color: "rgba(55, 255, 0, 0.6)",
            borderless: false,
            foreground: true,
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    width: 340,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 15,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: "#ffffff",
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e2937",
    marginBottom: 6,
  },
  role: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 20,
  },
  bio: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 28,
  },
  button: {
    width: "100%",
    height: 58,
    backgroundColor: "#1976D2",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Profile;