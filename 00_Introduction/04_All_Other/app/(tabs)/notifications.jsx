import { View, Text, Button, StyleSheet, Pressable, Alert } from 'react-native';
import * as Notification from 'expo-notifications';
import { useState } from 'react';

Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldplaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    })
})


const notificationPage = () => {
    const [resId, setResId] = useState(null);

    const handlePress = async () => {
        const permission = await Notification.requestPermissionsAsync();

        if (!permission.granted) {
            return;
        }

        const notifi = await Notification.scheduleNotificationAsync({
            content: {
                title: "PayPilot",
                body: "React Native Class",
            },
            trigger: {
                type: Notification.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 1,
                repeats: true,
            }
        })
        // const notifi1 = await Notification.scheduleNotificationAsync({
        //     content: {
        //         title: "PayPilot1",
        //         body: "React Native Class",
        //     },
        //     trigger: {
        //         type: Notification.SchedulableTriggerInputTypes.TIME_INTERVAL,
        //         seconds: 1,
        //         repeats: true,
        //     }
        // })

        console.log("ID:", notifi);
        if (notifi) {
            setResId(notifi);
        }

    }

    const handleStopNotification = async () => {
        // await Notification.cancelAllScheduledNotificationsAsync();
        if (resId) {
            await Notification.cancelScheduledNotificationAsync(resId);
            Alert.alert("Sucess", "Notification Stoped!")
            console.log("Stoped!!!");
            setResId(null);
        }else{
            Alert.alert("Error", "No Notification is Scheduled to Stop!!");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Notification Page</Text>
            <Pressable style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>Schedule Notifiction</Text>
            </Pressable>
            <Pressable style={styles.clearButton} onPress={handleStopNotification}>
                <Text style={styles.buttonText}>Stop Notification</Text>
            </Pressable>
        </View>
    )
}

export default notificationPage;


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
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
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
    counterText: {
        marginTop: 24,
        fontSize: 14,
        color: '#666666',
    }
});
