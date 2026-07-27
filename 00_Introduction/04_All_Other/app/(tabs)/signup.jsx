import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

const signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken')
        if (token) {
          router.replace('/home')
        }
      } catch (error) {
        console.error('Session check failed:', error)
      }
    }

    checkExistingSession()
  }, [])

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing information', 'Please fill in all fields.')
      return
    }

    try {
      await SecureStore.setItemAsync('userName', name.trim())
      await SecureStore.setItemAsync('userEmail', email.trim())
      await SecureStore.setItemAsync('userPassword', password)
      await SecureStore.setItemAsync('userToken', 'authenticated')

      Alert.alert('Signup successful', 'You are now logged in.')
      router.replace('/home')
    } catch (error) {
      Alert.alert('Signup failed', 'Please try again.')
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder='Enter Name'
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder='Enter Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable style={styles.linkButton} onPress={() => router.replace('/login')}>
        <Text style={styles.linkButtonText}>Already have an account? Login</Text>
      </Pressable>
    </View>
  )
}

export default signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 40,
    textTransform: 'capitalize',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#3f92fe',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3f92fe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
  },
  linkButtonText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
});