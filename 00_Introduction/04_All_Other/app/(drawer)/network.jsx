import { StyleSheet, Button, Text, View, ActivityIndicator } from 'react-native';
import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const NetworkPage = () => {
  const state = Network.useNetworkState();
  const [airplane, setAirplane] = useState(false);
  const [ipAddress, setIpAddress] = useState('Not fetched yet');

  const plate = Platform?.OS;

  const checkNetwork = async () => {
    const res = await Network.getNetworkStateAsync();
    console.log('Network State:', res);
  };

  const getIpAddress = async () => {
    let res = await Network.getIpAddressAsync();
    console.log('Native IP:', res);

    if (res === '0.0.0.0') {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log('Public IP:', data.ip);
        res = data.ip;
      } catch (error) {
        console.error('Fallback IP fetch failed', error);
      }
    }
    setIpAddress(res);
  };

  const checkAirPlaneMode = async () => {
    const res = await Network.isAirplaneModeEnabledAsync();
    setAirplane(res); 
    console.log('Airplane Mode:', res);
  };

  const getAllNetworkDetails = async () => {
    await checkNetwork();
    await getIpAddress();
    await checkAirPlaneMode();
  };

  useEffect(()=>{
    const subscription = Network.addNetworkStateListener((state) => {
        console.log("Network changed:", state);
    });

    return () => {
        subscription.remove();
    }
  }, [])

  let message = 'Checking network...';
  if (state.isConnected === true && state.isInternetReachable === true) {
    message = 'You are online';
  } else if (state.isConnected === true) {
    message = 'Connected, but internet may be unavailable';
  } else {
    message = 'You are offline';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Page</Text>
      <Text style={styles.message}>{message}</Text>

      {state.type === 'WIFI' && <Text style={styles.infoText}>You are using Wi-Fi</Text>}
      {state.type === 'CELLULAR' && <Text style={styles.infoText}>You are using mobile data</Text>}

      <Text style={styles.detailText}>Type: {state.type ?? 'Unknown'}</Text>
      <Text style={styles.detailText}>Connected: {String(state.isConnected)}</Text>
      <Text style={styles.detailText}>Internet Reachable: {String(state.isInternetReachable)}</Text>
      <Text style={styles.detailText}>Airplane Mode: {String(airplane)}</Text>
      <Text style={styles.detailText}>IP Address: {ipAddress}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Get All Network Details" onPress={getAllNetworkDetails} color="#00796B" />
      </View>

      <Text>{plate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2F1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00695C',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#00796B',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#004D40',
    marginVertical: 2,
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default NetworkPage;