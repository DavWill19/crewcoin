import { StyleSheet, Image, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider, View, Stack, Box, Container, Heading, Divider, IconButton, Flex, HStack, Text, Icon, VStack, Center, StatusBar, Button, List, ListItem, Left, } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { style } from "dom-helpers";
import { Component, useContext, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native';
import { useState } from "react";
import { UserContext } from "./UserContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    }
  },
})


export default function TabOneScreen({ route, navigation }) {
  const [userData, setUser] = useState([]);
  const isFocused = useIsFocused();
  console.log(isFocused);



  useEffect(() => {

    // Permission for iOS
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then(statusObj => {
        // Check if we already have permission
        if (statusObj.status !== "granted") {
          // If permission is not there, ask for the same
          return Permissions.askAsync(Permissions.NOTIFICATIONS)
        }
        return statusObj
      })
      .then(statusObj => {
        // If permission is still not given throw error
        if (statusObj.status !== "granted") {
          throw new Error("Permission not granted")
        }
      })
      .catch(err => {
        return null
      })
    
    if (isFocused) {

      fetch(`https://crewcoin.herokuapp.com/crewuser/${value.portalId}`, {
        method: "GET",
        headers: {
          authorization: "jwt",
          credentials: "same-origin",
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "cors"
        },
      })
        .then(res => res.json())
        .then(res => {
          if (res) {
            setUser(res);
            console.log(userData)
            let self = res.filter(user => user.username === value.username);
            setValue(self[0]);
          } else {
            Alert.alert(
              "Error",
              "Please check your internet connection",
              [

                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            )
          }
        })
        .catch(err => {
          console.log(err);
        }
        );
    }
  }, []);


  function Circulation(user) {
    if (isFocused) {
    const users = user
    console.log(users)
    let userTotal = users.reduce((accumulator, current) => accumulator + current.balance, 0)
    let circulationTotal = userTotal - value.balance
    console.log(circulationTotal)
    if (value.admin) {
      return (
        <Text style={{

          fontSize: 17,
          fontWeight: 'bold',
          zIndex: 200000,
          backgroundColor: '#87CEFA',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderColor: "lightgray",
          borderWidth: 1,
          padding: 1,
          width: '100%',
          textAlign: 'center',
          marginTop: 6,
          marginBottom: 32,
          padding: 5,
        }}>Current Crew Coins in Circulation: {circulationTotal}</Text>
      )
    } else {
      return null
    }
  }
  }

    const { value, setValue } = useContext(UserContext);
    return (
      <NativeBaseProvider>
        {AppBar(value)}
        <Divider />
        <ImageBackground style={styles.image} source={require('../assets/images/bgblue.png')} resizeMode="cover" >
          <Stack>
            <Image shadow={3} style={styles.topper} source={require('../assets/images/crewcoinwhite.png')} resizeMode="contain" />
          </Stack>
          <Stack shadow={8}>
            <View shadow={8} style={styles.creditcard} borderColor="black" >
              <Text style={styles.text}>{value.firstname + " " + value.lastname}</Text>
              <Text style={styles.text2}>{value.organization}</Text>
              <Image style={styles.creditlogo} source={require('../assets/images/creditcardlogo.png')} />
              <View>
                <Image style={styles.credit} source={require('../assets/images/crewcoincredit.png')} />
              </View>
            </View>
          </Stack>
          <Center style={{ marginTop: 23 }}>
            <Stack borderColor="#b2c2d1"
              borderWidth={1}
              style={{ borderRadius: 10, backgroundColor: 'rgba(255,255,255, 0.8)' }}
              px={2}
              py={2}
              mt={235}
              mb={-3}
              borderRadius={5}
              shadow={9}
            >
              <Divider />

              <Box
                shadow={3}
                w="310"
                rounded="lg"
                borderColor="blueGray.400"
                borderWidth="1"
                _dark={{
                  borderColor: "lightBlue.500",
                  backgroundColor: "lightBlue.500",
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0,
                }}
                _light={{
                  backgroundColor: "lightBlue.500",
                }}
              >
                <Box >
                </Box>
                <TouchableOpacity onPress={() => { navigation.navigate('Send') }}>
                  <HStack px="4" space={2} >
                    <Ionicons name="md-arrow-redo-circle-outline" size={30} color="#292A2A" />
                    <Heading color="#292A2A" size="lg" mx="auto" my="auto">
                      Send Crew Coins
                    </Heading>
                  </HStack>
                </TouchableOpacity>
              </Box>
              <Box
                shadow={3}
                mt={5}
                w="310"
                rounded="lg"
                borderColor="blueGray.400"
                borderWidth="1"
                _dark={{
                  borderColor: "blueGray.600",
                  backgroundColor: "blueGray.700",
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0,
                }}
                _light={{
                  backgroundColor: "lightBlue.500",
                }}
              >
                <Box >
                </Box>
                <TouchableOpacity onPress={() => { navigation.navigate('History') }}>
                  <HStack px="4" space={2}>
                    <Ionicons name="md-list" size={30} color="#292A2A" />
                    <Heading color="#292A2A" size="lg" mx="auto" my="auto">
                      Transaction History
                    </Heading>
                  </HStack>
                </TouchableOpacity>
              </Box>
              <Box
                shadow={3}
                mt={5}
                w="310"
                rounded="lg"
                borderColor="blueGray.400"
                borderWidth="1"
                _dark={{
                  borderColor: "lightBlue.500",
                  backgroundColor: "lightBlue.500",
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0,
                }}
                _light={{
                  backgroundColor: "lightBlue.500",
                }}
              >
                <Box>
                </Box>
                <TouchableOpacity onPress={() => { navigation.navigate('Settings') }}>
                  <HStack space={2} px="4">
                    <Ionicons name="md-settings-outline" size={30} color="#292A2A" />
                    <Heading color="#292A2A" size="lg" mx="auto" my="auto">
                      Account Settings
                    </Heading>
                  </HStack>
                </TouchableOpacity>
              </Box>
            </Stack>
          </Center>

          <Heading size="xl" color="black" mt={5}>Balance:</Heading>
          <HStack shadow={3} style={styles.button}>
            <Image style={styles.coin2} source={require('../assets/images/coinIcon2.gif')} />
            <Text shadow={1} style={{ color: "#ffcc00", fontSize: 48, fontWeight: "700", paddingTop: "35%", }}>{value.balance}</Text>
          </HStack>
          {Circulation(userData)}



        </ImageBackground>
      </NativeBaseProvider>
    );
  }

  function AppBar(value) {
    return (
      <>
        <Box  safeAreaTop backgroundColor="#f2f2f2" />

        <HStack bg='#f2f2f2' px="1" justifyContent='space-between' alignItems='center'>
          <HStack space="4" alignItems='center'>
            <Image style={styles.coin} source={require('../assets/images/crewcoinlogo.png')} />
          </HStack>
          <HStack space="4">
            <Text px="1" style={styles.icon}>
              {value.firstname + " " + value.lastname}
            </Text>
          </HStack>
        </HStack>

      </>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    topper: {
      width: 370,
      resizeMode: 'contain',
      position: 'relative',
      marginTop: "-11%",
      marginBottom: "-25%",

    },
    button: {
      backgroundColor: '#ffcc00',
      borderColor: "#e6e6e6",
      borderWidth: 1,
      position: 'relative',
      backgroundColor: "white",
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
      borderBottomRightRadius: 40,
      borderBottomLeftRadius: 40,
      width: "36%",
      height: "12%",
      resizeMode: 'contain',
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: "1%",
    },
    creditcard: {
      position: 'relative',
      width: 350,
      resizeMode: 'contain',
      marginBottom: "2%",

    },

    heading: {
      color: 'black',
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: '5%',
    },
    gif: {
      width: 80,
      height: 80,
      marginTop: -30,
      marginLeft: -30,

    },
    icon: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
    elevate: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 5,
      borderRadius: 10,
      height: '90%',

    },
    creditlogo: {
      position: 'absolute',
      zIndex: 1999,
      resizeMode: 'contain',

      height: 150,
      top: 120,
      left: 190,

    },
    coinbalance: {
      zIndex: 2,
      resizeMode: 'contain',
      width: 210,
      marginTop: -90,
      marginBottom: -110,
    },

    text: {
      position: 'absolute',
      color: 'black',
      fontSize: 22,
      fontWeight: 'bold',
      top: 183,
      left: '10%',
      opacity: 0.8,

      zIndex: 1000,
    },
    text2: {
      position: 'absolute',
      color: '#0709FE',
      fontSize: 22,
      fontWeight: 'bold',
      top: 207,
      left: '10%',
      opacity: 0.8,
      zIndex: 1000,

    },
    text3: {
      paddingTop: 30,
      color: 'black',
      fontSize: 50,
      fontWeight: 'bold',
      zIndex: 2,
      opacity: 0.8,
    },
    icon2: {
      color: 'black',
      fontSize: 42,
      fontWeight: 'bold',
      paddingTop: 23,
      marginTop: 6,
      opacity: 0.9,
      fontFamily: 'System',
    },
    credit: {
      position: 'absolute',
      width: 350,
      resizeMode: 'contain',
      borderColor: "black",
      zIndex: 999,

    },

    balance: {
      fontSize: 25,
      width: '100%',
    },
    coin: {
      width: 200,
      resizeMode: 'contain',
      height: 50,
    },
    coin2: {
      width: "29%",
      height: "80%",
      resizeMode: 'contain',

      marginTop: "6%",
      marginRight: "-2%",
    },
    coingif: {
      size: '90%',
      resizeMode: 'contain',
    },
    coingif: {
      marginTop: -10,
      marginRight: -10,
      width: 70,
    },
    image: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: '100%',
      height: '100%',
    },
    header: {
      marginTop: '15%',
      marginLeft: '18%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: '#fff',
    },
  });