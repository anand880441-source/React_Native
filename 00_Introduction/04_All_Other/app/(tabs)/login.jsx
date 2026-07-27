// import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
// import React, { useState } from 'react'
// import * as SecureStore from "expo-secure-store"
// import { router } from "expo-router"

// const login = () => {
//     const [name, setName] = useState('');
//     const [password, setPassword] = useState('');

//     const handleLogin = async () => {
//         if (name.trim() === "Anand" && password === "12345") {
//             await SecureStore.setItemAsync("education", "Dharmandra_Pradhan")
//             router.replace('/home')
//         }else{
//             alert("Invalid Credentials")
//         }
//     }


//     return (
//         <View style={styles.container}>
//             <Text style={styles.heading}>login</Text>

//             <TextInput style={styles.input} placeholder='Enter Your Name...' value={name} onChangeText={setName} />
//             <TextInput style={styles.input} placeholder='Enter Your Password' value={password} onChangeText={setPassword} secureTextEntry />

//             <Pressable style={styles.button} onPress={handleLogin}>
//                 <Text style={styles.buttonText}>Login</Text>
//             </Pressable>

//         </View>
//     )
// }

// export default login

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   heading: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 40,
//     textTransform: 'capitalize',
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: '#333333',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   button: {
//     backgroundColor: '#3f92fe',
//     width: '100%',
//     height: 50,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 8,
//     shadowColor: '#3f92fe',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });


import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as LocalAuthentication from 'expo-local-authentication'

const login = () => {
  const [name, setName] = useState('')
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

  const handleLogin = async () => {
    try {
      const storedName = await SecureStore.getItemAsync('userName')
      const storedPassword = await SecureStore.getItemAsync('userPassword')

      if (storedName && storedPassword && name.trim() === storedName && password === storedPassword) {
        await SecureStore.setItemAsync('userToken', 'authenticated')
        router.replace('/home')
      } else {
        Alert.alert('Invalid Credentials', 'Please sign up or try again.')
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again later.')
      console.error(error)
    }
  }

  const handleLoginWithFace = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Biometric unavailable', 'Your device does not support biometric login or no biometrics are enrolled.')
        return
      }

      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Login with biometrics', fallbackLabel:"Use Password" })

      if (result.success) {
        const token = await SecureStore.getItemAsync('userToken')
        if (token) {
          router.replace('/home')
        } else {
          Alert.alert('No saved session', 'Please log in once using your username and password first.')
        }
      } else {
        Alert.alert('Authentication failed', 'Biometric login was not successful.')
      }
    } catch (error) {
      Alert.alert('Biometric login error', 'Unable to complete biometric login.')
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder='Enter Your Name'
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter Your Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleLoginWithFace}>
        <Text style={styles.buttonText}>Login with Biometric</Text>
      </Pressable>

      <Pressable style={styles.linkButton} onPress={() => router.replace('/signup')}>
        <Text style={styles.linkButtonText}>Don't have an account? Sign Up</Text>
      </Pressable>
    </View>
  )
}

export default login

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