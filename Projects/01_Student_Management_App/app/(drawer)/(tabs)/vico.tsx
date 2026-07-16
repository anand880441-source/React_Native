import { View, Text } from "react-native"

function vico() {
  return (<>
    <View style={{ flex: 1, backgroundColor: "red", justifyContent: "center", alignContent: "center", alignItems: "center" }}>

      <Text style={{ color: "white", fontSize: 60}}>Welcome</Text>
      <Text style={{color:"blue", fontStyle:"italic", fontSize:50}}>VICO</Text>
    </View>
  </>
  )
}
export default vico;