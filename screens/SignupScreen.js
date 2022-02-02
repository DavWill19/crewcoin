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

import { StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView  } from "react-native";
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
          .then(() => {
            return Notifications.getExpoPushTokenAsync()
          })
          .then(response => {
            const deviceToken = response.data
            console.log({ deviceToken })
            setData({ ...formData, pushToken: deviceToken })
          })
          .catch(err => {
            return null
          })
      }, [])


    return (
        <Box backgroundColor="#fff" safeArea p="2" py="4" w="100%" maxW="100%">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Image style={styles.title} source={require('../assets/images/crewcoinlogo.png')} />
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
                        <FormControl.Label>Organization</FormControl.Label>
                        <Input placeholder="Organization" onChangeText={(value) => setData({ ...formData, organization: value })} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Portal ID</FormControl.Label>
                        <Input maxLength={4} placeholder="Portal ID" onChangeText={(value) => setData({ ...formData, portalId: value })} />
                    </FormControl>
                    <Button mt="2" colorScheme="yellow"
                        onPress={() => {
                            if (formData.password === formData.confirmpassword && formData.password.length > 7 && /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(formData.password)) {

                                if (/.+@.+\.[A-Za-z]+$/.test(formData.username)) {
                                    handleSubmit(formData, navigation, setUser, setValue);
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
                    <HStack mb="6" justifyContent="center">
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
                            href="www.crew-coin.com"
                        >
                            Setup New Organization
                        </Link>
                    </HStack>
                </VStack>
            </KeyboardAvoidingView>
        </Box>
    )
}



function handleSubmit(formData, navigation, setUser, setValue) {
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
            "firstname": formData.firstname,
            "lastname": formData.lastname,
            "phone": formData.phone,
            "organization": formData.organization,
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
}

export default function SignupScreen() {
    return (
        <NativeBaseProvider>
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
        marginLeft: "-5%",
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