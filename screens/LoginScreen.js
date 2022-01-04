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

import { StyleSheet, Image, Alert, ScrollView } from "react-native";
import { Component, useContext } from "react";
import { UserContext } from "./UserContext";


export function Login() {
    const navigation = useNavigation();
    const { value, setValue } = useContext(UserContext);
    const [formData, setData] = React.useState({});
    const [user, setUser] = React.useState({});


    return (
        <Box safeArea p="2" py="4" w="90%" maxW="290">

            <Image style={styles.title} source={require('../assets/images/crewcoinlogo.png')} />
            <Heading

                _dark={{
                    color: "warmGray.200",
                }}
                color="coolGray.600"
                fontWeight="medium"
                size="xs"
            >
                Sign in to continue!
            </Heading>

            <VStack space={3} mt="5">
                <FormControl>
                    <FormControl.Label>Email ID</FormControl.Label>
                    <Input onChangeText={(value) => setData({ ...formData, username: value.toLowerCase() })} />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Password</FormControl.Label>
                    <Input type="password" onChangeText={(value) => setData({ ...formData, password: value })} />
                    <Link
                        _text={{
                            fontSize: "xs",
                            fontWeight: "500",
                            color: "indigo.500",
                        }}
                        alignSelf="flex-end"
                        mt="1"
                    >
                        Forget Password?
                    </Link>
                </FormControl>
                <Button mt="2" colorScheme="yellow"
                    onPress={() => {
                        (handleSubmit(formData, navigation, setUser, setValue));
                        

                    }}
                >
                    Sign in
                </Button>
                <HStack mt="6" justifyContent="center">
                    <Text
                        fontSize="sm"
                        color="coolGray.600"
                        _dark={{
                            color: "warmGray.200",
                        }}

                    >
                        I'm a new user.{" "}
                    </Text>
                    <Link
                        _text={{
                            color: "indigo.500",
                            fontWeight: "medium",
                            fontSize: "sm",
                        }}
                        onPress={() => navigation.navigate("Signup")}
                    >
                        Sign Up
                    </Link>
                </HStack>
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
        </Box>
    )
}



function handleSubmit(formData, navigation, setUser, setValue) {
    fetch("https://crewcoin.herokuapp.com/crewuser/login", {
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
            "password": formData.password
        }),
    })

        .then(res => res.json())
        .then(res => {
            if (res.success) {
                setValue(res.user);
                navigation.navigate("Root");
            } else {
                Alert.alert(
                    "Alert Title",
                    "My Alert Msg",
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
                "Invalid Username or Password",
                "Please enter valid credentials",
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            )
        }
        );
}

export default function LoginScreen() {
    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <Login />
            </Center>
        </NativeBaseProvider>
    )
}




const styles = StyleSheet.create({

    title: {
        width: 350,
        resizeMode: 'contain',
        marginLeft: -50,
        marginTop: -190,

    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
});