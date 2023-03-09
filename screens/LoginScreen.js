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
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Component, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { getNextTriggerDateAsync } from "expo-notifications";
import { Ionicons } from '@expo/vector-icons';


export function Login() {
    const navigation = useNavigation();
    const { value, setValue } = useContext(UserContext);
    const [formData, setData] = React.useState({ ...formData, username: username, password: password });
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [user, setUser] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [passwordType , setPasswordType] = React.useState("password");


    async function getValueFor(key1, key2) {
        let result = await SecureStore.getItemAsync(key1);
        let result2 = await SecureStore.getItemAsync(key2);
        if (result !== null && result2 !== null) {
            setUsername(result);
            setPassword(result2);
        }
        else {
            console.log("no value stored");
        }

    }
    getValueFor("username", "password");



    useEffect(() => {
        if (username.length > 0) {
            setData({ ...formData, username: username, password: password });
        }
    }, [username, password]);




    function Spinner() {
        if (isLoading) {
            return (
                <Image source={require('../assets/images/genericspinner.gif')}
                    style={{ marginTop: "-69%", width: '36%', height: '40%', zIndex: 2, justifyContent: "center", alignItems: "center", top: "57%", right: "-33%", resizeMode: "contain" }} />
            )
        }
    }

    return (
        <View width="80%" backgroundColor="#fff">

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
                        <Input defaultValue={username} type="email" onChangeText={(value) => setData({ ...formData, username: value.toLowerCase() })} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input defaultValue={password} type={passwordType} onChangeText={(value) => setData({ ...formData, password: value })} />
                        <Button ml="auto"
                            onPress={() => {
                                if (passwordType === "password") {
                                    setPasswordType("text");
                                } else {
                                    setPasswordType("password");
                                }
                            }}
                            variant="link"
                            _text={{
                                fontSize: "xs",
                                fontWeight: "medium",
                                color: "coolGray.600",
                                _dark: {
                                    color: "warmGray.200",
                                },
                            }}
                        >
                           <Ionicons name="eye" size={12} color="#BCBCBC"> {passwordType === "password" ? "Show" : "Hide"} </Ionicons>
                        </Button>
                        <Link
                            _text={{
                                color: "indigo.500",
                                fontWeight: "medium",
                                fontSize: "sm",
                            }}
                            href="https://www.crew-coin.com/#/forgotpassword"
                        >
                            Forgot Password?
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
                            href="https://www.crew-coin.com/#/signup"
                        >
                            Setup New Organization
                        </Link>
                    </HStack>
                </VStack>
            </Box>


        </View>
    )
}

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}


function handleSubmit(formData, navigation, setUser, setValue, setData, isLoading, setIsLoading) {
    setIsLoading(true);
    save("password", formData.password);
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
            if (res) {
                console.log(res.session, "session")
                if (res.success === true) {
                    setIsLoading(false);
                    setUser(res.user);
                    setValue(res.user);
                    //store json web token in secure storage
                    save("token", res.token);
                    save("username", res.user.username);
                    setIsLoading(false);
                    navigation.navigate('Root');
                }
            }
        }
        )
        .catch(err => {
            console.log(err.toString())
            if (err.toString() == `SyntaxError: JSON Parse error: Unexpected identifier "Unauthorized"`) {
                Alert.alert(
                    "Invalid Username or Password",
                    "",
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                )
                setIsLoading(false);
            }
            else {
                Alert.alert(
                    "Error",
                    "Something went wrong. Check internet connection",
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                )
                setIsLoading(false);
            }
        }
        )

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
        marginLeft: -40,


    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
});