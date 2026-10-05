import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Paths} from "expo-file-system";

const file = () => {

  const handleFileSystem = async() => {
    console.log(Paths.document)
  }
  return (
    <View style={{
      flex:1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "teal"
    }}>
      <Text>file</Text>
      <Button onPress={handleFileSystem}/>
    </View>
  )
}

export default file

