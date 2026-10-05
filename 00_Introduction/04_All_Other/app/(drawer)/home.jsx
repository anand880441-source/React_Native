import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native"
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"
import Ionicons from '@expo/vector-icons/Ionicons'

const HomeScreen = () => {
  const [token, setToken] = useState<string | null>(null)
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
        <Ionicons name="log-out-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  userName: {
    color: '#3B82F6',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLabel: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 4,
  },
  cardValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
})