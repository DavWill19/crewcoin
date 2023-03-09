import { StyleSheet, ImageBackground, Image, FlatList } from "react-native";
import { NativeBaseProvider, Center, Text, Box, Heading, Header, Divider, Stack, HStack, VStack, AspectRatio } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import posts from './sample2';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from "./UserContext";
import { Component, useContext, useEffect, useState } from "react";
import moment from "moment";
import * as SecureStore from 'expo-secure-store';




export default function HistoryScreen({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(true);

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



    function HistoryList() {
        const { value, setValue } = useContext(UserContext);
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

            // update alerts
            if (value.newTransaction) {
                fetch(`https://crewcoin.herokuapp.com/crewuser/alert/${value._id}`, {
                    method: "PUT",
                    headers: {
                        //bearer token
                        authorization: `bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        mode: "cors"
                    },
                    body: JSON.stringify({
                        "newStoreItem": value.newStoreItem,
                        "newTransaction": false,
                        "newAnnouncement": value.newAnnouncement,
                    }),
                })

                    .then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            setValue(res.crewuser);
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
                    });
            }

        }, []);


        const history = value.history.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });
        return (
            <FlatList
                data={history}
                renderItem={({ item }) =>
                    <Box
                        shadow={2}
                        mt="1"
                        mb="1"

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
                            backgroundColor: "white",
                        }}
                    >   <Center>
                            <Stack w="350" p="2" mx="4" space={3} maxW="95%">
                                <Stack maxW="95%" space={2}>
                                    <Center>
                                        <Text

                                            mt="-3"
                                            color="gray.700"
                                            _dark={{
                                                color: "warmGray.200",
                                            }}
                                            fontWeight="500"
                                            fontSize={17}
                                            bold="true"
                                            textAlign="center"

                                        >
                                            {`${item.action} ${coin(item.amount)} ${item.who}`}
                                        </Text>
                                        <Divider color="amber.600" />
                                    </Center>
                                </Stack>
                                <Stack maxW="100%">
                                    <VStack width="100%">
                                        <Center>
                                            <Text
                                                italic="true"
                                                mt="-3"
                                                color="gray.700"
                                                _dark={{
                                                    color: "warmGray.200",
                                                }}
                                                fontWeight="500"
                                                fontSize="md"
                                            >
                                                Comments:
                                            </Text>
                                            <Text
                                                textAlign="center"
                                                color="gray.700"
                                                _dark={{
                                                    color: "warmGray.200",
                                                }}
                                                fontWeight="400"
                                                fontSize="md"
                                                italic="true"
                                                bold="true"
                                            >
                                                "{`${item.comments}`}"
                                            </Text>
                                        </Center>
                                        <Divider />
                                        <Center>
                                            <HStack >
                                                <Image style={styles.coin} source={require('../assets/images/coinIcon2.gif')} />
                                                <Heading
                                                    mt="2"
                                                    color="yellow.600"
                                                    _dark={{
                                                        color: "warmGray.200",
                                                    }}
                                                    fontWeight="600"
                                                    fontSize="md"
                                                >
                                                    Posted: {moment(item.date).format("MM/DD/YYYY h:mma")}
                                                </Heading>

                                            </HStack>
                                        </Center>
                                    </VStack>
                                </Stack>
                            </Stack>
                        </Center>
                    </Box>
                }
                keyExtractor={item => item.date}
            />
        )
    }



    return (
        <NativeBaseProvider>
            <AppBar />
            <ImageBackground imageStyle=
                {{ opacity: 0.3 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
                {Spinner()}

                <Divider />
                <HistoryList />

            </ImageBackground>
        </NativeBaseProvider>
    );
}

function AppBar() {
    const navigation = useNavigation();
    return (
        <>
            <Box safeAreaTop backgroundColor="#f2f2f2" />
            <HStack borderColor="gray.300"
                borderWidth="1" bg='amber.300' px="1" alignItems='center'>
                <HStack space="4" alignItems='center'>
                    <Ionicons name="md-chevron-back-sharp" size={24} color="black" onPress={() => { navigation.navigate('Wallet'); }} />
                </HStack>


                <HStack bg='amber.300' py="2" px="1">
                    <Center><Heading size="lg" color="black">History</Heading></Center>
                </HStack>
            </HStack>
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
        width: 40,
        resizeMode: 'contain',
        height: 25,
        marginTop: 5,
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
        backgroundColor: 'gray',
    },
    image2: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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