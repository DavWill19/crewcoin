import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Alert, KeyboardAvoidingView, RefreshControl } from "react-native";
import { NativeBaseProvider, PresenceTransition, Box, Input, Heading, Divider, Stack, HStack, Text, VStack, Center, Button, Modal, FormControl } from 'native-base';
import { ScrollView } from "react-native-gesture-handler";
import prizes from './sample';
import { useContext, useEffect, useMemo, useCallback, useState } from "react";
import { UserContext } from "./UserContext";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import firebaseConfig from "../firebaseConfig.tsx";
import { initializeApp } from "firebase/app";
import { useIsFocused } from '@react-navigation/native';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import moment from "moment";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


initializeApp(firebaseConfig);

export default function TabThreeScreen() {
  const { value, setValue } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUser] = useState([]);
  const [adminPushToken, setAdmin] = useState([]);
  const [token, setToken] = useState('');
  const navigation = useNavigation();
  const [balanceData, setBalance] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postData, setPost] = useState({});
  const [prizeData, setPrize] = useState({});
  const [kbOffset, setKbOffset] = useState(0);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  function postImageThumb(prizes) {
    if (prizes.image) {
      return (
        <Image
          borderColor="gray.200"
          shadow={9}
          width={300}
          alt={prizes.createdAt}
          source={{ uri: prizes.image }}
          style={{ width: 200, height: 200, borderRadius: 5, resizeMode: 'contain' }}
        />
      )
    } else {
      return null;
    }
  }
  function updatePrize(prizeData) {



    fetch(`https://crewcoin.herokuapp.com/store/${prizeData._id}`, {
      method: "Put",
      headers: {
        authorization: `bearer ${token}`,
        credentials: "same-origin",
        Accept: "application/json",
        "Content-Type": "application/json",
        mode: "cors"
      },
      body: JSON.stringify({
        "title": prizeData.title,
        "description": prizeData.description,
        "cost": prizeData.cost,
      }),
    })

      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setPrizes(res.prizes);
        } else {
          console.log("Something went wrong")
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
        console.log(err)
      }
      );

  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => setRefreshing(false),
      fetch(`https://crewcoin.herokuapp.com/store/${value.portalId}`, {
        method: "GET",
        headers: {
          authorization: `bearer ${token}`,
          credentials: "same-origin",
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "cors"
        },
      })

        .then(res => res.json())
        .then(res => {
          if (res.success) {
            if (res.prizes.length === prizesData.length) {
              return null;
            } else {
              setPrizes(res.prizes);
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
          console.log(err);
        }
        )

    )
    if (value.newStoreItem) {
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
          "newStoreItem": false,
          "newTransaction": value.newTransaction,
          "newAnnouncement": value.newAnnouncement,
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
    setIsLoading(true);
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

    //fetch user data
    fetch(`https://crewcoin.herokuapp.com/crewuser/${value.portalId}`, {
      method: "GET",
      headers: {
        authorization: `bearer ${token}`,
        credentials: "same-origin",
        Accept: "application/json",
        "Content-Type": "application/json",
        mode: "cors"
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res) {
          if (res !== userData) {
            setUser(res);
            let self = res.filter(user => user.username === value.username);
            setValue(self[0]);
            const admin = res.filter(user => user.admin === true)
            const adminPush = admin.map(el => el.pushToken)
            setAdmin(adminPush);
            console.log("adminpush", adminPush);
          }
          setIsLoading(false);
        } else {
          Alert.alert(
            "Error",
            "Please check your internet connection",
            [

              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          )
          setIsLoading(false);
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
      }
      );

    // update alerts
    if (value.newStoreItem) {
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
          "newStoreItem": false,
          "newTransaction": value.newTransaction,
          "newAnnouncement": value.newAnnouncement,
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
          style={{ marginTop: "-28%", width: '30%', height: '20%', justifyContent: "center", alignItems: "center", zIndex: 20000000, top: "48%", resizeMode: "contain" }} />
      )
    } else {
      return null;
    }
  }

  function Example() {
    const imageUrl = postData.imageUrl;

    function handlePost(setPrizes) {
      let user = userData.filter(el => el.username !== value.username && el.pushToken.length > 0);
      let usersPushtoken = user.map(el => el.pushToken);

      function coin(cost) {
        if (cost > 1) {
          return (
            `${cost} Crew Coins`
          )
        } else {
          return (
            `${cost} Crew Coin`
          )
        }
      }

      if (!postData.title || !postData.description || !postData.imageUrl || !postData.cost || Number.isInteger(parseInt(postData.cost)) === false) {
        Alert.alert("Please fill in all fields and add photo! Cost must be a number!");
      } else {
        setIsLoading(true);
        const imageName = `${value.portalId}_prize_${moment(new Date).format("MMDDYYYYhmmssa")}`
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
              fetch(`https://crewcoin.herokuapp.com/store`, {
                method: "POST",
                headers: {
                  authorization: `bearer ${token}`,
                  credentials: "same-origin",
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  mode: "cors"
                },
                body: JSON.stringify({
                  "title": postData.title,
                  "description": postData.description,
                  "image": url,
                  "portalId": value.portalId,
                  "cost": postData.cost,
                }),
              })

                .then(res => res.json())
                .then(res => {
                  if (res.success) {
                    triggerPushNotificationHandler(usersPushtoken, `New Store Item!`, `${postData.title} Cost: ${coin(postData.cost)}`);
                    setPrizes(prizesData => [...prizesData, res.store])
                    Alert.alert(
                      "Success!",
                      `${res.store.title} has been posted!`,
                      [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                      ]
                    );
                    setPost({ title: "", description: "", imageUrl: "", cost: "" });
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
            })
            .catch((error) => {
              Alert.alert(
                "Error",
                "Please login again",
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              )
              navigation.navigate("Login");
            })
        }, 3000);
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
      setPost({ ...postData, imageUrl: processedImage.uri, image: processedImage });
    }

    if (value.admin) {
      function TempImage() {
        if (imageUrl) {
          return (
            <View>
              <TouchableOpacity style={{ zIndex: 999, marginTop: 6, marginBottom: -31, }}
                onPress={() => { setPost({ ...postData, imageUrl: "", image: "" }) }}
              >
                <Text shadow={9} style={{ color: "white", fontSize: 24, marginLeft: 270, zIndex: 999, border: 1, borderRadius: "10%" }}>
                  <Ionicons name="md-close-circle" size={20} color="white" />
                </Text>
              </TouchableOpacity>
              <Image alt="temp" shadow={9} style={{ width: 300, height: 300, borderRadius: 5 }}
                source={{ uri: imageUrl }} resizeMode="contain" />
            </View>
          )
        } else {
          return null;
        }
      }
      const memoizedTempImage = useMemo(TempImage);


      return (

        <>
          <PresenceTransition visible initial={{
            opacity: 0
          }} animate={{
            opacity: 1,
            transition: {
              duration: 2500
            }
          }}>
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
                borderWidth: 1,
              }}
              _light={{
                backgroundColor: "gray.50",
              }}
            >
              <Stack w="100%" p="4" space={3}>
                <HStack alignItems="center">
                  <Heading size="md" ml="-1" >
                    Add New Store Item
                  </Heading>
                  <TouchableOpacity onPress={() => { getImageFromCamera() }}>
                    <Image mt="4" style={styles.image3} source={require('../assets/images/camera1.png')} resizeMode="contain" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { getImageFromGallery() }}>
                    <Image mt="4" style={styles.image4} source={require('../assets/images/camera.png')} resizeMode="contain" />
                  </TouchableOpacity>
                </HStack>
                <Center>
                  {memoizedTempImage}
                </Center>
                <Input value={postData.title} onChangeText={(value) => setPost({ ...postData, title: value })} placeholder="Title" />
                <Input value={postData.description} onChangeText={(value) => setPost({ ...postData, description: value })} placeholder="Description" />
                <Input value={postData.cost} onChangeText={(value) => setPost({ ...postData, cost: value.replace(/[^0-9]/g, '') })} placeholder="Price" />

                <Button backgroundColor="cyan.500" shadow={3} onPress={() => { handlePost(setPrizes) }}>
                  Post New Item
                </Button>
              </Stack>
            </Box>
          </PresenceTransition>
        </>
      )
    } else {
      return null
    }
  }

  const Prizes = () => {
    const { value, setValue } = useContext(UserContext);
    const [prizesData, setPrizes] = useState([]);
    useEffect(() => {
      fetch(`https://crewcoin.herokuapp.com/store/${value.portalId}`, {
        method: "GET",
        headers: {
          authorization: `bearer ${token}`,
          credentials: "same-origin",
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "cors"
        },
      })

        .then(res => res.json())
        .then(res => {
          if (res.success) {
            if (res.prizes.length === prizesData.length) {
              return null;
            } else {
              setPrizes(res.prizes);
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
          console.log(err);
          Alert.alert(
            `Error`,
            "Please check internet connection! You may need to login again",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          )
        }
        );
    }, []);

    let prizes = prizesData.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.createdAt) - new Date(a.createdAt);
    });


    function postImage(prizes) {
      if (prizes.image) {
        return (
          <Image
            borderColor="gray.200"
            shadow={9}
            width={300}
            alt={prizes.createdAt}
            source={{ uri: prizes.image }}
            style={{ width: 300, height: 300, borderRadius: 5, resizeMode: 'contain' }}
          />
        )
      } else {
        return null;
      }
    }


    function editIcon(prize, setShowModal, setPrize) {
      if (value.admin) {
        return (
          <View>
            <Button onPress={() => { setPrize(prize); setShowModal(true) }} backgroundColor="cyan.500" mb="2">
              <Ionicons name="md-create-outline" size={15} color="white" >
                <Text color="white"> Edit Item</Text>
              </Ionicons>
            </Button>
          </View>
        )
      } else {
        return null;
      }
    }

    function deleteButton(prize) {
      if (value.admin) {
        return (
          <Button colorScheme="rose" mb="2" width="90%" onPress={() => {
            Alert.alert(
              "Remove Prize",
              "Are you sure you want to remove this prize?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "OK", onPress: () => {
                    deletePrize(prize)
                  }
                }
              ],
              { cancelable: false }
            );
          }}>
            <Ionicons name="ios-remove-circle-outline" size={15} color="white" >
              <Text color="white"> Remove Item</Text>
            </Ionicons>
          </Button>
        )
      } else {
        return null;
      }
    }
    function buyButton(prize) {
      const amount = value.balance - prize.cost;

      function purchasePrize(prize) {
        if (value.balance >= prize.cost) {
          setIsLoading(true);

          fetch(`https://crewcoin.herokuapp.com/crewuser/${value._id}`, {
            method: "PUT",
            headers: {
              authorization: `bearer ${token}`,
              credentials: "same-origin",
              Accept: "application/json",
              "Content-Type": "application/json",
              mode: "cors"
            },
            body: JSON.stringify({
              "email": value.username,
              "cost": prize.cost,
              "name": `${value.firstname} ${value.lastname}`,
              "balance": amount,
              "purchase": true,
              "portalId": value.portalId,
              "history": {
                "date": new Date(),
                "action": `Purchased ${prize.title} for`,
                "balance": amount,
                "userEmail": value.username,
                "prize": prize,
                "who": "",
                "amount": prize.cost,
                "comments": "Congratulations on your purchase!"

              }
            }),
          })
            .then(res => res.json())
            .then(res => {
              if (res.success) {
                triggerPushNotificationHandler(
                  adminPushToken,
                  `New Purchase from ${value.firstname} ${value.lastname}!`,
                  `${prize.title} Cost: ${coin(prize.cost)}`
                );
                const balance = res.crewuser.balance - prize.cost;
                setValue({ ...value, balance: balance });
                setIsLoading(false);
                Alert.alert(
                  `${prize.title} purchased!`,
                  `Please see your manager for further details`,
                  [
                    {
                      text: "OK", onPress: () => {
                        console.log("OK Pressed")
                      }
                    }
                  ],
                  { cancelable: false }
                );
              } else {
                Alert.alert(
                  `${err}`,
                  "Please check internet connection!",
                  [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                  ]
                )
                setIsLoading(false);
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
            }
            );
        }
        else {
          Alert.alert(
            `Insufficient Funds`,
            `Current balance: ${coin(value.balance)}.`,
            [
              {
                text: "OK", onPress: () => {
                  console.log("OK Pressed")
                }
              }
            ],
            { cancelable: false }
          );
        }
      }
      if (!value.admin) {
        return (
          <Button mb="2" onPress={() => {
            Alert.alert(
              "Purchase",
              `Are you sure you want to purchase this ${prize.title}?`,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "OK", onPress: () => {
                    purchasePrize(prize)
                  }
                }
              ],
              { cancelable: false }
            );
          }}>Buy Now</Button>
        )
      } else {
        return null;
      }
    }

    function deletePrize(prize) {
      const storage = getStorage();
      var prizeRef = ref(storage, prize.image);

      // Delete the file
      deleteObject(prizeRef).then(() => {
        // File deleted successfully
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });

      fetch(`https://crewcoin.herokuapp.com/store/${prize._id}`, {
        method: "DELETE",
        headers: {
          authorization: `bearer ${token}`,
          credentials: "same-origin",
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "cors"
        },
        body: JSON.stringify({
          "prizeId": prize._id
        }),
      })

        .then(res => res.json())
        .then(res => {
          if (res.success) {
            Alert.alert(
              "Prize",
              `Deleted`,
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
            setPrizes(prizes => prizes.filter(prize => prize._id !== res.prizeId))
            setValue({ ...value, store: res.store })
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
            "Error",
            "Please login again",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          )
          navigation.navigate("Login");
        }
        );
    }
    function coin(cost) {
      if (cost > 1) {
        return (
          `${cost} Crew Coins`
        )
      } else {
        return (
          `${cost} Crew Coin`
        )
      }
    }
    return (
      prizes.map(prize => {
        console.log(prize)
        return (
          <PresenceTransition visible initial={{
            opacity: 0
          }} animate={{
            opacity: 1,
            transition: {
              duration: 2050
            }
          }}>
            <Box
              pt={5}
              shadow={2}
              style={styles.image5}
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
              <Box>
                {postImage(prize)}
              </Box>
              <Stack w="330" p="2" space={3}>
                <Stack>

                  <Heading fontSize={16}>
                    {prize.title}
                  </Heading>

                </Stack>
                <Divider />
                <Text fontWeight="400" fontSize={14}>
                  {prize.description}
                </Text>
                <Divider />
                <HStack alignItems="center" space={2} justifyContent="space-between">
                  <HStack alignItems="center">
                    <Text
                      fontWeight="500"
                      color="amber.600"
                      _dark={{
                        color: "amber.600",
                      }}
                      fontSize={16}
                    >
                      {coin(prize.cost)}
                    </Text>
                  </HStack>
                  {buyButton(prize)}
                  {editIcon(prize, setShowModal, setPrize)}
                </HStack>
              </Stack>
              {deleteButton(prize)}
            </Box>
          </PresenceTransition>
        )
      })
    )
  }





  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
      <NativeBaseProvider>
        <AppBar />
        <ImageBackground imageStyle=
          {{ opacity: 0.6 }} alt="bg" style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
          {Spinner()}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>

            <Modal style={{ marginTop: '-10%' }} isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content style={{ marginTop: kbOffset }}>
                <Modal.CloseButton />
                <ScrollView>
                  <Modal.Header bg='muted.100'>{prizeData.title}</Modal.Header>
                  <Modal.Body>
                    <Box>
                      <Center>
                        {postImageThumb(prizeData)}
                      </Center>
                    </Box>
                    <Box>
                      <Text>Item Title:</Text>
                      <Input value={prizeData.title} onChangeText={(value) => setPrize({ ...prizeData, title: value })} />
                      <Text>Item Description:</Text>
                      <Input value={prizeData.description} onChangeText={(value) => setPrize({ ...prizeData, description: value })} />
                      <Text>Item Cost:</Text>
                      <Input value={`${prizeData.cost}`} onChangeText={(value) => setPrize({ ...prizeData, cost: value.replace(/[^0-9]/g, '') })} />
                    </Box>
                    <Modal.Footer>
                      <Button.Group mt={5} space={2}>

                        <Button variant="outline" colorScheme="blueGray" onPress={() => {
                          setShowModal(false);
                        }}>
                          Cancel
                        </Button>
                        <Button onPress={() => {
                          setShowModal(false);
                          updatePrize(prizeData);
                        }}>
                          Save
                        </Button>
                      </Button.Group>
                    </Modal.Footer>
                    <Divider />
                  </Modal.Body>
                </ScrollView>
              </Modal.Content>
            </Modal>
            <Example prizes={prizes} />
            <Prizes prizes={prizes} />
          </ScrollView>
        </ImageBackground>
        <CardBalance />
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

function CardBalance() {
  const { value, setValue } = useContext(UserContext);

  function superUser(user, balance) {
    if (user.superUser) {
      return (
        <Ionicons name="infinite" color="black" size={45} style={{ marginTop: 5, right: 256, position: "relative" }} />

      )
    } else {
      return balance
    }
  }
  return (

    <>
      <VStack borderColor="amber.400"
        borderWidth="1" space="2" bg='amber.300' px="2" justifyContent='space-between' alignItems='center'>
        <Center>
          <HStack >
            <Image style={styles.coinbalance} source={require('../assets/images/coinbalance.png')} />
            <Text bold style={styles.icon2}>{superUser(value, value.balance)}</Text>
          </HStack>
        </Center>
      </VStack>
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
  gif: {
    width: 80,
    height: 80,
    marginTop: -30,
    marginLeft: -30,
  },
  icon2: {
    color: 'black',
    fontSize: 41,
    paddingTop: 23,
    marginTop: 6,
    opacity: 0.9,
    fontFamily: 'System',
  },
  coin: {
    width: 200,
    resizeMode: 'contain',
    height: 50,
    marginLeft: -32,
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

  image5: {
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