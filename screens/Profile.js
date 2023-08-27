import React, {useState, useEffect, useRef, useContext} from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Button, TextInput, Checkbox } from 'react-native-paper';
import {Box, Heading, VStack} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInput from 'react-native-phone-input';
import {CommonActions, useNavigation} from '@react-navigation/native';

function ProfilePage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    let phoneRef = useRef(null);
    //checkboxes
    const [orderStatusNotification, setOrderStatusNotification] = useState(true);
    const [passwordChangeNotification, setPasswordChangeNotification] = useState(true);
    const [specialOfferNotification, setSpecialOfferNotification] = useState(true);
    const [newsletterNotification, setNewsletterNotification] = useState(true);

    const pickImage = async () => {
        // Check permissions first
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;  // Return if permissions not granted
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled || !result.canceled) {
            setImage(result.uri);
            await AsyncStorage.setItem('ProfilePicture', result.uri);
        }
    };

    useEffect(() => {
        AsyncStorage.getItem('ProfilePicture').then(image => {
            if (image) {
                setImage(image);
            }
        });
        AsyncStorage.getItem('firstName').then(storedFirstName => {
            if(storedFirstName) {
                setFirstName(storedFirstName);
            }
        });
        AsyncStorage.getItem('lastName').then(storedLastName => {
            if(storedLastName) {
                setLastName(storedLastName);
            }
        });
        AsyncStorage.getItem('email').then(storedEmail => {
            if(storedEmail) {
                setEmail(storedEmail);
            }
        });
        AsyncStorage.getItem('phoneNumber').then(storedPhoneNumber => {
            if (storedPhoneNumber) {
                phoneRef.current?.setValue(storedPhoneNumber);
            }
        });
        AsyncStorage.getItem('orderStatusNotification').then(storedNotification => {
            if(storedNotification) {
                setOrderStatusNotification(JSON.parse(storedNotification));
            }
        });
        AsyncStorage.getItem('passwordChangeNotification').then(storedNotification => {
            if(storedNotification) {
                setPasswordChangeNotification(JSON.parse(storedNotification));
            }
        });
        AsyncStorage.getItem('specialOfferNotification').then(storedNotification => {
            if(storedNotification) {
                setSpecialOfferNotification(JSON.parse(storedNotification));
            }
        });
        AsyncStorage.getItem('newsletterNotification').then(storedNotification => {
            if(storedNotification) {
                setNewsletterNotification(JSON.parse(storedNotification));
            }
        });
    }, []);

    const navigation = useNavigation();
    const updateInfo = async () => {
        let phone = phoneRef.current?.getValue();

        if (phone && phoneRef.current?.isValidNumber()) {
            setPhoneNumber(phone);
        } else {
            alert("Please input a valid phone number!");
            return;
        }
        if (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            email.trim() !== '' &&
            phone.trim() !== '' &&
            email.includes('@')
        ) {
            try {
                await AsyncStorage.setItem('firstName', firstName);
                await AsyncStorage.setItem('lastName', lastName);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('phoneNumber', phone);
                //check boxes
                await AsyncStorage.setItem('orderStatusNotification', JSON.stringify(orderStatusNotification));
                await AsyncStorage.setItem('passwordChangeNotification', JSON.stringify(passwordChangeNotification));
                await AsyncStorage.setItem('specialOfferNotification', JSON.stringify(specialOfferNotification));
                await AsyncStorage.setItem('newsletterNotification', JSON.stringify(newsletterNotification));
                await AsyncStorage.setItem('profile', 'true');
                navigation.navigate('Home');
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Please ensure first name, last name, phone number, and email are not empty and email is valid!");
        }
    };

    return (
        <Box flex={1} safeAreaTop bg="white" mt={0} mb={4} px={0} alignSelf="stretch">
            <ScrollView>
                <VStack space={2.5} w="100%" px={3} pb={4}>
                    <Box flexDirection="row" justifyContent="flex-start" alignItems="center" mt={1} ml={"1/6"} >
                        {image ?
                            <Avatar.Image size={40} source={{uri: image}} /> :
                            <Avatar.Text size={40} label={`${firstName[0]}${lastName[0]}`}/>

                        }
                        <Button style={{marginRight: 10}} onPress={pickImage}>Change</Button>
                        <Box marginLeft="auto">
                            <Button onPress={async () => {
                                await AsyncStorage.clear();
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'Onboarding' }],
                                    })
                                );
                            }}>
                                Log out
                            </Button>
                        </Box>
                    </Box>

                    <Box mt={4}>
                        <TextInput
                            label="First name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            label="Last name"
                            value={lastName}
                            onChangeText={setLastName}
                            style={{marginTop: 10}}
                        />
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={{marginTop: 10}}
                        />

                        <Box
                            flexDirection="row"
                            alignItems="center"
                            borderColor="gray.400"
                            borderWidth={1}
                            borderRadius={4}
                            marginTop={10}
                            padding={2}
                        >
                            <Heading size="xs" ml={"1/6"}>Phone:</Heading>
                            <PhoneInput
                                ref={phoneRef}
                                initialCountry="us"
                                containerStyle={{ flex: 1 }}
                                textContainerStyle={{ flex: 1 }}
                                flagStyle={{ marginLeft: 10 }}
                            />
                        </Box>
                        <Heading size="md" pt={4} ml={"7"}>Email Preferences:</Heading>
                        <Checkbox.Item
                            label="Order Statuses"
                            status={orderStatusNotification ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setOrderStatusNotification(!orderStatusNotification);
                            }}
                        />
                        <Checkbox.Item
                            label="Password Changes"
                            status={passwordChangeNotification ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setPasswordChangeNotification(!passwordChangeNotification);
                            }}
                        />
                        <Checkbox.Item
                            label="Special Offers"
                            status={specialOfferNotification ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setSpecialOfferNotification(!specialOfferNotification);
                            }}
                        />
                        <Checkbox.Item
                            label="Newsletter"
                            status={newsletterNotification ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setNewsletterNotification(!newsletterNotification);
                            }}
                        />
                    </Box>
                    <Button
                        onPress={updateInfo}
                        style={{ width: "100%", backgroundColor: "#F4CE14" }}
                        textColor="black"
                        mode={"outlined"}

                    >
                        Update
                    </Button>
                </VStack>
            </ScrollView>
        </Box>
    );
}

export default ProfilePage;