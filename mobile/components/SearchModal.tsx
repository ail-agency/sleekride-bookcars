import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native'
import Modal from 'react-native-modal'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { addHours } from 'date-fns'
import DateTimePicker from '@/components/DateTimePicker'
import i18n from '@/lang/i18n'
import * as env from '@/config/env.config'
import colors from '@/themes/colors'

type Props = {
    isVisible: boolean,
    onClose?: () => void,
    onSelect?: (address: string) => void,
}

const SearchModal = (props:Props) => {
  const [search, setSearch] = useState('')
  const [address, setAddress] = useState('')
  const [language, setLanguage] = useState(env.DEFAULT_LANGUAGE)
  const [fromMinDate, setFromMinDate] = useState<Date | undefined>()
  const [minDate, setMinDate] = useState<Date | undefined>()
  const [fromDate, setFromDate] = useState<Date | undefined>()
  const [fromTime, setFromTime] = useState<Date | undefined>()
  const [toDate, setToDate] = useState<Date | undefined>()
  const [toTime, setToTime] = useState<Date | undefined>()
  const [minPickupHoursError, setMinPickupHoursError] = useState(false)
  const [minRentalHoursError, setMinRentalHoursError] = useState(false)
  const [nextStep, setNextStep] = useState(false)

  const data = [
    {
      id: '1',
      icon: 'location-outline',
      label: 'Current location',
      subLabel: 'Enable location services',
    },
    {
      id: '2',
      icon: 'earth-outline',
      label: 'Anywhere',
      subLabel: 'Browse all cars',
    },
    {
      id: '3',
      icon: 'airplane-outline',
      label: 'SJC - San Jose Norman Mineta Airport',
    },
    { id: '4', icon: 'business-outline', label: 'Los Angeles, CA' },
    { id: '5', icon: 'business-outline', label: 'San Francisco, CA' },
    { id: '6', icon: 'train-outline', label: 'Union Station, Los Angeles' },
    { id: '7', icon: 'bed-outline', label: 'Sheraton Grand, Los Angeles' },
  ]

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

                setAddress(formattedAddress)
            } else {
                setAddress('Address not found')
            }
        } catch (error) {
            console.log(error)
            setAddress('Error retrieving address')
        }
    }
    _getLocation()
  }, [])

  // eslint-disable-next-line arrow-body-style
  const BookCarAddress = () => {
    return (
        <>
        {/* Close Button */}
        <DateTimePicker
          mode="date"
          locale={language}
          style={styles.component}
          label={i18n.t('FROM_DATE')}
          value={fromDate}
          minDate={fromMinDate}
          // maxDate={maxDate}
          hideClearButton
          size={'small'}
          onChange={(date) => {
            if (date) {
              setMinPickupHoursError(false)
              setMinRentalHoursError(false)
              if (date.getTime() > toDate!.getTime()) {
                const _to = new Date(date)
                if (env.MIN_RENTAL_HOURS < 24) {
                  _to.setDate(_to.getDate() + 1)
                } else {
                  _to.setDate(_to.getDate() + Math.ceil(env.MIN_RENTAL_HOURS / 24) + 1)
                }
                setToDate(_to)
              }

              let __minDate = new Date(date)
              __minDate = addHours(__minDate, env.MIN_RENTAL_HOURS)
              setMinDate(__minDate)
            } else {
              let __minDate = new Date()
              __minDate = addHours(__minDate, env.MIN_RENTAL_HOURS)
              setMinDate(__minDate)
            }

            setFromDate(date)
          }}
        //   onPress={blurLocations}
          backgroundColor={'#1c1c1e'}
        />
        <DateTimePicker
          mode="time"
          locale={language}
          style={minPickupHoursError ? styles.timeComponent : styles.component}
          label={i18n.t('FROM_TIME')}
          value={fromTime}
          hideClearButton
          size={'small'}
          onChange={(time) => {
            setMinPickupHoursError(false)
            setMinRentalHoursError(false)

            setFromTime(time)
          }}
        //   onPress={blurLocations}
          backgroundColor={'#1c1c1e'}
          error={minPickupHoursError}
          helperText={(minPickupHoursError && i18n.t('MIN_PICK_UP_HOURS_ERROR')) || ''}
        />

        <DateTimePicker
          mode="date"
          locale={language}
          style={styles.component}
          label={i18n.t('TO_DATE')}
          value={toDate}
          minDate={minDate}
          hideClearButton
          size={'small'}
          onChange={(date) => {
            if (date) {
              setMinPickupHoursError(false)
              setMinRentalHoursError(false)

              setToDate(date)
            }
          }}
        //   onPress={blurLocations}
          backgroundColor={'#1c1c1e'}
        />

        <DateTimePicker
          mode="time"
          locale={language}
          style={minRentalHoursError ? styles.timeComponent : styles.component}
          label={i18n.t('TO_TIME')}
          value={toTime}
          hideClearButton
          size={'small'}
          onChange={(time) => {
            setMinPickupHoursError(false)
            setMinRentalHoursError(false)

            setToTime(time)
          }}
        //   onPress={blurLocations}
          backgroundColor={'#1c1c1e'}
          error={minRentalHoursError}
          helperText={(minRentalHoursError && i18n.t('MIN_RENTAL_HOURS_ERROR')) || ''}
        />
        <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 5, marginHorizontal: 12 }} onPress={props.onClose}>
          <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Search</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      style={{ margin: 0 }}
    >
      <KeyboardAvoidingView
        behavior='padding'
        style={{
            flex: 1,
            marginTop: 100,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            // paddingHorizontal: 12,
            paddingTop: 20,
            paddingBottom: 40,
        }}
      >
        <>
        {nextStep ? <><View
                      style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 20,
                      }}
                  >
                      <View style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: '#F1F1F1',
                        padding: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3
                      }}>
                      <TextInput
                          placeholder='City, airport, address, or train station'
                          placeholderTextColor='#151525'
                          style={{
                              flex: 1,
                              backgroundColor: '#FFFFFF',
                              color: '#010101',
                              padding: 14,
                              borderRadius: 26,
                              fontWeight: '400',
                              fontSize: 12,
                              lineHeight: 14
                          }}
                          value={search}
                          onChangeText={setSearch} />
                      </View>
                      <TouchableOpacity onPress={props.onClose} style={{ marginLeft: 10 }}>
                          <Text style={{ color: '#FF0000', fontSize: 16 }}>Cancel</Text>
                      </TouchableOpacity>
                  </View><FlatList
                          data={data}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }: any) => (
                              <TouchableOpacity
                                  style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingVertical: 12,
                                  }}
                                  onPress={() => {
                                      if (item.id === '1' && props.onSelect) {
                                          props.onSelect(address)
                                          setNextStep(true)
                                        //   props.onClose()
                                      } else if (props.onClose) {
                                          props.onClose()
                                          setNextStep(false)
                                      }
                                  } }
                              >
                                  <Ionicons
                                      name={item.icon}
                                      size={22}
                                      color={colors.primary}
                                      style={{ marginRight: 15 }} />
                                  <View>
                                      <Text style={{ color: '#010101', fontSize: 16 }}>
                                          {item.label}
                                      </Text>
                                      {item.subLabel && (
                                          <Text style={{ color: '#85868F', fontSize: 13 }}>
                                              {item.subLabel}
                                          </Text>
                                      )}
                                  </View>
                              </TouchableOpacity>
                          )} /></> : <BookCarAddress />}
        </>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
    component: {
        alignSelf: 'stretch',
        margin: 10,
      },
    timeComponent: {
        alignSelf: 'stretch',
        marginHorizontal: 10,
        marginBottom: 40,
      }
})

export default SearchModal
