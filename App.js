import * as React from 'react';
import {NavigationContainer, useNavigation, useNavigationState} from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from "./screens/Onboarding";
import SplashScreen from "./shared/SplashScreen";
import {DefaultTheme, Provider as PaperProvider, Avatar} from "react-native-paper";
import ProfilePage from "./screens/Profile";
import { NativeBaseProvider } from 'native-base';
import Home from "./screens/Home";
import {View, Image, TouchableOpacity, Dimensions} from "react-native";

async function checkAuthenticationStatus() {
    try {
        const firstName = await AsyncStorage.getItem('firstName');
        const lastName = await AsyncStorage.getItem('lastName');
        const email = await AsyncStorage.getItem('email');
        const profile = await AsyncStorage.getItem('profile');

        if(firstName !== null && lastName !== null && email !== null) {
            if(profile === "true") {
                return "Home";
            } else {
                return "Profile";
            }
        } else {
            return "Onboarding";
        }
    } catch (error) {
        console.error(error);
        return "Onboarding";
    }
}

const screenWidth = Dimensions.get('window').width;

function BackArrow() {
    const navigation = useNavigation();
    const previousRoute = useNavigationState(state => state.index > 0 ? state.routes[state.index - 1] : null);

    // Don't show back button if the previous screen is 'Onboarding' or if there's no previous screen
    //TODO: fix bug specific occasion not showing on Profile
    if (!previousRoute || previousRoute.name === 'Onboarding') {
        return <View style={{ width: screenWidth * 0.05 }} />;
    }

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
                source={require('./assets/left-arrow.png')}
                style={{ width: screenWidth * 0.05, height: screenWidth * 0.05 }}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

function LogoHeader() {
    const navigation = useNavigation();
    const canGoBack = navigation.canGoBack();
    const justifyContent = canGoBack ? 'flex-start' : 'center';

    return (
        <View style={{ flex: 1, justifyContent, alignItems: 'center' }}>
            <Image source={require('./assets/Logo.png')} />
        </View>
    );
}

function CustomHeader({ imageUri, firstName, lastName }) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={{marginRight: 15}}>
                {imageUri ? (
                    <Avatar.Image size={44} source={{ uri: imageUri }} />
                ) : (
                    <Avatar.Text size={44} label={`${firstName[0]}${lastName[0]}`} />
                )}
            </View>
        </TouchableOpacity>
    );
}

const Stack = createNativeStackNavigator();
function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState("Onboarding");
    const [imageUri, setImageUri] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const headerLeft = () => <BackArrow />;
    // headerRight is the Avatar component
    const headerRight = () => <CustomHeader imageUri={imageUri} firstName={firstName} lastName={lastName} />;
    // headerTitle is the Logo component
    const headerTitle = () => <LogoHeader />;

    useEffect(() => {
        AsyncStorage.getItem('ProfilePicture').then(image => {
            if (image) {
                setImageUri(image);
            }
        });
        AsyncStorage.getItem('firstName').then(name => {
            if (name) {
                setFirstName(name);
            }
        });
        AsyncStorage.getItem('lastName').then(name => {
            if (name) {
                setLastName(name);
            }
        });
        checkAuthenticationStatus().then(route => {
            setInitialRoute(route);
            setIsLoading(false);
        });
    }, []);

    const options = ({ route }) => ({
        headerTitle: headerTitle,
        headerRight: route.name === 'Onboarding' ? () => null : headerRight, // if route is 'Onboarding', return null for headerRight
        headerLeft: headerLeft,
        headerTitleAlign: 'center',
        headerStyle: {
            paddingHorizontal: 15,
        },
        headerBackVisible: false,
    });

    if (isLoading) {
        return <SplashScreen />;
    }
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen name="Onboarding" component={Onboarding} options={options} />
                <Stack.Screen name="Profile" component={ProfilePage} options={options} />
                <Stack.Screen name="Home" component={Home} options={options} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#495E57',
        accent: '#f1c40f',
    },
};
export default () => (
    <PaperProvider theme={theme}>
        <NativeBaseProvider>
            <App />
        </NativeBaseProvider>
    </PaperProvider>
);
