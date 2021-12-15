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

import { StyleSheet, ImageBackground, Image } from "react-native";

export const SignUp = () => {
    return (
        <Box safeArea p="2" py="8" w="90%" maxW="290">

            <Image style={styles.title} source={require('../assets/images/crewcoinlogo.png')} />
            <Heading
                mt="1"
                _dark={{
                    color: "warmGray.200",
                }}
                color="coolGray.600"
                fontWeight="medium"
                size="xs"
            >
                Sign Up!
            </Heading>

            <VStack space={3} mt="5">
                <FormControl>
                    <FormControl.Label>Email ID</FormControl.Label>
                    <Input />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Password</FormControl.Label>
                    <Input type="password" />
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
                <Button mt="2" colorScheme="amber">
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
                        href="#"
                    >
                        Sign Up
                    </Link>
                </HStack>
            </VStack>
        </Box>
    )
}

export default function LoginScreen() {
    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <Login />
            </Center>
        </NativeBaseProvider>
    )
}


const styles = StyleSheet.create({

    title: {
        width: 350,
        resizeMode: 'contain',
        marginLeft: -50,

    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
});