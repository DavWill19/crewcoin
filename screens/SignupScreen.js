import * as React from "react"
import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    HStack,
    Center,
    NativeBaseProvider,
} from "native-base"
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true,
        }
    },
})

export const Signup = () => {
    const navigation = useNavigation();
    const { value, setValue } = useContext(UserContext);
    const [formData, setData] = React.useState({});
    const [user, setUser] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    function Spinner() {
        if (isLoading) {
            return (
                <Image source={require('../assets/images/genericspinner.gif')}
                    style={{ marginTop: "-69%", width: '36%', height: '40%', zIndex: 2, justifyContent: "center", alignItems: "center", top: "57%", right: "-33%", resizeMode: "contain" }} />
            )
        }
    }
    registerForPushNotificationsAsync = async () => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
          setData({ ...formData, pushToken: token })
        } else {
          alert('Must use physical device for Push Notifications');
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

    useEffect(() => {
        // Permission for iOS
        // Permissions.getAsync(Permissions.NOTIFICATIONS)
        //     .then(statusObj => {
        //         // Check if we already have permission
        //         if (statusObj.status !== "granted") {
        //             // If permission is not there, ask for the same
        //             return Permissions.askAsync(Permissions.NOTIFICATIONS)
        //         }
        //         return statusObj
        //     })
        //     .then(statusObj => {
        //         // If permission is still not given throw error
        //         if (statusObj.status !== "granted") {
        //             throw new Error("Permission not granted")
        //         }
        //     })
        //     .then(() => {
        //         return Notifications.getExpoPushTokenAsync()
        //     })
        //     .then(response => {
        //         const deviceToken = response.data
        //         console.log({ deviceToken })
        //         setData({ ...formData, pushToken: deviceToken })
        //     })
        //     .catch(err => {
        //         return null
        //     })
            registerForPushNotificationsAsync();
    }, [])




    return (
        <Box backgroundColor="#fff" safeArea p="2" py="4" w="80%" maxW="100%">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >

                {Spinner()}
                <Image style={styles.title} source={require('../assets/images/crewcoinlogo.png')} />
                <ScrollView>
                    <Heading
                        color="amber.600"
                        fontWeight="medium"
                        size="lg"
                    >
                        Sign up to continue!
                    </Heading>

                    <VStack space={3} mt="5">
                        <FormControl>
                            <FormControl.Label>First Name</FormControl.Label>
                            <Input placeholder="First Name" onChangeText={(value) => setData({ ...formData, firstname: value })} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Last Name</FormControl.Label>
                            <Input placeholder="Last Name" onChangeText={(value) => setData({ ...formData, lastname: value })} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Email ID</FormControl.Label>
                            <Input placeholder="Email" onChangeText={(value) => setData({ ...formData, username: value.toLowerCase() })} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Password</FormControl.Label>
                            <Input placeholder="Password" type="password" onChangeText={(value) => setData({ ...formData, password: value })} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Confirm Password</FormControl.Label>
                            <Input placeholder="Confirm Password" type="password" onChangeText={(value) => setData({ ...formData, confirmpassword: value })} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Phone</FormControl.Label>
                            <Input placeholder="Phone" onChangeText={(value) => setData({ ...formData, phone: value })} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Portal ID</FormControl.Label>
                            <Input maxLength={8} placeholder="Portal ID" onChangeText={(value) => setData({ ...formData, portalId: value.toUpperCase() })} />
                        </FormControl>
                        <Button mt="2" colorScheme="yellow"
                            onPress={() => {
                                if (formData.password === formData.confirmpassword && formData.password.length > 7 && /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(formData.password)) {

                                    if (/.+@.+\.[A-Za-z]+$/.test(formData.username)) {
                                        handleSubmit(formData, navigation, setUser, setValue, setIsLoading);
                                    } else {
                                        Alert.alert(
                                            "Alert Title",
                                            "Please enter valid email",
                                            [
                                                { text: "OK", onPress: () => console.log("OK Pressed") }
                                            ]
                                        );
                                    }
                                } else {
                                    Alert.alert(
                                        "Passwords do not match",
                                        "Password Must be at least 8 characters long and contain at least one number and one special character",
                                        [
                                            { text: "OK", onPress: () => console.log("OK Pressed") }
                                        ]
                                    );
                                }
                            }
                            }
                        >
                            Sign Up!
                        </Button>
                        
                        <VStack mb="2" justifyContent="center">
                        <Center mt="2">
                            <Text
                                fontSize="sm"
                                color="coolGray.600"
                                _dark={{
                                    color: "warmGray.200",
                                }}
                            >
                                I'm an administrator.{" "}
                            </Text>
                            <Link
                                _text={{
                                    color: "indigo.500",
                                    fontWeight: "medium",
                                    fontSize: "sm",
                                }}
                                href="https://www.crew-coin.com"
                            >
                                Setup New Organization
                            </Link>
                            </Center>
                        </VStack>
                        <VStack justifyContent="center">
                        <Center>
                            <Text
                                fontSize="sm"
                                color="coolGray.600"
                                _dark={{
                                    color: "warmGray.200",
                                }}
                            >
                                I have an account. {" "}
                            </Text>
                            <Link
                                _text={{
                                    color: "indigo.500",
                                    fontWeight: "medium",
                                    fontSize: "sm",
                                }}
                                onPress={() => navigation.navigate("Login")}
                            >
                                Login.
                            </Link>
                            </Center>
                        </VStack>
                        
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </Box>
    )
}



function handleSubmit(formData, navigation, setUser, setValue, setIsLoading) {
    setIsLoading(true)
    fetch("https://crewcoin.herokuapp.com/crewuser/signup", {
        method: "POST",
        headers: {
            authorization: "jwt",
            credentials: "same-origin",
            Accept: "application/json, text/html, */*",
            "Content-Type": "application/json",
            mode: "cors"
        },
        body: JSON.stringify({
            "username": formData.username,
            "password": formData.password,
            "firstname": formData.firstname[0].toUpperCase() + formData.firstname.substring(1),
            "lastname": formData.lastname[0].toUpperCase() + formData.lastname.substring(1),
            "phone": formData.phone,
            "portalId": formData.portalId,
            "pushToken": formData.pushToken

        }),
    })

        .then(res => res.json())
        .then(res => {
            if (res.success) {
                setValue(res.user);
                navigation.navigate("Root");
            } else {
                Alert.alert(
                    "Error",
                    `${res.err.message}`,
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            }
        })
        .catch(err => {
            console.log(err);
            Alert.alert(
                "Error",
                "Something went wrong",
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            )
        }
        );
    setIsLoading(false)
}

export default function SignupScreen() {

    function AppBar() {
        return (
          <>
            <Box safeAreaTop backgroundColor="#fff" />      
          </>
        )
      }
    return (
        <NativeBaseProvider>
        <AppBar />
            <ScrollView backgroundColor="#fff">
                <Center flex={1} px="3">
                    <Signup />
                </Center>
            </ScrollView>
        </NativeBaseProvider>
    )
}


const styles = StyleSheet.create({

    title: {
        width: 350,
        resizeMode: 'contain',
        marginLeft: "-14%",
        marginTop: -90,
        marginBottom: -90,

    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
});