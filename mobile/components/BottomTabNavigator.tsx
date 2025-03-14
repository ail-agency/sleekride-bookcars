import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'
import * as Notifications from 'expo-notifications'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack'
import * as SplashScreen from 'expo-splash-screen'
import * as helper from '../common/helper'
import * as NotificationService from '../services/NotificationService'
import * as UserService from '../services/UserService'
import HomeScreen from '@/screens/HomeScreen'
import AboutScreen from '@/screens/AboutScreen'
import SearchScreen from '@/screens/SearchScreen'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const { height } = Dimensions.get('window')

// Bottom Tab Navigation
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// eslint-disable-next-line arrow-body-style
const BottomTabNavigator = () => {
  const [appIsReady, setAppIsReady] = useState(false)

  const responseListener = useRef<Notifications.EventSubscription>()
  const navigationRef = useRef<NavigationContainerRef<StackParams>>(null)

useEffect(() => {
    const register = async () => {
      const loggedIn = await UserService.loggedIn()
      if (loggedIn) {
        const currentUser = await UserService.getCurrentUser()
        if (currentUser?._id) {
          await helper.registerPushToken(currentUser._id)
        } else {
          helper.error()
        }
      }
    }

    //
    // Register push notifiations token
    //
    register()

    //
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    //
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      try {
        if (navigationRef.current) {
          const { data } = response.notification.request.content

          if (data.booking) {
            if (data.user && data.notification) {
              await NotificationService.markAsRead(data.user, [data.notification])
            }
            navigationRef.current.navigate('Booking', { id: data.booking })
          } else {
            navigationRef.current.navigate('Notifications', {})
          }
        }
      } catch (err) {
        helper.error(err, false)
      }
    })

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current!)
    }
  }, [])

  const onReady = useCallback(async () => {
    if (appIsReady) {
      //
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      //
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  setTimeout(() => {
    setAppIsReady(true)
  }, 500)

  if (!appIsReady) {
    return null
  }

  const BottomTab = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName
          if (route.name === 'Home') iconName = 'home-outline'
          else if (route.name === 'Settings') iconName = 'settings-outline'
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarStyle: { backgroundColor: '#121214', height: height * 0.07 }, // Footer Height
        tabBarActiveTintColor: '#665cff',
        tabBarInactiveTintColor: '#c3c5c5',
        headerShown: false
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='About' component={AboutScreen} />
    </Tab.Navigator>
  )

  return (
    <NavigationContainer ref={navigationRef} onReady={onReady}>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name='MainTabs' component={BottomTab} />
        <Stack.Screen name="Cars" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
)
}

export default BottomTabNavigator
