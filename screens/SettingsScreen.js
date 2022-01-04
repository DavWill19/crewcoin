import { StyleSheet, ImageBackground, Image } from "react-native";
import { NativeBaseProvider, Center, Text, Box, Heading, Header, Divider, Stack, HStack, AspectRatio, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import posts from './sample2';
import { useNavigation } from '@react-navigation/native';
import { Component, useContext } from "react";
import { useState } from "react";
import { UserContext } from "./UserContext";
import moment from "moment";

export default function SettingsScreen({ route, navigation }) {
    const { value, setValue } = useContext(UserContext);
    return (
        <NativeBaseProvider>
            <AppBar />
            <ImageBackground imageStyle=
        {{ opacity: 0.7 }} style={styles.image2} source={require('../assets/images/splashbg2.png')} resizeMode="cover" >
            <ScrollView >

                <Divider />
                <Center>
                    {Example(value)}
                </Center>

            </ScrollView>
            </ImageBackground>
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
                    <Ionicons name="md-chevron-back-sharp" size={24} color="black" onPress={() => { navigation.navigate('Balance'); }} />
                </HStack>


                <HStack bg='amber.300' py="2" px="1">
                    <Center><Heading size="lg" color="black">Account Settings</Heading></Center>
                </HStack>
            </HStack>
        </>
    )
}

export const Example = (value) => {
    return (
        <>
            <Box
                shadow={7}
                mt="5"
                mb="2"
                my="1"
                pt="6"
                pb="6"

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
                    <Center mb="5" backgroundColor= "amber.200" borderTopRadius="10" borderBottomRadius="10">
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
                        {value.balance}
                        </Heading>
                    </HStack>
                    <Divider />
                </Stack>
                <Center mt="5%">
                <Button shadow={2} border="1" borderColor="gray.400" borderTopRadius="10" borderBottomRadius="10" backgroundColor="amber.400"><Heading>Change Password</Heading></Button>
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