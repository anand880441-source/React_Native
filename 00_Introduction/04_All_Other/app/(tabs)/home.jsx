import { StyleSheet, Text, View, Button, Pressable } from "react-native"
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

const HomeScreen = () => {
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('userToken')

      if (!storedToken) {
        router.replace('/login')
        return
      }

      const storedName = await SecureStore.getItemAsync('userName')
      const storedEmail = await SecureStore.getItemAsync('userEmail')
      setToken(storedToken)
      setUserData({
        name: storedName || 'User',
        email: storedEmail || 'Not provided',
      })
    } catch (error) {
      console.error('Error checking login:', error)
      router.replace('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken')
    await SecureStore.deleteItemAsync('userName')
    await SecureStore.deleteItemAsync('userEmail')
    setToken(null)
    setUserData({ name: '', email: '' })
    router.replace('/login')
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back,</Text>
      <Text style={styles.userName}>{userData.name}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Email</Text>
        <Text style={styles.cardValue}>{userData.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Session</Text>
        <Text style={styles.cardValue}>{token ? 'Active' : 'Not authenticated'}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  userName: {
    color: '#E2E8F0',
    fontSize: 20,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 6,
  },
  cardValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingText: {
    color: '#F8FAFC',
    fontSize: 18,
  },
})