// import { Text, View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
// import * as LocalAuth from 'expo-local-authentication';
// import * as SecureStore from 'expo-secure-store';
// import { useEffect, useState } from 'react';
// import { router } from 'expo-router';

// const LocalAuthentication = () => {
//   const [userName, setUserName] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       if (userName.trim() === 'Admin' && password.trim() === '123456') {
//         await SecureStore.setItemAsync('token', 'this_is_token');
//         await SecureStore.setItemAsync('biometric', 'true');

//         Alert.alert('Success', 'Login Successful');
//         router.replace('/home');
//       } else {
//         Alert.alert('Invalid Credentials', 'Please sign up or try again.');
//       }
//     } catch (error) {
//       Alert.alert('Login Failed', 'Please try again later.');
//       console.error(error);
//     }
//   };

//   const handleBiometric = async () => {
//     try {
//       const hasHardware = await LocalAuth.hasHardwareAsync();
//       const isEnrolled = await LocalAuth.isEnrolledAsync();

//       if (!hasHardware || !isEnrolled) {
//         Alert.alert('Not Available', 'Biometric authentication is not set up on this device.');
//         return;
//       }

//       const token = await SecureStore.getItemAsync('token');
//       const biometricEnabled = await SecureStore.getItemAsync('biometric');

//       if (!token || biometricEnabled !== 'true') {
//         Alert.alert('Login Required', 'Please login with your username and password first.');
//         return;
//       }

//       const result = await LocalAuth.authenticateAsync({
//         promptMessage: 'Login with biomatric',
//       });

//       if (result.success) {
//         Alert.alert('Success', 'Biometric Authentication Successful');
//         router.replace('/home');
//       } else {
//         Alert.alert('Authentication Failed', 'try again');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred during biometric login.');
//       console.error(error);
//     }
//   };

//   const handleSupportType = async() =>{
//     const type = await LocalAuth.supportedAuthenticationTypesAsync();
//     console.log("Supported Types:", type)
//   }

//   const checkSecurityLevel = async () => {
//   const level = await LocalAuth.getEnrolledLevelAsync();
//   if (
//     level ===
//     LocalAuth.SecurityLevel.NONE
//   ) {
//     console.log(
//       "No enrolled authentication."
//     );

//   } else if (
//     level ===
//     LocalAuth.SecurityLevel.SECRET
//   ) {
//     console.log(
//       "Secret-based authentication enrolled."
//     );

//   } else if (
//     level ===
//     LocalAuth.SecurityLevel.BIOMETRIC_WEAK
//   ) {
//     console.log(
//       "Weak biometric authentication enrolled."
//     );

//   } else if (
//     level ===
//     LocalAuth.SecurityLevel.BIOMETRIC_STRONG
//   ) {
//     console.log(
//       "Strong biometric authentication enrolled."
//     );
//   }
// };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Local Authentication</Text>

//       <TextInput
//         placeholder="Enter Username..."
//         style={styles.input}
//         value={userName}
//         onChangeText={setUserName}
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Enter Password..."
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <Pressable style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </Pressable>

//       <Pressable style={[styles.button, styles.biometricButton]} onPress={handleBiometric}>
//         <Text style={styles.buttonText}>Biometric Login</Text>
//       </Pressable>

//       <Pressable style={[styles.button, styles.biometricButton]} onPress={handleSupportType}>
//         <Text style={styles.buttonText}>Supported Authentication Type</Text>
//       </Pressable>

//       <Pressable style={[styles.button, styles.biometricButton]} onPress={checkSecurityLevel}>
//         <Text style={styles.buttonText}>Check Security Level</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default LocalAuthentication;




import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import * as LocalAuth from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { router } from 'expo-router'

const LocalAuthentication = () => {

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (userName.trim() === 'Admin' && password.trim() === '123456') {
        await SecureStore.setItemAsync('token', 'this_is_token');
        await SecureStore.setItemAsync('biometric', 'true');

        Alert.alert('Success', 'Login Successful');
        router.replace('/home');
      } else {
        Alert.alert('Invalid Credentials', 'Please sign up or try again.');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again later.');
      console.error(error);
    }
  };

  const handleBiomatric = async () => {
    try {
      const hasHardware = LocalAuth.hasHardwareAsync();
      const isEnrolled = LocalAuth.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert("Not Available", 'Biometric authentication is not set up on this device.')
        return;
      }

      const token = await SecureStore.getItemAsync('token')
      const biometricEnabled = await SecureStore.getItemAsync('biometric')

      if (!token || biometricEnabled === 'false') {
        Alert.alert('Login Required', 'Please login with your username and password first.');
        return;
      }

      const result = await LocalAuth.authenticateAsync({
        promptMessage: "Login with Biomatric"
      })

      if(result.success){
        Alert.alert("Sucess", "Login Sucessfully!")
        router.replace('/home')
      }else{
        Alert.alert("Authentaction Faild", "try Again")
      }

    } catch (err) {
      Alert.alert("Error", err)
    }

  }

  const handleSupportType = async() => {
    const types = await LocalAuth.supportedAuthenticationTypesAsync();
    console.log("Supported Types:",types)
  }

  const checkSecurityLevel = async() => {
    const level = await LocalAuth.getEnrolledLevelAsync();
    console.log(level)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login Page</Text>
      <TextInput
        placeholder="Enter Username..."
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Enter Password..."
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleBiomatric}>
        <Text style={styles.buttonText}>Login with Biomatric</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleSupportType}>
        <Text style={styles.buttonText}>Check Supported Types</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={checkSecurityLevel}>
        <Text style={styles.buttonText}>Get Enrolled Level</Text>
      </Pressable>
    </View>
  )
}
export default LocalAuthentication;

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
  biometricButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
