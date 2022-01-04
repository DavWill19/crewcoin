import { StyleSheet, ImageBackground, Image, View, Alert } from "react-native";
import { NativeBaseProvider, Box, Container, Heading, Divider, AspectRatio, Stack, HStack, Text, Icon, VStack, Center, StatusBar, Button, Input } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from "react-native-gesture-handler";
import prizes from './sample';
import Counter from "react-native-counters";
import { useNavigation } from '@react-navigation/native';
import { Component, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import React from "react";
import { ReloadInstructions } from "react-native/Libraries/NewAppScreen";
import { set } from "react-native-reanimated";



export default function SendScreen() {

    return (
        <NativeBaseProvider>
            <AppBar />
            <ImageBackground imageStyle=
                {{ opacity: 0.2 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
                <ScrollView>
                    <CoinShow prizes={prizes} />
                </ScrollView>
            </ImageBackground>
            <CardBalance />
        </NativeBaseProvider>
    );
}
function AppBar() {
    const navigation = useNavigation();
    return (
        <>
            <Box safeAreaTop backgroundColor="#f2f2f2" />
            <HStack borderColor="gray.300"
                borderWidth="1" bg='amber.300' py="2" px="1" alignItems='center'>
                <HStack space="4" alignItems='center'>
                    <Ionicons name="md-chevron-back-sharp" size={24} color="black" onPress={() => { navigation.navigate('Root'); }} />
                </HStack>


                <HStack bg='amber.300' px="1">
                    <Center><Heading size="lg" color="black">Send Coins</Heading></Center>
                </HStack>
            </HStack>
        </>
    )
}

function CardBalance() {
    const { value, setValue } = useContext(UserContext);
    return (
        <>
            <VStack borderColor="gray.300" borderWidth="1" space="4" bg='amber.300' px="2" mb="2" justifyContent='space-between' alignItems='center'>
                <Center>
                    <HStack >
                        <Image style={styles.coinbalance} source={require('../assets/images/coinbalance.png')} />
                        <Text style={styles.icon2}>{value.balance}</Text>
                    </HStack>
                </Center>
            </VStack>
        </>
    )
}

export const CoinShow = () => {
    const { value, setValue } = useContext(UserContext);
    const [userData, setUser] = React.useState([]);
    const [formData, setData] = React.useState({});
    const navigation = useNavigation();

    function reload() {
        fetch(`https://crewcoin.herokuapp.com/crewuser/reload/${value._id}`, {
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
                    setValue(res[0]);
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
    }

    useEffect(() => {
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
                    setValue(self[0]);
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
    }, []);
    let user = userData.filter(el => el.username !== value.username);

    return (
        user.map((user) => {
            function handleReceive(navigation, user, formData, self) {
                const amount = formData.coinincrease + user.balance;
                const comment = formData.comments;
                if (value.balance >= formData.coinincrease) {
                    fetch(`https://crewcoin.herokuapp.com/crewuser/${user._id}`, {
                        method: "PUT",
                        headers: {
                            authorization: "jwt",
                            credentials: "same-origin",
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            mode: "cors"
                        },
                        body: JSON.stringify({
                            "balance": amount,
                            "history": {
                                "date": new Date(),
                                "action": "Received",
                                "amount": formData.coinincrease,
                                "balance": amount,
                                "comments": comment,
                                "who": `from ${value.firstname} ${value.lastname}`
                            }
                        }),
                    })

                        .then(res => res.json())
                        .then(res => {
                            if (res.success) {
                                Alert.alert(
                                    "Coins Sent!",
                                    `You sent ${formData.coinincrease} crew coins to ${user.firstname + " " + user.lastname}`,
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        { text: "OK", onPress: () => console.log("OK Pressed") }
                                    ]
                                );
                            } else {
                                console.log("an error occured")
                            }
                        })
                        .catch(err => {
                            console.log("an error occured")
                        }
                        );
                    const secondAmount = value.balance - formData.coinincrease;
                    fetch(`https://crewcoin.herokuapp.com/crewuser/${value._id}`, {
                        method: "PUT",
                        headers: {
                            authorization: "jwt",
                            credentials: "same-origin",
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            mode: "cors"
                        },
                        body: JSON.stringify({
                            "balance": secondAmount,
                            "history": {
                                "date": new Date(),
                                "action": "Sent",
                                "amount": formData.coinincrease,
                                "balance": secondAmount,
                                "comments": comment,
                                "who": `to ${user.firstname} ${user.lastname}`
                            }
                        }),
                    })

                        .then(res => res.json())
                        .then(res => {
                            if (res.success) {
                                setData({ coinincrease: 0, comments: "" });
                                Alert.alert(
                                    "Coins Sent!",
                                    `You sent ${formData.coinincrease} crew coins to ${user.firstname + " " + user.lastname}`,
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        { text: "OK", onPress: () => console.log("OK Pressed") }
                                    ]
                                );
                            } else {
                                Alert.alert(
                                    "Alert Title",
                                    `${err}`,
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
                            Alert.alert(
                                `${err}`,
                                "Please check internet connection!",
                                [

                                    { text: "OK", onPress: () => console.log("OK Pressed") }
                                ]
                            )
                        }
                        );
                    reload();
                }
                else {
                    Alert.alert(
                        "You need more crew coins!",
                        `You do not have enough crew coins! Current balance: ${value.balance}`,
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
            }

            return (

                <Box
                    key={user._id}
                    style={{ width: 500, marginLeft: 0 }}
                    shadow={9}
                    mt="3"
                    maxW="380"
                    rounded="lg"
                    overflow="hidden"
                    borderColor="coolGray.200"
                    borderWidth="1"
                    _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700",
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
                        <HStack display="flex" flexDirection="row" alignItems="center" w="100%" space={3} justifyContent="space-evenly">

                            <Text
                                onLongPress={() => {
                                    Alert.alert(
                                        "Delete User",
                                        "Are you sure you would like to delete this user?",
                                        [                                     
                                            { text: "OK", onPress: () => console.log("OK Pressed") },
                                            { text: "Cancel", onPress: () => console.log("Cancel Pressed") }
                                        ]
                                    )
                                }}
                                width="40%"
                                py="3"
                                px="2"
                                fontSize="lg"
                                color="gray.600"
                                _dark={{
                                    color: "amber.600",
                                }}
                                fontWeight="600"
                            >
                                {user.firstname + " " + user.lastname}
                            </Text>
                            <HStack justifyContent="center">
                                <Counter start={0} value={formData.coinincrease} onChange={(value) => setData({ ...formData, coinincrease: value })} />
                                <Button ml="3"
                                    onPress={() => {
                                        (handleReceive(navigation, user, formData, self));


                                    }}>Send</Button>
                            </HStack>
                        </HStack>
                        <Input value={formData.comments} m="2" size="sm" placeholder="Comments:" onChangeText={(value) => setData({ ...formData, comments: value })} />
                    </Stack>
                </Box>

            )
        })
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
        fontSize: 42,
        fontWeight: '700',
        paddingTop: 23,
        marginTop: 6,
        opacity: 0.9,
        fontFamily: 'System',
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