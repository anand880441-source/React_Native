import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const deshboard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Welcome Back!!</Text>
      </View>
    </View>
  )
}

export default deshboard

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#fff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  welcomeText: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#333' },
});
