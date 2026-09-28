import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'

const signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      Alert.alert("Error", "Backend URL is not configured")
      return
    }

    try {
      const response = await fetch(`${backendUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucess", data.message || "user registered sucessfully")
        router.replace('/deshboard')
      } else {
        Alert.alert("Error", data.message || "Registration Failed")
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  }

  const handleLoginPage = async () => {
    router.replace('/login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignUp</Text>

      <TextInput
        placeholder='Enter Your name...'
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder='Enter Your email...'
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder='Enter Your password...'
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      <View style={styles.redirectContainer}>
        <Text style={styles.redirectText}>Already have an account?</Text>
        <Pressable onPress={handleLoginPage}>
          <Text style={styles.redirectLink}>Login</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  redirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  redirectText: {
    fontSize: 14,
    color: '#666666',
  },
  redirectLink: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginLeft: 4,
  },
});
