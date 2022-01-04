import { StyleSheet, ImageBackground, Image } from "react-native";
import { NativeBaseProvider, Center, Text, Box, Heading, Header, Divider, Stack, HStack, VStack, AspectRatio } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import posts from './sample2';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from "./UserContext";
import { Component, useContext, useEffect } from "react";
import moment from "moment";

export default function HistoryScreen({ route, navigation }) {
    return (
        <NativeBaseProvider>
            <AppBar />
            <ImageBackground imageStyle=
                {{ opacity: 0.3 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
                <ScrollView>

                    <Divider />

                    <HistoryList />


                </ScrollView>

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
                    <Ionicons name="md-chevron-back-sharp" size={24} color="black" onPress={() => { navigation.navigate('Root'); }} />
                </HStack>


                <HStack bg='amber.300' py="2" px="1">
                    <Center><Heading size="lg" color="black">History</Heading></Center>
                </HStack>
            </HStack>
        </>
    )
}

export const HistoryList = () => {
    const { value, setValue } = useContext(UserContext);
        useEffect(() => {
            console.log("fetch")
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

    
    const history = value.history.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
    });
    return (
        history.map(posts => {
            return (
                <Box
                    shadow={2}
                    mt="2"
                    mb="2"

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
                        <Stack w="350" p="2" mx="3" space={3} maxW="95%">
                            <Stack maxW="95%" space={2}>
                                <Center>
                                    <Text
                                        italic="true"
                                            mt="-3"
                                            color="gray.900"
                                            _dark={{
                                                color: "warmGray.200",
                                            }}
                                            fontWeight="500"
                                            fontSize={20}
                                            bold="true"
                                            textAlign="center"
                                           
                                    >
                                        {`${posts.action} ${posts.amount} Crew Coins ${posts.who}`}
                                    </Text>
                                    <Divider color="amber.600" />
                                </Center>
                            </Stack>
                            <Stack  maxW="95%">
                                <VStack width="100%">
                                    <Center>
                                        <Text
                                            italic="true"
                                            mt="-3"
                                            color="gray.900"
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
                                            color="gray.900"
                                            _dark={{
                                                color: "warmGray.200",
                                            }}
                                            fontWeight="400"
                                            fontSize="lg"
                                            italic="true"
                                            bold="true"
                                        >
                                            "{`${posts.comments}`}"
                                        </Text>
                                    </Center>
                                    <Divider />
                                    <Center>
                                        <HStack>
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
                                                Posted: {moment(posts.date).format("MM/DD/YYYY h:mma")}
                                            </Heading>

                                        </HStack>
                                    </Center>
                                </VStack>
                            </Stack>
                        </Stack>
                    </Center>
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