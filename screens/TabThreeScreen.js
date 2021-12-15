import { StyleSheet, ImageBackground, Image, View } from "react-native";
import { NativeBaseProvider, Box, Container, Heading, Divider, AspectRatio, Stack, HStack, Text, Icon, VStack, Center, StatusBar, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from "react-native-gesture-handler";
import prizes from './sample';




export default function TabThreeScreen() {
  return (
    <NativeBaseProvider>
      <AppBar />
      <ImageBackground imageStyle=
        {{ opacity: 0.6 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
        <ScrollView>
          <Example prizes={prizes} />
        </ScrollView>
        </ImageBackground>
        <CardBalance />
    </NativeBaseProvider>
  );
}
function AppBar() {
  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />

      <HStack bg='#ffcc00' px="1" justifyContent='space-between' alignItems='center'>
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

function CardBalance() {
  return (
    <>
      <VStack borderWidth="1" borderColor="gray.300" space="4" bg='#ffcc00' px="2" justifyContent='space-between' alignItems='center'>
        <Center>
          <HStack >
            <Image style={styles.coinbalance} source={require('../assets/images/coinbalance.png')} />
            <Text style={styles.icon2}>20</Text>
          </HStack>
        </Center>
      </VStack>
    </>
  )
}

export const Example = () => {
  return (
    prizes.map(prize => {
      return (
        <Box
          shadow={9}
          mt="5"
          style={styles.image2}
          maxW="550"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <Box >
            <AspectRatio w="60%" ratio={7 / 7}>
              <Image
                source={{
                  uri: `${prize.img}`,
                }}
                alt="image"
              />
            </AspectRatio>
          </Box>
          <Stack space={3}>
            <Stack py="2" space={2}>
              <Heading size="md" ml="-1">
                {prize.name}
              </Heading>
            </Stack>
            <Text w="290" fontWeight="400">
              {prize.description}
            </Text>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">
                <Text
                  fontWeight="500"
                  color="amber.600"
                  _dark={{
                    color: "amber.600",
                  }}
                  fontWeight="600"
                >
                  {prize.price} Crew Coins
                </Text>
              </HStack>
              <Button>Buy Now!</Button>
            </HStack>
          </Stack>
        </Box>
      )
    })
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',


  },
  gif: {
    width: 80,
    height: 80,
    marginTop: -30,
    marginLeft: -30,
  },
  icon2: {
    color: 'black',
    fontSize: 42,
    fontWeight: '700',
    paddingTop: 23,
    marginTop: 6,
    opacity: 0.9,
    fontFamily: 'System',
  },
  coin: {
    width: 200,
    resizeMode: 'contain',
    height: 50,
  },
  coingif: {
    size: '100%',
  },
  coingif: {
    width: 10,
  },
  coinbalance: {
    zIndex: 2,
    resizeMode: 'contain',
    width: 210,
    marginTop: -90,
    marginBottom: -110,
  },

  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  image2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    marginBottom: 20,
    marginBottom: 5,
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
  BalanceBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coin2: {
    width: 80,
    height: 50,
  },
});