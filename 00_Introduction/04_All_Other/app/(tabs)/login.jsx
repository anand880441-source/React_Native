import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

const login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (name.trim() === "Anand" && password === "12345") {
            await SecureStore.setItemAsync("education", "Dharmandra_Pradhan")
            router.replace('/home')
        }else{
            alert("Invalid Credentials")
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>login</Text>

            <TextInput style={styles.input} placeholder='Enter Your Name...' value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder='Enter Your Password' value={password} onChangeText={setPassword} secureTextEntry />

            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
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
});
