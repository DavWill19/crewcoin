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
    View,
    NativeBaseProvider,
} from "native-base"
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, } from "react-native";
import { Component, useContext } from "react";
import { UserContext } from "./UserContext";


export function Login() {
    const navigation = useNavigation();
    const { value, setValue } = useContext(UserContext);
    const [formData, setData] = React.useState({});
    const [user, setUser] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    function Spinner() {
        if (isLoading) {
            return (
                <Image source={require('../assets/images/ballspinner.gif')}
                    style={{ marginTop: "-50%", width: '30%', height: '40%', zIndex:2, justifyContent: "center", alignItems: "center", top: "55%", right: "-35%", resizeMode: "contain" }} />
            )
        }
    }

    return (
        <View width="110%" backgroundColor="#fff">
        {Spinner()}
            <Box mx="auto" safeArea p="2" py="4" w="100%" maxW="340" >
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

                            (handleSubmit(formData, navigation, setUser, setValue, setData, isLoading, setIsLoading));


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
        </View>
    )
}



function handleSubmit(formData, navigation, setUser, setValue, setData, isLoading, setIsLoading) {
    setIsLoading(true);
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
                setIsLoading(false);
                setUser(res.user);
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
            setIsLoading(false);
        }
        );
    console.log(isLoading);
}

export default function LoginScreen() {
    
    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                
            >
                <NativeBaseProvider>
                    <ScrollView backgroundColor="#fff" >
                        <Center flex={1} px="3">
                            <Login />
                        </Center>
                    </ScrollView>
                </NativeBaseProvider>
            </KeyboardAvoidingView>
        </>
    )
}




const styles = StyleSheet.create({

    title: {
        width: 350,
        resizeMode: 'contain',
        marginLeft: -20,


    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
});