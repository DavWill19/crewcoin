import { StyleSheet, ScrollView, ImageBackground, Image, Alert, Form, KeyboardAvoidingView, TouchableOpacity, Linking } from "react-native";
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
import { FontDisplay } from "expo-font";

export default function SettingsScreen() {
    const { value, setValue } = useContext(UserContext);
    const { navigation } = useNavigation();


    return (
        <NativeBaseProvider>
            <AppBar />
            <ScrollView>
                <ImageBackground imageStyle=
                    {{ opacity: 0.7 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
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

function Example(value) {
    const navigation = useNavigation();
    const [formData, setData] = useState({});
    const [show, setShow] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState("");

    // async function getValueFor(key) {
    //     let result = await SecureStore.getItemAsync(key);
    //     if (result !== null) {
    //         setEmail(result);
    //     }

    // }
    // getValueFor("username");

    async function getValueFor(key, key2) {
        let result = await SecureStore.getItemAsync(key);
        let result2 = await SecureStore.getItemAsync(key2);
        if (result) {
            setToken(result);
        } if (result2) {
            setEmail(result2);
        }
    }
    getValueFor("token", "adminEmail");


    function askDeleteUser(user) {
        if (user.admin) {
            Alert.alert(
                'Delete User',
                `Are you sure you want to delete your account? This action cannot be undone and may suspend all user accounts!`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            deleteUser(user._id);
                        }
                    },
                ],
                { cancelable: false },
            );

        } else {
            Alert.alert(
                'Delete User',
                `Are you sure you want to delete your account? This action cannot be undone! You will lose any crew coin balance you may have.`,

                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            deleteUser(user._id);
                        }
                    },
                ],
                { cancelable: false },
            );
        }
    }
    function deleteUser(id) {
        fetch(`https://crewcoin.herokuapp.com/crewuser/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `bearer ${token}`,
                credentials: "same-origin",
                Accept: "application/json",
                "Content-Type": "application/json",
                mode: "cors"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    navigation.navigate('Login');
                }
            })
            .catch(err => {
                Alert.alert(
                    'Error',
                    'Something went wrong!',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                            style: 'cancel',
                        },
                    ],
                    { cancelable: false },
                );
            }
            );
    }

    function passwordForm(show) {
        const [passwordType, setPasswordType] = useState('password');
        if (show)
            return (
                <>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }} mt="5">Set New Password</Text>
                    <Divider width="70%" mt="2" />
                    <Text mt="3" style={{ fontSize: 18, fontWeight: 'bold', color: "gray.800" }} >New Password</Text>
                    <Input w="70%" type={passwordType} onChangeText={(value) => setData({ ...formData, newPassword: value })} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "darkGray" }}>Confirm Password</Text>
                    <Input w="70%" type={passwordType} onChangeText={(value) => setData({ ...formData, confirmPassword: value })} />
                    <TouchableOpacity>
                        <Button mx="auto"
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
                            <Ionicons name="eye" size={13} color="#BCBCBC"> {passwordType === "password" ? "Show" : "Hide"} </Ionicons>
                        </Button>
                        <Button m="3" backgroundColor="cyan.600" onPress={() => {
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
                        >Save Password</Button>
                    </TouchableOpacity>
                    <Divider width="50%" mt="2" />
                    <Center mt="1" mb="2">
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: "gray" }} >Password Requirements:</Text>
                        <Text style={{ fontSize: 11, fontWeight: 'italic', color: "gray" }} >*Minimum of 8 characters</Text>
                        <Text style={{ fontSize: 11, fontWeight: 'italic', color: "gray" }} >*One capitalized character</Text>
                        <Text style={{ fontSize: 11, fontWeight: 'italic', color: "gray" }} >*One number character</Text>
                        <Text style={{ fontSize: 11, fontWeight: 'italic', color: "gray" }} >*One special character</Text>
                    </Center>
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

                <Ionicons name="infinite" color="#ffcc00" mt={3} size={22} />


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
                            {value.username.substring(0, 25) + "..."}
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
                    <Button shadow={2} mt="4" border="1" borderColor="gray.400" borderTopRadius="10" borderBottomRadius="10" backgroundColor="cyan.600"
                        style={value.admin ? { display: "none" } : { display: "flex" }}
                        onPress={() => Linking.openURL(`mailto:${email}
                        ?subject=Crew Coin Support`)}
                        title="support@crewcoin.app"
                        subject="CrewCoin Support"
                    >
                        <HStack space={2}>
                            <Ionicons name="mail-outline" color="#fff" size={22} />
                            <Heading size="md" color="#fff" >
                                Contact Administrator
                            </Heading>
                        </HStack>
                    </Button>
                    <TouchableOpacity>
                        {/* light gray color */}
                        <Button style={show ? { backgroundColor: "#BCBCBC" } : { display: "flex" }} shadow={2} mt="4" border="1" borderColor="gray.400" borderTopRadius="10" borderBottomRadius="10" backgroundColor="cyan.600" onPress={() => { toggleShow(show, setShow) }}><Heading size="md" color="#fff">
                            {show ? "Cancel" : "Change My Password"}</Heading></Button>
                    </TouchableOpacity>
                </Stack>
                <Center>
                    <Divider mb="4" style={value.admin ? { display: "none" } : { display: "flex" }} />
                    <TouchableOpacity>
                        <Button
                            // if show is true then hide button
                            style={show ? { display: "none" } : { display: "flex" }}
                            shadow={2} border="1" borderColor="gray.400" borderTopRadius="10" borderBottomRadius="10" backgroundColor="cyan.600" onPress={() => { navigation.navigate('Login') }}><Heading size="md"color="#fff">Log Out</Heading></Button>
                    </TouchableOpacity>
                    <Divider style={show ? { display: "none" } : { display: "flex" }} mt="4" width="40%" />
                    {passwordForm(show)}
                    <TouchableOpacity>
                        <Button style={show ? { display: "none" } : { display: "flex" }} shadow={2} mt="4" mb="4" border="1" borderColor="gray.400" borderTopRadius="10" borderBottomRadius="10" backgroundColor="muted.500" onPress={() => { askDeleteUser(value) }}><Heading color="#fff" size="md">Delete My Account</Heading></Button>
                    </TouchableOpacity>
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