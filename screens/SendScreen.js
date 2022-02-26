import { StyleSheet, ImageBackground, Image, View, Alert, TouchableOpacity } from "react-native";
import { NativeBaseProvider, Box, Container, Heading, Divider, AspectRatio, Stack, HStack, Text, Icon, VStack, Center, StatusBar, Button, Input } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from "react-native-gesture-handler";
import prizes from './sample';
import Counter from "react-native-counters";
import { useNavigation } from '@react-navigation/native';
import { Component, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import React from "react";
import * as SecureStore from 'expo-secure-store';

export default function SendScreen() {
    const [formData, setData] = React.useState({});
    const { value, setValue } = useContext(UserContext);
    const [isLoading, setIsLoading] = React.useState(true);


    function Spinner() {
        if (isLoading) {
            return (
                <Image alt="spinner" source={require('../assets/images/genericspinner.gif')}
                    style={{ marginTop: "-34%", width: '32%', height: '20%', justifyContent: "center", alignItems: "center", zIndex: 20000000, top: "49%", resizeMode: "contain" }} />
            )
        } else {
            return null;
        }
    }

    function admin() {
        if (value.admin) {
            return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                    <Ionicons name="md-trash-sharp" size={16} color="gray" />
                    <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Long Press Any User to Delete</Text>
                </View>
            )
        } else {
            return (
                null
            )
        }
    }

    function CoinShow() {
        const { value, setValue } = useContext(UserContext);
        const [userData, setUser] = React.useState([]);
        const [formData, setData] = React.useState({});
        const [token, setToken] = React.useState('');
        const navigation = useNavigation();

        async function getValueFor(key) {
            let result = await SecureStore.getItemAsync(key);
            if (result) {
                setToken(result);
            } else {
                console.log('No values stored under that key.');
            }
        }
        getValueFor('token');


        //delete user prompt
        function askDeleteUser(user) {
            if (value.admin) {
                Alert.alert(
                    'Delete User',
                    `Are you sure you want to delete ${user.firstname} ${user.lastname}? This action cannot be undone.`,

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
                        reload();
                        Alert.alert(
                            'Success',
                            `${res.status}`,
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
                )
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
            let user = userData.filter(el => el.username !== value.username);
        }


        // function to set new user balance
        function reload() {
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
                        setUser(res);
                        let self = res.filter(user => user.username === value.username);
                        setValue(self[0]);
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
                    console.log(err);
                }
                );

        }
        useEffect(() => {
            //get user data
            setIsLoading(true);
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
                        setUser(res);
                        let self = res.filter(user => user.username === value.username);
                        setValue(self[0]);
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
                    console.log(err);
                }
                );

        }, []);
        //set users for send screen minus current user
        let removeAdmin = userData.filter(el => el.admin === false);
        let user = removeAdmin.filter(el => el.username !== value.username);

        //map users list to send screen
        return (
            user.map((user) => {
                const userId = user._id;
                const username = user.username;
                //send push notification
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

                function handleReceive(navigation, user, formData, self, userId) {
                    const coinincrease = formData[userId + username];
                    const amount = coinincrease + user.balance;
                    const newComment = () => {
                        if (formData[userId] == undefined) {
                            return "";
                        } else {
                            return formData[userId];
                        }

                    }
                    const comment = newComment();
                    console.log(token);
                    setData({
                        ...formData,
                        [user._id + user.username]: coinincrease
                    })
                    const secondAmount = value.balance - coinincrease;
                    //need to fix this... update user balance
                    if (value.balance >= coinincrease) {
                        if (coinincrease > 0) {

                            fetch(`https://crewcoin.herokuapp.com/crewuser/send/${userId}`, {
                                method: "PUT",
                                headers: {
                                    //bearer token
                                    authorization: `bearer ${token}`,
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    mode: "cors"
                                },
                                body: JSON.stringify({
                                    "coinincrease": coinincrease,
                                    "balance": secondAmount,
                                    "balance2": amount,
                                    "history": {
                                        "date": new Date(),
                                        "action": "Received",
                                        "amount": coinincrease,
                                        "balance": amount,
                                        "comments": comment,
                                        "who": `from ${value.firstname} ${value.lastname}`
                                    },
                                    "history2": {
                                        "date": new Date(),
                                        "action": "Sent",
                                        "amount": coinincrease,
                                        "balance": secondAmount,
                                        "comments": comment,
                                        "who": `to ${user.firstname} ${user.lastname}`
                                    },
                                    "userId": value._id,
                                }),
                            })

                                .then(res => res.json())
                                .then(res => {
                                    if (res.success) {
                                        const message = `${value.firstname} ${value.lastname} sent you ${coin(coinincrease)}!`;
                                        triggerPushNotificationHandler(user.pushToken, `Cha-Ching!`, message);
                                        setData({ ...formData, [userId]: "", [userId + username]: coinincrease }),
                                            reload()
                                        Alert.alert(
                                            "Coins Sent!",
                                            `You sent ${coin(coinincrease)} to ${user.firstname + " " + user.lastname}`,
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
                                }
                                );
                        } else {
                            return null
                        }
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
                function startFunc(data) {
                    if (data == undefined) {
                        return 0;
                    } else {
                        return (data + 0)
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
                        _web={{
                            shadow: 2,
                            borderWidth: 0,
                        }}
                        _light={{
                            backgroundColor: "gray.50",
                        }}
                    >
                        <Stack>
                            <TouchableOpacity delayLongPress={2000} onLongPress={() => askDeleteUser(user)}>
                                <HStack display="flex" flexDirection="row" alignItems="center" w="100%" space={3} justifyContent="space-evenly">
                                    <Text
                                        width="40%"
                                        py="3"
                                        px="2"
                                        fontSize="lg"
                                        color="gray.600"
                                        fontWeight="600"
                                    >
                                        {user.firstname + " " + user.lastname}
                                    </Text>
                                    <HStack justifyContent="center">
                                        <Counter key={user._id} start={startFunc(0)} count={startFunc(formData[user._id + user.username])} min={0} onChange={(e) => {

                                            setData({
                                                ...formData,
                                                [user._id + user.username]: e
                                            })
                                        }} />

                                        <Button ml="3"
                                            onPress={() => {
                                                (handleReceive(navigation, user, formData, self, userId));


                                            }}>Send</Button>
                                    </HStack>
                                </HStack>
                            </TouchableOpacity>
                            <Input id={user._id} value={formData[user._id]} placeholder="Comments" onChangeText={(text) => {
                                setData({
                                    ...formData,
                                    [user._id]: text
                                })
                            }} />
                        </Stack>
                    </Box>

                )
            })
        )
    }

    return (
        <NativeBaseProvider>
            <AppBar />
            <ImageBackground imageStyle=
                {{ opacity: 0.2 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
                {Spinner()}
                <ScrollView>
                    {CoinShow(prizes)}
                    {admin()}
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

    function superUser(user, balance) {
        if (user.superUser) {
          return (
            <Ionicons name="infinite" color="#ffcc00" size={55} style={{ top: 1, right: 256, position: "absolute" }} />
            
          )
        } else {
          return balance
        }
      }
    return (
        <>
            <VStack borderColor="gray.300" borderWidth="1" space="4" bg='amber.300' px="2" mb="2" justifyContent='space-between' alignItems='center'>
                <Center>
                    <HStack >
                        <Image style={styles.coinbalance} source={require('../assets/images/coinbalance.png')} />
                        <Text style={styles.icon2}>{superUser(value, value.balance)}</Text>
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