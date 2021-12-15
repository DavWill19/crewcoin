import { StyleSheet, ImageBackground, Image } from "react-native";
import { NativeBaseProvider, Center, Text, Box, Heading, Header, Divider, Stack, HStack, AspectRatio } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import posts from './sample2';

export default function TabTwoScreen() {
  return (
    <NativeBaseProvider>
      <AppBar />
      <ImageBackground imageStyle=
        {{ opacity: 0.5 }} style={styles.image} source={require('../assets/images/splashbg2.png')} resizeMode="repeat" >
      <ScrollView>
      <Divider />
        <Center>
          <Example />
        </Center>
      </ScrollView>
      </ImageBackground>
    </NativeBaseProvider>
  );
}

function AppBar() {
  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />
      <HStack borderColor="gray.300" borderWidth="1" bg='#e6e600' px="1" justifyContent='space-between' alignItems='center'>
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
function AppBarStore() {
  return (
    <>
      <Box safeAreaTop backgroundColor="darkBlue.200" />
      <HStack  bg='#e6e600' px="1" justifyContent='space-between' alignItems='center'>
        <HStack space="4">
          <Text style={styles.icon}>
            Store
          </Text>
        </HStack>
      </HStack>

    </>
  )
}

export const Example = () => {
  return (
    posts.map(posts => {
      return (
        <Box
        shadow={2}
        mt="2"
        mb="2"
          my="1"
          py="5"
          style={styles.image2}
          maxW="360"
          rounded="lg"
          overflow="hidden"
          borderColor="gray.100"
          borderWidth="1"
          _dark={{
            borderColor: "gray.900",
            backgroundColor: "gray.900",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <Box>
            <AspectRatio w="100%" ratio={52 / 9}>
              <Image
                source={require('../assets/images/icon3.gif')}
                alt="image"
              />
            </AspectRatio>
          </Box>
          <Stack w="300" p="4" space={3}>
            <Stack space={2}>
              <Heading size="md" ml="-1">
                {posts.title}
              </Heading>
            </Stack>
            <Text fontWeight="400" fontSize={18}>
              {posts.text}
            </Text>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontWeight="400"
                >
                  {`${posts.createdAt}`}
                </Text>
              </HStack>
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
  balance: {
    fontSize: 25,
    width: '100%',
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
    width: 450,
    resizeMode: 'cover',
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});