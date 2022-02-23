import { StyleSheet, View, Container, ScrollView, ImageBackground, TouchableOpacity, Alert, KeyboardAvoidingView, FlatList } from "react-native";
import { NativeBaseProvider, Image, Button, Input, Center, Text, Box, Heading, Header, Divider, Stack, HStack, VStack, AspectRatio } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import posts from './sample2';
import { Component, useContext, useEffect, useState, useMemo } from "react";
import { useIsFocused } from '@react-navigation/native';
import { UserContext } from "./UserContext";
import moment from "moment";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as SecureStore from 'expo-secure-store';




export default function TabTwoScreen() {
  const { value, setValue } = useContext(UserContext);
  const [postsData, setPosts] = useState([]);
  const [postData, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [userData, setUser] = useState([]);
  const [token2, setToken] = useState('');

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setToken(result);
    } else {
      console.log('No values stored under that key.');
    }
  }
  getValueFor('token');
  console.log(token2);

  const triggerPushNotificationHandler = (token, title, body) => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip,deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
      }),
    })
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
    if (value.newAnnouncement) {
      fetch(`https://crewcoin.herokuapp.com/crewuser/alert/${value._id}`, {
        method: "PUT",
        headers: {
          //bearer token
          authorization: `bearer ${token2}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "cors"
        },
        body: JSON.stringify({
          "newStoreItem": value.newStoreItem,
          "newTransaction": value.newTransaction,
          "newAnnouncement": false,
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
  }, []);


  function Spinner() {
    if (isLoading) {
      return (
        <Image alt="spinner" source={require('../assets/images/genericspinner.gif')}
          style={{ marginTop: "-34%", width: '35%', height: '20%', justifyContent: "center", alignItems: "center", zIndex: 20000000, top: "39%", resizeMode: "contain" }} />
      )
    } else {
      return null;
    }
  }


  function Post() {
    const imageUrl = postData.imageUrl;
    const [textData, setText] = useState([]);
    const [postsData, setPosts] = useState([]);

    function handlePost() {
      let removeAdmin = userData.filter(el => el.admin === false);
      let user = removeAdmin.filter(el => el.username !== value.username && el.pushToken.length > 0);
      let usersPushtoken = user.map(el => el.pushToken);  // get all pushtoken  of users  

      if (!textData.title || !textData.announcement) {
        Alert.alert("Please fill in all fields!");
      } else {
        if (postData.imageUrl) {
          const imageName = `${value.portalId}_post_${moment(new Date).format("MMDDYYYYhmma")}`
          const storage = getStorage();
          const uploadImage = async () => {
            const img = postData.imageUrl;
            const response = await fetch(postData.imageUrl);
            const blob = await response.blob();
            uploadBytes(ref(storage, `${imageName}`), blob);
          }
          setIsLoading(true);
          uploadImage();
          setTimeout(() => {
            getDownloadURL(ref(storage, `${imageName}`))
              .then((url) => {
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
                    "title": textData.title,
                    "description": textData.announcement,
                    "image": url,
                    "portalId": value.portalId,
                  }),
                })

                  .then(res => res.json())
                  .then(res => {
                    if (res.success) {
                      triggerPushNotificationHandler(usersPushtoken, `New Announcement: ${textData.title}`, textData.announcement);
                      setPosts(postsData => [...postsData, res.announcements])
                      setPost({ imageUrl: "" });
                      setText({ title: "", announcement: "" });
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
              })
              .catch((error) => {
                console.log(error);
                Alert.alert(
                  `Error`,
                  "Please check internet connection!",
                  [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                  ]
                )
                // Handle any errors
              })
            setIsLoading(false);
          }, 3000);
        } else {
          setTimeout(() => {
          setIsLoading(true);
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
              "title": textData.title,
              "description": textData.announcement,
              "portalId": value.portalId,
            }),
          })
            .then(res => res.json())
            .then(res => {
              if (res.success) {
                triggerPushNotificationHandler(usersPushtoken, `New Announcement: ${textData.title}`, textData.announcement);
                setPosts(postsData => [...postsData, res.announcements])
                setPost({ imageUrl: "" });
                setText({ title: "", announcement: "" });
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
            });
          setIsLoading(false);
        }, 1000);
        } 
      }

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
    }
    function TempImage() {
      if (imageUrl) {
        return (
          <Image alt="temp" shadow={9} style={{ width: 300, height: 300, borderRadius: 5, }}
            source={{ uri: imageUrl }} resizeMode="contain" />
        )
      } else {
        return null;
      }
    }
    const memoizedTempImage = useMemo(TempImage);

    if (value.admin) {
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
            <Stack w="100%" px="5" py="3" space={3}>
              <HStack alignItems="center">
                <Heading size="md" ml="-1" >
                  New Announcement
                </Heading>
                <TouchableOpacity onPress={() => { getImageFromCamera() }}>
                  <Image mt="4" alt="camera1" style={styles.image3} source={require('../assets/images/camera1.png')} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { getImageFromGallery() }}>
                  <Image mt="4" alt="camera2" style={styles.image4} source={require('../assets/images/camera.png')} resizeMode="contain" />
                </TouchableOpacity>
              </HStack>
              <Center>
                {memoizedTempImage}
              </Center>
              <Input value={textData.title} onChangeText={(value) => setText({ ...textData, title: value })} placeholder="Title" />
              <Input value={textData.announcement} onChangeText={(value) => setText({ ...textData, announcement: value })} placeholder="Announcement" />
              <Button shadow={3} onPress={() => { handlePost() }}> Post </Button>
            </Stack>
          </Box>
        </>
      )
    } else {
      return null
    }
  }


  function Posts() {
    const [postsData, setPosts] = useState([]);
    const [postData, setPost] = useState([]);

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

    }, [userData]);


    let posts = postsData.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    function deleteButton(posts) {
      if (value.admin) {
        return (
          <Button shadow={2} colorScheme="rose" mb="1" onPress={() => {
            Alert.alert(
              "Remove Post",
              "Are you sure you want to remove this post?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Yes", onPress: () => {
                    deletePost(posts)
                  }
                }
              ],
              { cancelable: false }
            );
          }}>Delete Post</Button>
        )
      } else {
        return null;
      }
    }

    function deletePost(posts) {

      const storage = getStorage();
      var postRef = ref(storage, posts.image);
      // Delete the file
      if (posts.image) {
        deleteObject(postRef).then(() => {
          // File deleted successfully
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });

        fetch(`https://crewcoin.herokuapp.com/announcements/delete/${posts._id}`, {
          method: "DELETE",
          headers: {
            authorization: "jwt",
            credentials: "same-origin",
            Accept: "application/json",
            "Content-Type": "application/json",
            mode: "cors"
          },
          body: JSON.stringify({
            "post": posts._id
          }),
        })

          .then(res => res.json())
          .then(res => {
            if (res.success) {
              setPosts(postsData => postsData.filter(post => post._id !== res.postId))
              setValue({ ...value, posts: res.posts })
              Alert.alert(
                "Post",
                `Removed`,
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
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
      } else {
        fetch(`https://crewcoin.herokuapp.com/announcements/delete/${posts._id}`, {
          method: "DELETE",
          headers: {
            authorization: "jwt",
            credentials: "same-origin",
            Accept: "application/json",
            "Content-Type": "application/json",
            mode: "cors"
          },
          body: JSON.stringify({
            "post": posts._id
          }),
        })

          .then(res => res.json())
          .then(res => {
            if (res.success) {
              setPosts(postsData => postsData.filter(post => post._id !== res.postId))
              setValue({ ...value, posts: res.posts })
              Alert.alert(
                "Post",
                `Removed`,
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
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
    }
    function showImage(item) {
      if (item.image) {
        return (
          <Image
            shadow={9}
            style={{ width: 300, height: 300, borderRadius: 5, resizeMode: 'contain' }}
            alt="image"
            source={{ uri: item.image }}
          />
        )
      } else {
        return null;
      }
    }
    return (
      <>

        <FlatList
          data={postsData}
          renderItem={({ item, index }) =>
            <Box
              pt="5"
              shadow={2}
              style={styles.image2}
              mb="2"
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
              <Box pt="0">
                {showImage(item)}
              </Box>
              <Stack w="330" p="1" space={3}>
                <Stack>
                  <Center>
                    <Heading size="lg">
                      {item.title}
                    </Heading>
                  </Center>
                </Stack>
                <Divider />
                <Text fontWeight="400" fontSize={17}>
                  {item.description}
                </Text>
                <Divider />
                <HStack alignItems="center" space={2} justifyContent="space-between">
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
                      {moment(item.updatedAt).format("MM/DD/YYYY h:mma")}
                    </Text>
                  </HStack>
                  {deleteButton(item)}
                </HStack>
              </Stack>
            </Box>
          }
          ListHeaderComponent={() => Post()}
          keyExtractor={item => item._id}
        />
      </>
    )

  }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
      <NativeBaseProvider>
        <AppBar />
        <ImageBackground imageStyle=
          {{ opacity: 0.5 }} alt="bg" style={styles.image} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
          {Spinner()}
          <View>
            <Posts />
          </View>
        </ImageBackground>
      </NativeBaseProvider>
    </KeyboardAvoidingView>
  );
}

function AppBar() {
  const { value, setValue } = useContext(UserContext);
  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />

      <HStack bg='amber.300' px="5" justifyContent='space-between' alignItems='center' borderColor="gray.300"
        borderWidth="1">
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
    marginLeft: -21,
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