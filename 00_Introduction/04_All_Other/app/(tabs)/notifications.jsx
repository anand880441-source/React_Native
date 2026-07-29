import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const NotificationScreen = () => {
  const [title, setTitle] = useState("");
  const [second, setSecond] = useState("");
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const notificationsRef = useRef(null);

  const loadNotificationsModule = async () => {
    if (!notificationsRef.current) {
      const Notifications = await import('expo-notifications');
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      notificationsRef.current = Notifications;
    }
    return notificationsRef.current;
  };

  const takePermission = async () => {
    const Notifications = await loadNotificationsModule();
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please enable notifications in your settings.");
    }
  };

  const scheduleNotification = async () => {
    if (!title.trim() || !second) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const Notifications = await loadNotificationsModule();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: title,
          data: { message: title },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Number(second),
        },
      });
      Alert.alert("Success", `Notification scheduled in ${second} seconds!`);
      setTitle("");
      setSecond("");
      loadNotifications();
    } catch (error) {
      Alert.alert("Error", "Failed to schedule notification.");
    }
  };

  const loadNotifications = async () => {
    const Notifications = await loadNotificationsModule();
    const data = await Notifications.getAllScheduledNotificationsAsync();
    setScheduledNotifications(data);
  };

  const clearAll = async () => {
    const Notifications = await loadNotificationsModule();
    await Notifications.cancelAllScheduledNotificationsAsync();
    setScheduledNotifications([]);
    Alert.alert("Cleared", "All scheduled notifications have been canceled.");
  };

  useEffect(() => {
    takePermission();
    loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>
      
      <TextInput 
        placeholder='Enter Title' 
        value={title} 
        onChangeText={setTitle} 
        style={styles.input} 
      />
      
      <TextInput 
        placeholder='Enter time in sec' 
        value={second} 
        onChangeText={setSecond} 
        keyboardType="numeric" 
        style={styles.input} 
      />
      
      <Pressable style={styles.button} onPress={scheduleNotification}>
        <Text style={styles.buttonText}>Schedule Notification</Text>
      </Pressable>
      
      <Pressable style={[styles.button, styles.clearButton]} onPress={clearAll}>
        <Text style={styles.buttonText}>Clear All</Text>
      </Pressable>

      <Text style={styles.counterText}>
        Scheduled Notifications: {scheduledNotifications.length}
      </Text>
    </View>
  );
};

export default NotificationScreen;

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
  clearButton: {
    backgroundColor: '#ff4d4d', 
    shadowColor: '#ff4d4d',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  counterText: {
    marginTop: 24,
    fontSize: 14,
    color: '#666666',
  }
});
