import { StyleSheet, ScrollView, ImageBackground, Image, Alert, Form, KeyboardAvoidingView } from "react-native";
import { NativeBaseProvider, View, Input, Center, Text, Box, Heading, Header, Divider, Stack, HStack, AspectRatio, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import posts from './sample2';
import { useNavigation } from '@react-navigation/native';
import { Component, useContext } from "react";
import { useState } from "react";
import { UserContext } from "./UserContext";
import moment from "moment";
import { toggleClass } from "dom-helpers";
import * as SecureStore from 'expo-secure-store';


export default function SettingsScreen() {
    const { value, setValue } = useContext(UserContext);
    const { navigation } = useNavigation();

    return (
        <NativeBaseProvider>
            <ScrollView>
                <AppBar />
                <ImageBackground imageStyle=
                    {{ opacity: 0.7 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
                    <Divider />
                    <Center>
                        <KeyboardAvoidingView behavior="position" >
                            {Example(value)}
                        </KeyboardAvoidingView>
                    </Center>
                </ImageBackground>
            </ScrollView>
        </NativeBaseProvider>
    );
}

function AppBar() {
    const navigation = useNavigation();
    return (
        <>
            <Box safeAreaTop backgroundColor="gray.100" />
            <HStack bg='amber.300' px="1" alignItems='center' borderColor="gray.300"
                borderWidth="1">
                <HStack space="4" alignItems='center'>
                    <Ionicons name="md-chevron-back-sharp" size={24} color="black" onPress={() => { navigation.navigate('Wallet'); }} />
                </HStack>


                <HStack bg='amber.300' py="2" px="1">
                    <Center><Heading size="lg" color="black">Account Settings</Heading></Center>
                </HStack>
            </HStack>
        </>
    )
}

export const Example = (value) => {
    const navigation = useNavigation();
    const [formData, setData] = useState({});
    const [show, setShow] = useState(false);
    const [token, setToken] = useState('');

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            setToken(result);
        } else {
            console.log('No values stored under that key.');
        }
    }
    getValueFor('token');



    function passwordForm(show) {
        if (show)
            return (
                <>
                    <Divider mt="5" />
                    <Text mt="5">New Password</Text>
                    <Input w="50%" type="password" onChangeText={(value) => setData({ ...formData, newPassword: value })} />
                    <Text>Confirm Password</Text>
                    <Input w="50%" type="password" onChangeText={(value) => setData({ ...formData, confirmPassword: value })} />

                    <Button m="3" onPress={() => {
                        if (formData.newPassword && formData.confirmPassword) {
                            if (formData.newPassword === formData.confirmPassword && formData.newPassword.length > 7 && /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(formData.newPassword)) {
                                passwordChange(formData.newPassword);
                            } else {
                                Alert.alert(
                                    "Passwords must match",
                                    "Password Must be at least 8 characters long and contain at least one number and one special character",
                                    [
                                        { text: "OK", onPress: () => console.log("OK Pressed") }
                                    ]
                                );
                            }
                        }
                    }}
                    >Submit</Button>
                    <Divider />
                </>
            )

    }
    function passwordChange(password) {
        fetch(`https://crewcoin.herokuapp.com/crewuser/passchange/${value.username}`, {
            method: "PUT",
            headers: {
                authorization: `Bearer ${token}`,
                credentials: "same-origin",
                Accept: "application/json",
                "Content-Type": "application/json",
                mode: "cors"
            },
            body: JSON.stringify({
                "password": password,
                "user": value.firstname,
            }),
        })

            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    console.log("success");
                    Alert.alert(
                        "Password Changed",
                        "Your password has been changed",
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ]
                    );
                } else {
                    console.log("fail");
                    Alert.alert(
                        "Password Change Failed",
                        "Your password could not be changed",
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
    function toggleShow() {
        setShow(!show);
    }
    function superUser(user, balance) {
        if (user.superUser) {
          return (

            <Ionicons name="infinite" color="#ffcc00" mt={3} size={22}  />

            
          )
        } else {
          return balance
        }
      }

    return (
        <>
            <Box
                shadow={7}
                mt="3"
                mb="2"
                my="1"
                pt="3"
                pb="3"

                style={styles.image2}
                maxW="100%"
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
                <Stack w="350" p="6" space={3}>
                    <Center mb="5" backgroundColor="amber.200" borderTopRadius="10" borderBottomRadius="10">
                        <Heading p="1" textAlign="center" size="xl" ml="-1">
                            My Account
                        </Heading>
                    </Center>
                    <Divider />
                    <HStack space={2}>
                        <Heading size="sm" ml="-1">
                            Name:
                        </Heading>
                        <Heading size="sm" >
                            {value.firstname + " " + value.lastname}
                        </Heading>
                    </HStack>
                    <Divider />
                    <HStack space={2}>
                        <Heading size="sm" ml="-1">
                            Email:
                        </Heading>
                        <Heading size="sm" >
                            {value.username}
                        </Heading>
                    </HStack>
                    <Divider />
                    <HStack space={2}>
                        <Heading size="sm" ml="-1">
                            Phone:
                        </Heading>
                        <Heading size="sm" >
                            {value.phone}
                        </Heading>
                    </HStack>
                    <Divider />
                    <HStack space={2}>
                        <Heading size="sm" ml="-1">
                            Organization:
                        </Heading>
                        <Heading size="sm" >
                            {value.organization}
                        </Heading>
                    </HStack>
                    <Divider />
                    <HStack space={2}>
                        <Heading size="sm" ml="-1">
                            Member Since:
                        </Heading>
                        <Heading size="sm" >
                            {moment(value.joined).format("MM/DD/YYYY")}
                        </Heading>
                    </HStack>
                    <Divider />
                    <HStack space={2}>
                        <Heading size="sm" ml="-1">
                            Portal ID:
                        </Heading>
                        <Heading size="sm" >
                            {value.portalId}
                        </Heading>
                    </HStack>
                    <Divider />
                    <HStack space={2}>
                        <Heading size="md" ml="-1">
                            Account Balance:
                        </Heading>
                        <Heading size="md" >
                            {superUser(value, value.balance)}
                        </Heading>
                    </HStack>
                    <Divider />
                </Stack>
                <Center mt="5%">
                    <Button shadow={2} border="1" borderColor="gray.400" borderTopRadius="10" borderBottomRadius="10" backgroundColor="amber.300" onPress={() => { toggleShow(show, setShow) }}><Heading>Change Password</Heading></Button>
                    {passwordForm(show)}
                    <Button shadow={2} mt="4" border="1" borderColor="gray.400" borderTopRadius="10" borderBottomRadius="10" backgroundColor="amber.300" onPress={() => { navigation.navigate('Login') }}><Heading>Log Out</Heading></Button>
                </Center>
            </Box>
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