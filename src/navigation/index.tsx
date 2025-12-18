import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LoginScreen from "../screens/authModule/LoginScreen";
import { ScreenName } from "./Screenname";
import Colors from "../constants/Colors";
import HomeScreen from "../screens/dashboardModule/HomeScreen";
import ProfileScreen from "../screens/dashboardModule/ProfileScreen";
import { useEffect, useState } from "react";
import StoreListScreen from "../screens/dashboardModule/StoreListScreen";
import StoreDetailsScreen from "../screens/dashboardModule/StoreDetailsScreen";
import AudioRecordingScreen from "../screens/dashboardModule/AudioRecordingScreen";
import ManageNotificationsScreen from "../screens/dashboardModule/ManageNotificationsScreen";
import fonts from "../assets/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator<any>();
const Tab = createBottomTabNavigator();


const BottomTabs: React.FC = () => {

  const TabIcon = ({ source, label, focused }) => (
    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
 paddingTop: 0, backgroundColor: focused ? Colors.primary : Colors.white, width: 120, height: 50, borderRadius: 30, marginTop: 10 }}>
      <Image
        source={source}
        style={{
          width: 20,
          height: 20,
          tintColor: focused ? Colors.white : Colors.gray,
          resizeMode: 'contain',
          // marginTop: Platform.OS === 'web' ? 5 : 24,
        }}
      />
      {focused && <Text
        style={{
          fontSize: 14,
          color: focused ? Colors.white : Colors.gray,
          textAlign: 'center',
          marginStart: 10,
          fontFamily:fonts.PlusJakartaSansMedium
        }}
      >
        {label}
      </Text>}


    </View>
  );

  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          paddingTop:5,
        },

        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === ScreenName.Home) {
            icon = require('../assets/icons/ic_home.png');
          } else if (route.name === ScreenName.Profile) {
            icon = require('../assets/icons/ic_user.png');
          }


          return (
            <TabIcon
              source={icon}
              label={route.name}
              focused={focused}
            />
          )
        }
       
      })}>
      <Tab.Screen name={ScreenName.Home} component={HomeScreen} />
      <Tab.Screen name={ScreenName.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    const loggedIn = await AsyncStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedIn === 'true')
  }

  if (isLoggedIn === null) {
    return null // or a splash screen
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle={"dark-content"} backgroundColor={'white'} />
      <Stack.Navigator
        initialRouteName={isLoggedIn ? ScreenName.BottomTab : ScreenName.Login}
        screenOptions={{ headerShown: false }}>

        <Stack.Screen name={ScreenName.Login} component={LoginScreen} />

        <Stack.Screen
          name={ScreenName.BottomTab}
          component={BottomTabs}
          options={{ headerShown: false }}
        />
      <Stack.Screen name={ScreenName.StoreList} component={StoreListScreen} />
      <Stack.Screen name={ScreenName.StoreDetails} component={StoreDetailsScreen} />
      <Stack.Screen name={ScreenName.AudioRecording} component={AudioRecordingScreen} />
      <Stack.Screen name={ScreenName.ManageNotifications} component={ManageNotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row', // Align icon and text in a row
    // alignItems: 'center', // Center the content vertically
    // justifyContent: 'center', // Center the content horizontally
    padding: -10, // Add padding for better spacing
    borderRadius: 0, // Rounded corners for the background
  },
  tabText: {
    fontSize: 12, // Adjust text size
    // marginLeft: 5, // Space between icon and text
    fontWeight: 'bold', // Optional: Make the text bold
  },
});
