import { StyleSheet, Image, ImageBackground, } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider, View, Stack, Box, Container, Heading, Divider, IconButton, Flex, HStack, Text, Icon, VStack, Center, StatusBar, Button, List, ListItem, Left, } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { style } from "dom-helpers";
import { Component } from "react";


export default class TabOneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
    }
    this.onPressButton = this.onPressButton.bind(this);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <NativeBaseProvider>
        <AppBar />
        <Divider />
        <ImageBackground  style={styles.image} source={require('../assets/images/bgblue.png')} resizeMode="cover" >
        <Image shadow={3} style={styles.topper} source={require('../assets/images/crewcoinwhite.png')} resizeMode="contain" />
        <View shadow={8} style={styles.creditcard} borderColor="black" >
            <Text style={styles.text}>David Williams</Text>
            <Text style={styles.text2}>Wenventure Inc.</Text>
            <Image style={styles.creditlogo} source={require('../assets/images/creditcardlogo.png')} />
            <View>
              <Image style={styles.credit} source={require('../assets/images/crewcoincredit.png')} />
            </View>
          </View>
        <Center style={{marginTop: 30}}>
        <Stack borderColor="#b2c2d1"
            borderWidth={1}
            style={{ borderRadius: 10, backgroundColor: 'rgba(255,255,255, 0.8)'}}
            px={2}
            py={2}
            mt={230}
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
              <Box>
              </Box>
              <HStack  px="4" space={2}>
                <Ionicons name="md-wallet" size={30} color="black" />
                <Heading color="black" size="lg" mx="auto" my="auto">
                  Transaction History
                </Heading>
              </HStack>
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
              <Box>
              </Box>
              <HStack  px="4" space={2}>
                <Ionicons name="md-arrow-redo-circle" size={30} color="black" />
                <Heading color="black" size="lg" mx="auto" my="auto">
                  Send Crew Coins
                </Heading>
              </HStack>
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
              <HStack space={2} px="4">
                <Ionicons name="settings" size={30} color="black" />
                <Heading color="black" size="lg" mx="auto" my="auto">
                  Account Settings
                </Heading>
              </HStack>
            </Box>
          </Stack>
          </Center>
          <Heading size="xl" color="black" mt={5}>Balance:</Heading>         
              <HStack shadow={3} style={styles.button}>
               <Image style={styles.coin2} source={require('../assets/images/coinIcon2.gif')} />
               <Text shadow={1} style={{color: "#ffcc00", fontSize: 48, fontWeight: "700", paddingTop: "32%", }}>20</Text>
              </HStack>

        </ImageBackground>
      </NativeBaseProvider>
    );
  }
  onPressButton() {
    this.props.navigation.navigate('Store');
  }
}
function AppBar() {
  return (
    <>
      <Box safeAreaTop backgroundColor="#d9d9d9" />

      <HStack bg='#f2f2f2' px="1" justifyContent='space-between' alignItems='center'>
        <HStack space="4" alignItems='center'>
          <Image style={styles.coin} source={require('../assets/images/crewcoinlogo.png')} />
        </HStack>
        <HStack space="4">
          <Text px="1" style={styles.icon}>
            David Williams
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
    marginTop: "25%",
    marginBottom: "1%",
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
    width: "32%",
    height: "15%",
    marginTop: "1%",
    resizeMode: 'contain',
    marginBottom: "2%",
  },
  creditcard: {
    position: 'relative',
    width: 350,
    resizeMode: 'contain',
    marginTop: -100,
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
  bg: {
    position: 'absolute',
    bottom: 0,
    zIndex: -5,
    width: '100%',
    height: '50%',
    opacity: 0.8,
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
    fontFamily: 'Roboto',
    zIndex: 1000,
  },
  text2: {
    position: 'absolute',
    color: 'blue',
    fontSize: 22,
    fontWeight: 'bold',
    top: 203,
    left: '10%',
    opacity: 0.8,
    fontFamily: 'Roboto',
    zIndex: 1000,

  },
  text3: {
    paddingTop: 30,
    color: 'black',
    fontSize: 50,
    fontWeight: 'bold',
    zIndex: 2,
    opacity: 0.8,
    fontFamily: 'Roboto',
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
    marginLeft: "13%",
    marginTop: "5%",
    marginRight: "-2%",
    paddingBottom: "15%",
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
    marginBottom: 170,
  },
  title: {
    width: 400,
    resizeMode: 'cover',
    marginTop: -100,
    marginBottom: -100,
    margin: -100,
  },
  header: {
    marginTop: '15%',
    marginLeft: '18%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
});