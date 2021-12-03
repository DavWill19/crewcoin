import { StyleSheet } from "react-native";
import { Text, View, Image } from "../components/Themed";
import { Component } from "react";

export default class TabOneScreen extends Component {
  render() {
    return (
    <View style={styles.container}>
      {/* <Image source={require("../assets/images/crewcoinlogo.png")} style={styles.logo} /> */}
      <Text style={styles.title}>Welcome to CrewCoin</Text>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
