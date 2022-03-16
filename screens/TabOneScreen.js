import { StyleSheet, ImageBackground, RefreshControl } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider, Image, View, Stack, Box, Heading, Divider, Flex, HStack, Text, Center, PresenceTransition, } from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useCallback} from "react";
import { useState } from "react";
import { UserContext } from "./UserContext";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
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
  const [organization, setOrganization] = useState([]);
  const { value, setValue } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
 


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false),
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
          let self = res.filter(user => user.username === value.username);
          // setValue(self[0]);
          let admin = res.filter(user => user.admin === true);
          setValue({ ...value, balance: self[0].balance, adminEmail: admin[0].username, organization: admin[0].organization });
          setOrganization(admin[0].organization);
          console.log("fetched");
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
      )
    )
  })

  function checkAdminToken() {
    if (value.admin && !value.pushToken.length) {
      registerForPushNotificationsAsync = async () => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
          }
          const pushtoken = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(pushtoken);
          if (pushtoken) {
            fetch(`https://crewcoin.herokuapp.com/crewuser/adminpush/${value._id}`, {
              method: "PUT",
              headers: {
                //bearer token
                authorization: `jwt`,
                Accept: "application/json",
                "Content-Type": "application/json",
                mode: "cors"
              },
              body: JSON.stringify({
                "pushToken": pushtoken
              }),
            })

              .then(res => res.json())
              .then(res => {
                if (res.success) {
                  setValue(res.crewuser);
                } else {
                  Alert.alert(
                    `${err}`,
                    "Please check internet connection!",
                    [

                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                  )
                }
              })
              .catch(err => {
                Alert.alert(
                  "Error",
                  "Please login again",
                  [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                  ]
                )
                navigation.navigate("Login");
              });
          }
        } else {
          console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      };
      registerForPushNotificationsAsync();

    }
  }

  useEffect(() => {

    if (isFocused) {
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
          let self = res.filter(user => user.username === value.username);
          setValue(self[0]);
          let admin = res.filter(user => user.admin === true);
          setValue({ ...value, adminEmail: admin[0].username, organization: admin[0].organization });
          setOrganization(admin[0].organization);
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
    checkAdminToken();
    }
  }, [])
  //show alert for new transaction
  function alertNew(user) {
    if (user) {
      return (
        <Ionicons name="ellipse" color="#ffcc00" size={9} style={{ top: 1, right: 256, position: "absolute" }} />
      );
    } else {
      return null
    }
  }
  // delay for 1 second
  function Circulation(user) {
    const users = user
    let userTotal = users.reduce((accumulator, current) => accumulator + current.balance, 0)
    let circulationTotal = userTotal - value.balance
    if (value.admin && circulationTotal > -1) {
      return (
        <Center>
          <Text style={{
            position: "relative",
            fontSize: 17,
            fontWeight: 'bold',
            zIndex: 200000,
            backgroundColor: '#87CEFA',
            borderColor: "lightgray",
            borderWidth: 1,
            padding: 1,
            textAlign: 'center',
            padding: 5,
            width: '100%',
            bottom: 15,
          }}>Current Crew Coins in Circulation: {circulationTotal}</Text>
        </Center>
      )
    } else {
      return null
    }
  }
  function superUser(user, balance) {
    if (user.superUser) {
      return (
        <Ionicons name="infinite" color="#ffcc00" size={55} style={{ top: 1, right: 256, position: "absolute" }} />

      )
    } else {
      return balance
    }
  }
  return (
    <NativeBaseProvider>
      {AppBar(value)}
      <Divider />
      <ImageBackground style={styles.image} alt="bg" source={require('../assets/images/bgblue.png')} resizeMode="cover" >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Flex h={"100%"} mt={2} flexDirection="column" justifyContent="space-around">
            <Center>
              <Stack w={"100%"}>
                <Image alt="topper" style={styles.topper} source={require('../assets/images/crewcoinwhite.png')} resizeMode="contain" />
              </Stack>
            </Center>
            <PresenceTransition visible initial={{
              opacity: 0,
              scale: 0
            }} animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 450
              }
            }}>
              <Center >

                <Box shadow={5}
                  height={240}
                  width={365}
                  rounded="xl"
                  mt="-1"
                  pb={2}
                  _dark={{
                    borderColor: "lightBlue.500",
                    backgroundColor: "lightBlue.500",
                  }}
                  _light={{
                    backgroundColor: "transparent",
                  }}
                >
                  <Text shadow={7} style={styles.text}>{value.firstname + " " + value.lastname}</Text>
                  <Text shadow={7} style={styles.text2}>{organization}</Text>
                  <Image shadow={7} style={styles.creditlogo} alt="logo" source={require('../assets/images/creditcardlogo.png')} />
                  <View shadow="7">
                    <Image
                      mt={-1}
                      borderRadius={3}
                      style={styles.credit}
                      alt="creditcard"
                      source={require('../assets/images/crewcoincredit.png')}

                    />
                  </View>
                </Box>
              </Center>
            </PresenceTransition>
            <Center>

              <Stack borderColor="#b2c2d1"
                borderWidth={1}
                style={{ borderRadius: 10, backgroundColor: 'rgba(255,255,255, 0.8)' }}
                px={2}
                py={2}
                mt={1}

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
                  mt={3}
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
                        My Transactions
                      </Heading>
                      {alertNew(value.newStoreItem)}
                    </HStack>
                  </TouchableOpacity>
                </Box>
                <Box
                  shadow={3}
                  mt={3}
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
                        My Account
                      </Heading>
                    </HStack>
                  </TouchableOpacity>
                </Box>
              </Stack>
            </Center>
            <Center mb={5}>
              <Stack>
                <Center>
                  <Heading mt={1} size="lg" color="#282A3A" mt={2}>Balance:</Heading>
                </Center>
                <Center>
                  <HStack shadow={3} style={styles.button}>
                    <Image alt="gif" style={styles.coin2} source={require('../assets/images/coinIcon2.gif')} />
                    <Text shadow={1} style={{ color: "#ffcc00", fontSize: 48, fontWeight: "700", paddingTop: 33 }}>{superUser(value, value.balance)}</Text>
                  </HStack>
                </Center>
              </Stack>
            </Center>
            {Circulation(userData)}
          </Flex>


        </ScrollView>
      </ImageBackground>
    </NativeBaseProvider>
  );
}

function AppBar(value) {
  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />

      <HStack bg='#f2f2f2' px="5" justifyContent='space-between' alignItems='center'>
        <HStack space="4" alignItems='center'>
          <Image alt="logo" style={styles.coin} source={require('../assets/images/crewcoinlogo.png')} />
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

  topper: {
    width: 420,
    resizeMode: 'contain',
    position: 'relative',
    resizeMode: 'contain',
    marginBottom: "-15%",
    marginTop: "-15%",
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
    width: "65%",
    paddingRight: 11,
    paddingLeft: 11,
    paddingTop: 9,
    paddingBottom: 9,
    resizeMode: 'contain',
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "4%",
  },

  heading: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: '5%',
  },

  icon: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },

  creditlogo: {
    position: 'absolute',
    zIndex: 1999,
    resizeMode: 'contain',
    height: 160,
    top: 107,
    left: 195,
  },

  text: {
    position: 'absolute',
    color: 'black',
    fontSize: 21,
    fontWeight: 'bold',
    top: 165,
    left: '9%',
    opacity: 0.8,
    zIndex: 1000,
  },
  text2: {
    position: 'absolute',
    color: '#0709FE',
    fontSize: 21,
    fontWeight: 'bold',
    top: 187,
    left: '9%',
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
    position: 'relative',
    width: 365,
    height: 252,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  coin: {
    width: 200,
    resizeMode: 'contain',
    height: 50,
    marginLeft: -21,
  },
  coin2: {
    width: 35,
    height: 35,
    marginTop: "9%",
    resizeMode: 'contain',
    position: 'relative',
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
  },
});
