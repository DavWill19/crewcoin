import { StyleSheet, View, ImageBackground, TouchableOpacity, Alert, KeyboardAvoidingView, FlatList, RefreshControl } from "react-native";
import { NativeBaseProvider, PresenceTransition, Image, Button, Input, Center, Text, Box, Heading, Header, Divider, Stack, HStack, VStack, AspectRatio, Spacer } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import posts from './sample2';
import { Component, useContext, useEffect, useState, useMemo, useCallback } from "react";
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
  const [postData, setPost] = useState([]);
  const [postsData, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUser] = useState([]);
  const [token2, setToken] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [disable, setDisable] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => setRefreshing(false),

      fetch(`https://crewcoin.herokuapp.com/announcements/${value.portalId}`, {
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
            if (res.announcements === postsData) {
              return null;
            } else {
              setPosts(res.announcements);
            }
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
    if (value.newAnnouncement) {
      fetch(`https://crewcoin.herokuapp.com/crewuser/alert/${value._id}`, {
        method: "PUT",
        headers: {
          //bearer token
          authorization: `bearer ${token}`,
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
  })

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setToken(result);
    } else {
      console.log('No values stored under that key.');
    }
  }
  getValueFor('token');


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
          if (self[0] === !value) {
            setValue(self[0]);
          }
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

  function Post() {
    const [postData, setPost] = useState([]);
    const imageUrl = postData.imageUrl;
    const [textData, setText] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    console.log("post rendered")

    function Spinner() {
      if (isLoading) {
        return (
          <Image alt="spinner" source={require('../assets/images/genericspinner.gif')}
            style={{ width: "30%", position: "absolute", right: "35%", zIndex: 9000000000, top: "10%", resizeMode: "contain" }} />
        )
      } else {
        return null;
      }
    }

    function handlePost() {
      let user = userData.filter(el => el.username !== value.username && el.pushToken.length > 0);
      let usersPushtoken = user.map(el => el.pushToken);  // get all pushtoken  of users  

      if (!textData.title || !textData.announcement) {
        Alert.alert("Please fill in all fields!");
      } else {
        setIsLoading(true);
        if (postData.imageUrl) {
          const imageName = `${value.portalId}_post_${moment(new Date).format("MMDDYYYYhmmssa")}`
          const storage = getStorage();
          const uploadImage = async () => {
            const img = postData.imageUrl;
            const response = await fetch(postData.imageUrl);
            const blob = await response.blob();
            uploadBytes(ref(storage, `${imageName}`), blob);
          }
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
            setDisable(false);
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
            setDisable(false);
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
        if (!capturedImage.canceled) {
          processImage(capturedImage.assets[0].uri);
          MediaLibrary.createAssetAsync(capturedImage.assets[0].uri);
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
        if (!capturedImage.canceled) {
          processImage(capturedImage.assets[0].uri);
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
          <View>
            <TouchableOpacity style={{ zIndex: 999, marginTop: 6, marginBottom: -31, }}
              onPress={() => { setPost({ ...postData, imageUrl: "", image: "" }) }}
            >
              <Text shadow={9} style={{ color: "white", fontSize: 24, marginLeft: 270, zIndex: 999, border: 1, borderRadius: 5 }}>
                <Ionicons name="md-close-circle" size={20} color="white" />
              </Text>
            </TouchableOpacity>
            <Image alt="temp" shadow={9} style={{ width: 300, height: 300, borderRadius: 5 }}
              source={{ uri: imageUrl }} resizeMode="contain" />
          </View>
          // <Image alt="temp" shadow={9} style={{ width: 300, height: 300, borderRadius: 5, }}
          //   source={{ uri: imageUrl }} resizeMode="contain" />
        )
      } else {
        return null;
      }
    }
    const memoizedTempImage = useMemo(TempImage);

    if (value.admin) {
      return (
        <>
          {Spinner()}
          {/* <PresenceTransition visible initial={{
            opacity: 0
          }} animate={{
            opacity: 1,
            transition: {
              duration: 2500
            }
          }}> */}
          <Box
            shadow={2}
            mt="1"
            mb="1"
            pt="2"
            style={styles.image2}
            mx="auto"
            maxW="98%"
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
              <HStack space={4}>
                <Heading size="md" ml="-1" >
                  New Announcement
                </Heading>
                <Spacer />
                <Center>
                  <TouchableOpacity onPress={() => { getImageFromCamera() }}>
                    <Image mt="4" alt="camera1" style={styles.image3} source={require('../assets/images/camera1.png')} resizeMode="contain" />
                  </TouchableOpacity>
                </Center>
                <Center>
                  <TouchableOpacity onPress={() => { getImageFromGallery() }}>
                    <Image mt="4" alt="camera2" style={styles.image4} source={require('../assets/images/camera.png')} resizeMode="contain" />
                  </TouchableOpacity>
                </Center>
              </HStack>
              <Center>
                {memoizedTempImage}
              </Center>
              <Input value={textData.title} onChangeText={(value) => setText({ ...textData, title: value })} placeholder="Title" />
              <Input multiline={true} value={textData.announcement} onChangeText={(value) => setText({ ...textData, announcement: value })} placeholder="Announcement" />
              <Button disabled={disable} backgroundColor="cyan.500" shadow={3} onPress={() => { setDisable(true); handlePost() }}> Post </Button>
            </Stack>
          </Box>
          {/* </PresenceTransition> */}
        </>

      )
    } else {
      return null
    }
  }

  const Posts = () => {
    const [postsData, setPosts] = useState([]);
    const [postData, setPost] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    console.log("posts rendered")
    const [extra, setExtra] = useState(0);

    useEffect(() => {
      setIsLoading(true);
      fetch(`https://crewcoin.herokuapp.com/announcements/${value.portalId}`, {
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
          console.log('it ran')
          if (res.success) {
            if (res.announcements === postsData) {
              return null;
            } else {
              setPosts(res.announcements);
            }
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
      setIsLoading(false);

    }, []);
    let posts = postsData.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    function deleteButton(posts) {
      if (value.admin) {
        return (
          <Button py="2" px="2" shadow={2} colorScheme="r" onPress={() => {
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
          }}>
            <Ionicons name="ios-remove-circle-outline" size={15} color="white" >
              <Text color="white"> Remove Post</Text>
            </Ionicons>
          </Button>
        )
      } else {
        return null;
      }
    }
    function views(item) {
      if (item.views) {
        return (
          <Text shadow={2} style={styles.text4}> {item.views.length} Views</Text>
        )
      } else {
        return (
          <Text shadow={2} style={styles.text4}> 0 Views</Text>
        )
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
    function sendViews(item) {
      if (item.views && !item.views.includes(value)) {
        fetch(`https://crewcoin.herokuapp.com/announcements/views`, {
          method: "PUT",
          headers: {
            authorization: "jwt",
            Accept: "application/json",
            "Content-Type": "application/json",
            mode: "cors"
          },
          body: JSON.stringify({
            "prizeId": item._id,
            "userId": `${value.firstname} ${value.lastname}`,

          }),
        })

          .then(res => res.json())
          .then(res => {
            if (res.success) {
              console.log("success- updated views")
            } else {
              console.log("error")
            }
          })
          .catch(err => {
            console.log(err)
          });
      }
    }
    function likeItem(item, index) {
      // if (item.likes && !item.likes.includes(value)) {
      if (item.likes && !item.likes.includes(value.firstname + " " + value.lastname)) {
        setPosts(postsData => {
          postsData[index].likes.push(value.firstname + " " + value.lastname)
          return postsData
        })
      } else if (!item.likes) {
        setPosts(postsData => {
          postsData[index].likes = [value.firstname + " " + value.lastname]
          return postsData
        })
      }
      setPosts(postsData)
      setExtra(extra + 1)
      console.log(postsData[index].likes)
      fetch(`https://crewcoin.herokuapp.com/announcements/likes`, {
        method: "PUT",
        headers: {
          authorization: "jwt",
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "cors"
        },
        body: JSON.stringify({
          "prizeId": item._id,
          "user": `${value.firstname} ${value.lastname}`,

        }),
      })

        .then(res => res.json())
        .then(res => {
          if (res.success) {
            console.log("success- updated likes")
          } else {
            console.log("error")
          }
        })
        .catch(err => {
          console.log(err)
        });
    }
    function unLikeItem(item, index) {
      if (item.likes && item.likes.includes(value.firstname + " " + value.lastname)) {
        setPosts(postsData => {
          // remove the item from the array
          postsData[index].likes.splice(postsData[index].likes.indexOf(value.firstname + " " + value.lastname), 1)
          return postsData
        })
      } else if (!item.likes) {
        setPosts(postsData => {
          postsData[index].likes = []
          return postsData
        })
      }
      setPosts(postsData)
      setExtra(extra + 1)
      console.log(postsData[index].likes)
      fetch(`https://crewcoin.herokuapp.com/announcements/unlikes`, {
        method: "PUT",
        headers: {
          authorization: "jwt",
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "cors"
        },
        body: JSON.stringify({
          "prizeId": item._id,
          "user": `${value.firstname} ${value.lastname}`,

        }),
      })

        .then(res => res.json())
        .then(res => {
          if (res.success) {
            console.log("success- updated likes")
          } else {
            console.log("error")
          }
        })
        .catch(err => {
          console.log(err)
        });
    }


    function showImage(item) {
      if (item.image) {
        return (
          <Image
            shadow={9}
            style={{ width: 350, height: 350, padding: 5, borderRadius: 5, resizeMode: 'contain' }}
            alt="image"
            source={{ uri: item.image }}
          />
        )
      } else {
        return null;
      }
    }
    function showViewers(item) {
      if (item.views) {
        // list viewers
        let viewers = item.views.map((viewer, index) => {
          return (" " + viewer)
        })
        console.log(item.views)
        Alert.alert(
          "👀",
          `${viewers}`,
        );
      } else {
        return (
          null
        )
      }
    }
    function showLikers(item) {
      if (item.likes) {
        // list viewers
        let likers = item.likes.map((liker, index) => {
          return (" " + liker)
        })
        console.log(item.likes)
        Alert.alert(
          "❤️",
          `${likers} `,
        );
      } else {
        return (
          null
        )
      }
    }
    function likeButton(item, index) {
      if (item.likes && item.likes.includes(value.firstname + " " + value.lastname)) {
        return (
          <TouchableOpacity onPress={() => { unLikeItem(item, index) }} >
            <Ionicons mt={1} name="heart" size={28} color="#DC243C" />
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity onPress={() => { likeItem(item, index) }} >
            <Ionicons mt="2" name="heart-outline" size={28} color="#605D5D" />
          </TouchableOpacity>
        )
      }
    }
    function showLikes(item) {
      if (item.likes && item.likes.length > 0) {
        return (
          <Text>{item.likes.length}         </Text>
        )
      }
      else {
        return null;
      }
    }
    return (
      <>
        <FlatList
          extraData={postsData}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={postsData}
          renderItem={({ item, index, postsData }) =>
            <Box
              pt="5"
              shadow={2}
              style={styles.image2}
              mb="2"
              mx="auto"
              maxW="98%"
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
              <Stack>
                <Center>
                  <Heading size="lg">
                    {item.title}
                  </Heading>
                </Center>
              </Stack>
              <Box pt="2">
                {showImage(item)}
                {sendViews(item)}
              </Box>
              <Stack w="330" p="1" space={3}>
                {/* <Stack>
                    <Heading size="lg">
                      {item.title}
                    </Heading>
                </Stack> */}
                <Divider />
                <Text fontWeight="400" fontSize={17}>
                  {item.description}
                </Text>
                <Divider />
                <HStack alignItems="center" space={2} justifyContent="space-between">
                  <HStack alignItems="center">
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
                <Divider />
              </Stack>
              <HStack mb={2} width={"315"}>
                {likeButton(item, index)}
                <TouchableOpacity style={{ marginRight: "auto" }} onPress={() => { showLikers(item) }} >
                  <Text mb={0} fontSize={13} color="#6E6C6C" mt="1" ml="1">{showLikes(item)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { showViewers(item) }} >
                  {/* <Ionicons pt="3" name="eye-outline" size={20} color="#6E6C6C" /> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { showViewers(item) }} >
                  <Text fontSize={13} mt="1" color="#6E6C6C" ml="1">{views(item)}</Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          }
          ListHeaderComponent={() => Post()}
          keyExtractor={item => item._id}
        />
      </>
    )

  }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled p>
      <NativeBaseProvider>
        <AppBar />
        <ImageBackground imageStyle=
          {{ opacity: 0.7 }} style={styles.image} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
          <View>
            {/* <PresenceTransition visible initial={{
              opacity: 0
            }} animate={{
              opacity: 1,
              transition: {
                duration: 1050
              }
            }}> */}
            <Posts />
            {/* </PresenceTransition> */}
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
    resizeMode: 'contain',
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
  },
  image4: {
    width: 51,
    resizeMode: 'contain',
    marginBottom: -85,
    marginTop: -90,
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