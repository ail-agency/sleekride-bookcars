import React, { useEffect, useState } from 'react'
import {
  View,
  KeyboardAvoidingView,
  Pressable,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import SearchForm from './SearchForm'
import { getHeaderHeight } from '@/utils/scale'

type Props = {
    navigation: NativeStackNavigationProp<StackParams, keyof StackParams>
    isVisible: boolean,
    onClose?: () => void,
}

const { height, width } = Dimensions.get('window')

const SearchModal = (props:Props) => {
  // const [address, setAddress] = useState('')

  const slideAnim = useState(new Animated.Value(height))[0]
  const fadeAnim = useState(new Animated.Value(0))[0]

  useEffect(() => {
    const _getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
            alert('Permission to access location was denied')
            return
            }

            const location = await Location.getCurrentPositionAsync({})
            const response = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            })
            if (response.length > 0) {
                const { street, city, region, postalCode, country } = response[0]
                let formattedAddress = ''

                if (street) formattedAddress += street
                if (city) formattedAddress += (formattedAddress ? ', ' : '') + city
                if (region) formattedAddress += (formattedAddress ? ', ' : '') + region
                if (postalCode) formattedAddress += (formattedAddress ? ', ' : '') + postalCode
                if (country) formattedAddress += (formattedAddress ? ', ' : '') + country
                console.log(formattedAddress)
                // setAddress(formattedAddress)
            } else {
                // setAddress('Address not found')
            }
        } catch (error) {
            console.log(error)
            // setAddress('Error retrieving address')
        }
    }
    _getLocation()
  }, [])

  useEffect(() => {
    if (props.isVisible) {
      // Fade in backdrop and slide up content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      // Fade out backdrop and slide down content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [props.isVisible])

  if (!props.isVisible) {
    return null
  }

  const Header = () => (
    <View style={[styles.headerContainer, { height: getHeaderHeight() }]}>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header />
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim
          }
        ]}
      >
        <TouchableWithoutFeedback onPress={props.onClose}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{
              translateY: slideAnim
            }]
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.content}
          >
            <Pressable onPress={props.onClose} style={styles.header}>
                <Ionicons name='arrow-back' color={'#fff'} size={20} />
            </Pressable>
            <SearchForm navigation={props.navigation} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#121114',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 25 : 0
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    zIndex: 1000
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#1e1e1f',
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    zIndex: 1001,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 12,
    marginTop: 10,
    width: 50,
    height: 25
  },
  backButton: {
    backgroundColor: '#E1E1E1',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  }
})

export default SearchModal
