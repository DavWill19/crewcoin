import { StyleSheet, ImageBackground, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { NativeBaseProvider, Image, Button, Input, Center, Text, Box, Heading, Header, Divider, Stack, HStack, VStack, AspectRatio } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import posts from './sample2';
import { Component, useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { UserContext } from "./UserContext";
import moment from "moment";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { style, width } from "dom-helpers";



export default function TabTwoScreen() {
  const { value, setValue } = useContext(UserContext);
  const [postsData, setPosts] = useState([]);

  function Post() {
    const [postData, setPost] = useState({});
    const imageUrl = postData.imageUrl;
    const navigation = useNavigation();

  function handlePost(setPosts) {
    console.log("poop");
    fetch(`https://crewcoin.herokuapp.com/announcements`, {
      method: "POST",
      headers: {
        authorization: "jwt",
        credentials: "same-origin",
        Accept: "application/json",
        "Content-Type": "application/json",
        mode: "cors"
      },
      body: JSON.stringify({
        "title": postData.title,
        "description": postData.announcement,
        "image": postData.imageUrl,
        "portalId": value.portalId,
      }),
    })

      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setPosts(postsData => [...postsData, res.announcements])
          Alert.alert(
            "Success!",
            "Your post has been successfully posted",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
          setPost({ title: "", announcement: "", imageUrl: "" });
        } else {
          Alert.alert(
            "Something went wrong",
            `Error`,
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        }
      })
      .catch(err => {
        Alert.alert(
          `Error`,
          "Please check internet connection!",
          [

            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        )
      }
      );
  }

  let getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      if (!capturedImage.cancelled) {
        console.log(capturedImage);
        processImage(capturedImage.uri);
        MediaLibrary.createAssetAsync(capturedImage.uri);
      }
    }
  }
  let getImageFromGallery = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      const capturedImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      if (!capturedImage.cancelled) {
        processImage(capturedImage.uri);
      }
    }
  }
  let processImage = async (imgUri) => {
    const processedImage = await ImageManipulator.manipulateAsync(imgUri,
      [{ resize: { width: 400 } }],
      { format: ImageManipulator.SaveFormat.PNG }
    );
    setPost({ ...postData, imageUrl: processedImage.uri })
    console.log("processedImage", processedImage)
  }

  if (value.admin) {
    function TempImage() {
      if (imageUrl) {
        return (
          <Image alt="temp" shadow={9} style={{ width: 300, height: 300, borderRadius: 5 }}
            source={{ uri: imageUrl }} resizeMode="contain" />
        )
      } else {
        return null;
      }
    }

    return (

      <>
        <Box
          shadow={2}
          mt="2"
          mb="2"
          pt="2"
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
          <Stack w="100%" p="4" space={3}>
            <HStack alignItems="center">
              <Heading size="md" ml="-1" >
                New Announcement
              </Heading>
              <TouchableOpacity onPress={() => { getImageFromCamera() }}>
                <Image mt="4" style={styles.image3} source={require('../assets/images/camera1.png')} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { getImageFromGallery() }}>
                <Image mt="4" style={styles.image4} source={require('../assets/images/camera.png')} resizeMode="contain" />
              </TouchableOpacity>
            </HStack>
            <Center>
              <TempImage />
            </Center>
            <Input value={postData.title} onChangeText={(value) => setPost({ ...postData, title: value })} placeholder="Title" />
            <Input value={postData.announcement} onChangeText={(value) => setPost({ ...postData, announcement: value })} placeholder="Announcement" />
            {/* <Divider />
            <Image style={styles.image3} source={require('../assets/images/camera.png')} resizeMode="contain" />
            <Divider /> */}
            <Button onPress={() => { handlePost(setPosts) }}> Post </Button>
          </Stack>
        </Box>


      </>
    )
  } else {
    return null
  }
}


  const Posts = () => {
    const [postsData, setPosts] = useState([]);
    useEffect(() => {
      fetch(`https://crewcoin.herokuapp.com/announcements`, {
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
          if (res.success) {
            setPosts(res.announcements);
            console.log("another fetch")
          } else {
            Alert.alert(
              "Something went wrong",
              `Error`,
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
          }
        })
        .catch(err => {
          Alert.alert(
            `Error`,
            "Please check internet connection!",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          )
        }
        );
    }, []);
    
    let posts = postsData.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
    return (
      posts.map(posts => {
        function postImage(posts) {
          if (posts.image) {
            return (
              <Image
                shadow={9}
                style={{ width: 300, height: 300, borderRadius: 5 }}
                alt={ posts.createdAt }
                source={{ uri: posts.image }}
              />
            )
          } else {
            return null;
          }
        }
        return (
          <Box
            shadow={2}
            mt="2"
            mb="2"
            style={styles.image2}
            maxW="360"
            rounded="lg"
            overflow="hidden"
            borderColor="gray.300"
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
            <Box pt="4">
              {postImage(posts)}
            </Box>
            <Stack w="330" p="4" space={3}>
              <Stack>
                <Center>
                  <Heading size="md" ml="-1">
                    {posts.title}
                  </Heading>
                </Center>
              </Stack>
              <Divider />
              <Text fontWeight="400" fontSize={18}>
                {posts.description}
              </Text>
              <Divider />
              <HStack alignItems="center" space={4} justifyContent="space-between">
                <HStack alignItems="center">
  
                  <Image style={styles.coin2} alt="icon" source={require('../assets/images/icon3.gif')} />
                  <Text
                    color="yellow.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                    fontWeight="400"
                    bold="true"
                  >
                    {moment(posts.createdAt).format("MM/DD/YYYY h:mma")}
                  </Text>
                </HStack>
              </HStack>
            </Stack>
          </Box>
        )
      })
    )
  }


  return (
    <NativeBaseProvider>
      <AppBar />
      <ImageBackground imageStyle=
        {{ opacity: 0.5 }} style={styles.image} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
        <ScrollView>
          <Divider />
          <Center>
            <Post />
            <Posts />
          </Center>
        </ScrollView>
      </ImageBackground>
    </NativeBaseProvider>
  );
}

function AppBar() {
  const { value, setValue } = useContext(UserContext);
  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />
      <HStack borderColor="gray.300"
        borderWidth="1" bg='amber.300' px="1" justifyContent='space-between' alignItems='center'>
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
  coin2: {
    width: 300,
    resizeMode: 'contain',
    height: 50,
    marginLeft: "-45%",
    marginRight: "-36%",
    marginTop: "-1%",
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
  image3: {
    width: 45,
    resizeMode: 'contain',
    marginBottom: -85,
    marginTop: -90,
    marginLeft: 35,
  },
  image4: {
    width: 51,
    resizeMode: 'contain',
    marginBottom: -85,
    marginTop: -90,
    marginLeft: 10,
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