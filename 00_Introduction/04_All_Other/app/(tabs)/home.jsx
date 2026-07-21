import { StyleSheet, Text, View, Button } from "react-native"
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

const HomeScreen = () => {
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async () => {
    const storedToken = await SecureStore.getItemAsync("education")
    
    if (!storedToken) {
      router.replace("/login")
    } else {
      setToken(storedToken)
      try {
        const userInfo = await SecureStore.getItemAsync("education")
        if (userInfo) {
          setUserData(JSON.parse(userInfo))
        }
      } catch (error) {
        console.log("Error retrieving user data:", error)
      }
    }
  }

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("education")
    await SecureStore.deleteItemAsync("userInfo")
    setToken(null)
    setUserData(null)
    router.replace("/login")
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "red", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20 }}>
        Home Screen
      </Text>

      {userData ? (
        <View style={{ backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 20 }}>
          <Text style={{ fontSize: 16 }}>Welcome, {userData.name || "User"}!</Text>
          <Text style={{ fontSize: 14, color: "gray" }}>Email: {userData.email || "Not provided"}</Text>
        </View>
      ) : (
        <Text style={{ color: "white", marginBottom: 20 }}>
          {token ? "Logged in successfully!" : "Loading..."}
        </Text>
      )}

      {token && (
        <View style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 5, marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 12 }}>
            Token: {token.substring(0, 20)}...
          </Text>
        </View>
      )}

      <Button title="Logout" onPress={handleLogout} color="white" />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})