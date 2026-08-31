import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, Image, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const ClipboardApp = () => {
  const [text, setText] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [copiedImage, setCopiedImage] = useState(null);

  const handleCopyText = async () => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter some text first!");
      return;
    }
    await Clipboard.setStringAsync(text);
    Alert.alert("Success", "Text copied to clipboard!");
  };

  const handleGetCopiedText = async () => {
    const hasText = await Clipboard.hasStringAsync();
    if (hasText) {
      const res = await Clipboard.getStringAsync();
      if (res) {
        setCopiedText(res);
      }
    } else {
      Alert.alert("No Copied Text", "No Copied text available in clipboard!");
    }
  };

  const checkImage = async () => {
    const imageResult = await Clipboard.getImageAsync({ format: "png" });

    if (imageResult && imageResult.data) {
      setCopiedImage(imageResult.data);
      Alert.alert("Success", "Image found and loaded!");
      console.log(imageResult)
    } else {
      Alert.alert("No Image", "No image found in the clipboard.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Clipboard</Text>

      <TextInput 
        style={styles.input} 
        placeholder='Enter Text...' 
        placeholderTextColor="#888" 
        value={text} 
        onChangeText={setText} 
      />

      {copiedText ? <Text style={styles.header}>Stored text: {copiedText}</Text> : null}

      <View style={styles.buttonContainer}>
        <Button title='Copy Text' onPress={handleCopyText} />
        <Button title='Get Copied Text' onPress={handleGetCopiedText} />
        <Button title='Check Clipboard Image' onPress={checkImage} />
      </View>

      {copiedImage ? (
        <Image 
          source={{ uri: copiedImage }} 
          style={styles.imageStyle} 
        />
      ) : null}



    </View>
  );
};

export default ClipboardApp;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "black", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20 
  },
  header: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 20, 
    marginBottom: 20 
  },
  input: { 
    width: '80%', 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    color: 'white', 
    paddingHorizontal: 10, 
    marginBottom: 20, 
    borderRadius: 5 
  },
  buttonContainer: { 
    gap: 10, 
    width: '80%',
    marginBottom: 20
  },
  imageStyle: { 
    width: 400, 
    height: 400, 
    marginTop: 20,
    borderRadius: 10,
    resizeMode: 'contain'
  }
});
