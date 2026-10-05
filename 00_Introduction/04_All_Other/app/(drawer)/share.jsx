// // Share of react native;

// import React from "react";
// import { View, Text, Pressable, StyleSheet, Share, Alert, } from "react-native";

// const ShareScreen = () => {
//     const shareContent = async () => {
//         try {
//             const result = await Share.share({
//                 message: `Check out this amazing React Native course: https://example.com/react-native-course`,
//                 title: "React Native Course",
//             });

//             if (result.action === Share.sharedAction) {
//                 console.log(
//                     "Content shared successfully"
//                 );
//                 if (result.activityType) {
//                     console.log(
//                         "Activity type:",
//                         result.activityType
//                     );
//                 }
//             }

//             if (result.action === Share.dismissedAction) {
//                 console.log(
//                     "Share dialog dismissed"
//                 );
//             }
//         } catch (error) {
//             Alert.alert("Error", error.message || "Unable to share content.");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>
//                 Share API Demo
//             </Text>
//             <Pressable
//                 style={styles.button}
//                 onPress={shareContent}
//             >
//                 <Text style={styles.buttonText}>
//                     Share Text & Link
//                 </Text>
//             </Pressable>

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         justifyContent: "center",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         textAlign: "center",
//         marginBottom: 40,
//     },
//     button: {
//         padding: 18,
//         borderRadius: 12,
//         alignItems: "center",
//         backgroundColor: "yellow"
//     },
//     buttonText: {
//         fontSize: 17,
//         fontWeight: "600",
//     },

// });

// export default ShareScreen;



import { View, Text, StyleSheet, Pressable, Share } from 'react-native'
import React from 'react'
import * as ImagePicketr from "expo-image-picker";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

const share = () => {
    const handleImagePicker = async () => {
        const res = await ImagePicketr.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
        });

        console.log(res)

        if (res.canceled) {
            return;
        }

        const available = await Sharing.isAvailableAsync();

        if(available){
            await Sharing.shareAsync(res.assets[0].uri)
            console.log("Shared!!!")
        }else{
            console.log("Error!!")
            return;
        }
    }

    const handleDocsPicker = async()=>{
        const res = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            copyToCacheDirectory: true,
        })

        console.log(res);

        if(res.canceled){
            return;
        }

        const file = res.assets[0];

        console.log("FILE:", file)
        console.log("FILE URI:", file.uri)

        await Sharing.shareAsync(
            file.uri,
            {
                mimeType:file.mimeType,
                dialogTitle: "Share File"
            }
        )
    }

    const handleShareText = async() => {
        const res = await Share.share({
            message:`Hello here is your URL: www.example.com`
        })

        console.log(res)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>share</Text>
            <Pressable style={styles.button} onPress={handleImagePicker}>
                <Text style={styles.buttonText}>Pick Image</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleDocsPicker}>
                <Text style={styles.buttonText}>Pick Docs</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleShareText}>
                <Text style={styles.buttonText}>Share Text</Text>
            </Pressable>
        </View>
    )
}

export default share

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 40,
    },
    button: {
        padding: 18,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "yellow"
    },
    buttonText: {
        fontSize: 17,
        fontWeight: "600",
    },

});