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

export const Signup = () => {
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
                        if (formData.password === formData.confirmpassword) {
                            
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
                                "Please re-enter your password",
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
            "portalId": formData.portalId

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
            <ScrollView>
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
        marginLeft: -60,
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