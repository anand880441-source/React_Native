// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, View, Pressable, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AsyncStorageComponent = () => {
//   const [name, setName] = useState('');
//   const [savedData, setSavedData] = useState([]);

//   const handleSave = async () => {
//     if (!name.trim()) {
//       Alert.alert('Error', 'Please enter a name first');
//       return;
//     }
//     try {
//       const updatedList = [...savedData, name.trim()];

//       await AsyncStorage.setItem('usernames', JSON.stringify(updatedList));
//       Alert.alert('Success', 'Form Submitted');

//       setSavedData(updatedList);
//       setName('');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleGetData = async () => {
//     try {
//       const value = await AsyncStorage.getItem('usernames');
//       if (value !== null) {
//         setSavedData(JSON.parse(value));
//       } else {
//         Alert.alert('Info', 'No data found in storage');
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleClear = () => {
//     setName('');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.innerContainer}>
//         <Text style={styles.title}>Form</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your name"
//           value={name}
//           onChangeText={setName}
//           placeholderTextColor="#999"
//         />
//         <Pressable style={styles.button} onPress={handleSave}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </Pressable>
//         <Pressable style={styles.button} onPress={handleClear}>
//           <Text style={styles.buttonText}>Clear Input</Text>
//         </Pressable>
//         <Pressable style={styles.button} onPress={handleGetData}>
//           <Text style={styles.buttonText}>Get Saved Data</Text>
//         </Pressable>

//         {savedData.length > 0 ? (
//           <View style={styles.listContainer}>
//             <Text style={styles.listTitle}>Saved Names:</Text>
//             {savedData.map((item, index) => (
//               <View key={index} style={styles.listItem}>
//                 <Text style={styles.bullet}>-</Text>
//                 <Text style={styles.resultText}>{item}</Text>
//               </View>
//             ))}
//           </View>
//         ) : null}
//       </View>
//     </View>
//   );
// };

// export default AsyncStorageComponent;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   innerContainer: {
//     gap: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '80%',
//     padding: 24,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0'
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333333',
//     marginBottom: 8
//   },
//   input: {
//     width: '100%',
//     height: 45,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#fff',
//     color: '#333'
//   },
//   button: {
//     width: '100%',
//     backgroundColor: '#939597',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   listContainer: {
//     width: '100%',
//     marginTop: 12,
//     alignItems: 'flex-start'
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 6
//   },
//   listItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4
//   },
//   bullet: {
//     fontSize: 18,
//     marginRight: 8,
//     color: '#333'
//   },
//   resultText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500'
//   }
// });


//2

// import React, { useState } from "react";
// import { Alert, Button, StyleSheet, Text, TextInput, View, } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const AsyncStorageExample = () => {
//     const [name, setName] = useState("");
//     const [savedData, setSavedData] = useState("");

//     const handleSaveData = async () => {
//         try {
//             await AsyncStorage.setItem("userName", name);
//             Alert.alert("Success", "Data saved successfully!");
//             setName(""); 
//         } catch (error) {
//             console.log("Error saving data:", error);
//         }
//     };

//     const handleGetData = async () => {
//         try {
//             const value = await AsyncStorage.getItem("userName");

//             if (value !== null) {
//                 setSavedData(value);
//                 Alert.alert("Saved Data", value);
//             } else {
//                 Alert.alert("No Data", "No data found!");
//             }
//         } catch (error) {
//             console.log("Error getting data:", error);
//         }
//     };

//     const handleClearData = async () => {
//         try {
//             await AsyncStorage.removeItem("userName");
//             setSavedData("");
//             setName("");
//             Alert.alert("Success", "Data cleared successfully!");
//         } catch (error) {
//             console.log("Error clearing data:", error);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.heading}>AsyncStorage Example</Text>

//             <TextInput
//                 style={styles.input}
//                 placeholder="Write something..."
//                 value={name}
//                 onChangeText={setName}
//             />

//             <View style={styles.button}>
//                 <Button title="Save Data" onPress={handleSaveData} />
//             </View>

//             <View style={styles.button}>
//                 <Button title="Get Data" onPress={handleGetData} />
//             </View>

//             <View style={styles.button}>
//                 <Button title="Clear Data" color="red" onPress={handleClearData} />
//             </View>

//             {savedData ? (
//                 <Text style={styles.savedText}>Saved Data: {savedData}</Text>
//             ) : null}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f5f5f5",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 20,
//     },
//     heading: {
//         fontSize: 22,
//         fontWeight: "bold",
//         marginBottom: 20,
//     },
//     input: {
//         width: "100%",
//         borderWidth: 1,
//         borderColor: "#333",
//         borderRadius: 5,
//         padding: 10,
//         marginBottom: 10,
//         backgroundColor: "#fff",
//     },
//     button: {
//         width: "100%",
//         marginVertical: 8,
//     },
//     savedText: {
//         marginTop: 20,
//         fontSize: 18,
//         color: "green",
//         fontWeight: "bold",
//     },
// });

// export default AsyncStorageExample;

//3

import React, { useState, useReducer } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  name: "",
  email: "",
  password: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "RESET_FORM":
      return { ...state, name: "", email: "", password: "" };
    default:
      return state;
  }
};

const AsyncStorageExample = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [savedData, setSavedData] = useState({});

  const handleSaveData = async () => {
    try {
      await AsyncStorage.setItem("userName", state.name);
      await AsyncStorage.setItem("userEmail", state.email);
      await AsyncStorage.setItem("userPassword", state.password);
      
      Alert.alert("Success", "Data saved successfully!");
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

//   const handleGetData = async () => {
//     try {
//       const name = await AsyncStorage.getItem("userName");
//       const email = await AsyncStorage.getItem("userEmail");
//       const password = await AsyncStorage.getItem("userPassword");

//       if (name || email || password) {
//         setSavedData({ name, email, password });
//       } else {
//         Alert.alert("No Data", "No data found!");
//       }
//     } catch (error) {
//       console.log("Error getting data:", error);
//     }
//   };

    const handleGetData = async () => {
        try{
            const name = await AsyncStorage.setItem("userName");
            const email = await AsyncStorage.setItem("userEmail");
            const password = await AsyncStorage.setItem("userPassword");

            if(name || email || password){
                setSavedData({name, email, password});
            }

        }catch(err){
            Alert.alert("Error : ", err);
        }
    }

  const handleClearData = async () => {
    try {
      await AsyncStorage.removeItem("userName");
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userPassword");
      
      setSavedData(null);
      dispatch({ type: "RESET_FORM" });
      Alert.alert("Success", "Data cleared");
    } catch (error) {
      console.log("Error clearing data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>AsyncStorage Demo</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={state.name}
        onChangeText={(text) => dispatch({ type: "SET_NAME", payload: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={state.email}
        onChangeText={(text) => dispatch({ type: "SET_EMAIL", payload: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={state.password}
        onChangeText={(text) => dispatch({ type: "SET_PASSWORD", payload: text })}
      />

      <View style={styles.button}>
        <Button title="Save Data" onPress={handleSaveData} />
      </View>
      <View style={styles.button}>
        <Button title="Get Data" onPress={handleGetData} />
      </View>
      <View style={styles.button}>
        <Button title="Clear Data" color="red" onPress={handleClearData} />
      </View>

      {savedData && (
        <View style={styles.savedContainer}>
          <Text style={styles.savedText}>Saved Details:</Text>
            <Text>Name : {savedData.name}</Text>
            <Text>Email : {savedData.email}</Text>
            <Text>Password : {savedData.password} </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    marginVertical: 8,
  },
  savedContainer: {
    marginTop: 20,
    width: "100%",
    padding: 15,
    backgroundColor: "#e8f5e9",
    borderRadius: 5,
  },
  savedText: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default AsyncStorageExample;
