import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Keyboard, Text, FlatList, TextInput, ActivityIndicator } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { addHours } from 'date-fns'
import { Ionicons } from '@expo/vector-icons'
import _ from 'lodash'
import * as env from '@/config/env.config'
import i18n from '@/lang/i18n'
import * as UserService from '@/services/UserService'
import * as helper from '@/common/helper'
import DateTimePicker from '@/components/DateTimePicker'
import colors from '@/themes/colors'
import * as LocationService from '@/services/LocationService'

export interface SearchFormProps {
  navigation: NativeStackNavigationProp<StackParams, keyof StackParams>,
  pickupLocation?: string
  dropOffLocation?: string
  pickupLocationText?: string,
  dropOffLocationText?: string
  fromDate?: Date,
  fromTime?: Date,
  toDate?: Date,
  toTime?: Date,
  backgroundColor?: string
  size?: 'small',
  onClose?: () => void
}

type IAddress = {
  id: string,
  title?: string | null
}

const SearchForm = (
  {
    navigation,
    pickupLocation,
    dropOffLocation,
    pickupLocationText,
    dropOffLocationText,
    fromDate: __fromDate,
    fromTime: __fromTime,
    toDate: __toDate,
    toTime: __toTime,
    backgroundColor = '#F5F5F5',
    size,
    onClose
  }:
    SearchFormProps
) => {
  const isFocused = useIsFocused()

  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<IAddress[]>()
  const [pickupLocationId, setPickupLocationId] = useState(pickupLocation || '')
  const [dropOffLocationId, setDropOffLocationId] = useState(dropOffLocation || '')
  const [sameLocation, setSameLocation] = useState(pickupLocation === dropOffLocation)
  const [closePickupLocation, setClosePickupLocation] = useState(false)
  const [closeDropOffLocation, setCloseDropOffLocation] = useState(false)
  const [loading, setLoading] = useState(false)

  const [language, setLanguage] = useState(env.DEFAULT_LANGUAGE)
  const [blur, setBlur] = useState(false)
  const [fromMinDate, setFromMinDate] = useState<Date | undefined>()
  const [minDate, setMinDate] = useState<Date | undefined>()
  const [fromDate, setFromDate] = useState<Date | undefined>()
  const [fromTime, setFromTime] = useState<Date | undefined>()
  const [toDate, setToDate] = useState<Date | undefined>()
  const [toTime, setToTime] = useState<Date | undefined>()
  const [init, setInit] = useState(false)
  const [visible, setVisible] = useState(false)
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
    if (pickupLocation) {
      setPickupLocationId(pickupLocation)
    }
  }, [pickupLocation])

  const _init = async () => {
    const _language = await UserService.getLanguage()
    i18n.locale = _language
    setLanguage(_language)

    Keyboard.addListener('keyboardDidHide', () => {
      setBlur(true)
    })

    const _fromDate = __fromDate || new Date()
    if (!__fromDate) {
      if (env.MIN_PICK_UP_HOURS < 72) {
        _fromDate.setDate(_fromDate.getDate() + 3)
      } else {
        _fromDate.setDate(_fromDate.getDate() + Math.ceil(env.MIN_PICK_UP_HOURS / 24) + 1)
      }
      _fromDate.setHours(0)
      _fromDate.setMinutes(0)
      _fromDate.setSeconds(0)
      _fromDate.setMilliseconds(0)
    }

    const _fromTime = __fromTime || new Date(_fromDate)
    if (!__fromTime) {
      _fromTime.setHours(10)
    }

    const _toDate = __toDate || new Date(_fromDate)
    if (!__toDate) {
      if (env.MIN_RENTAL_HOURS < 72) {
        _toDate.setDate(_toDate.getDate() + 3)
      } else {
        _toDate.setDate(_toDate.getDate() + Math.ceil(env.MIN_RENTAL_HOURS / 24) + 1)
      }
    }

    const _toTime = __toTime || new Date(_toDate)
    if (!__toTime) {
      _toTime.setHours(10)
    }

    let _minDate = new Date(_fromDate)
    _minDate = addHours(_minDate, env.MIN_RENTAL_HOURS)

    setMinDate(_minDate)
    setFromDate(_fromDate)
    setFromTime(_fromTime)
    setToDate(_toDate)
    setToTime(_toTime)

    let __minDate = new Date()
    __minDate = addHours(__minDate, env.MIN_PICK_UP_HOURS)
    setFromMinDate(__minDate)

    setInit(true)
    setVisible(true)
  }

  useEffect(() => {
    if (isFocused) {
      _init()
    } else {
      setVisible(false)
    }
  }, [isFocused]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePickupLocationSelect = (_pickupLocation: string) => {
    setPickupLocationId(_pickupLocation)
    if (sameLocation) {
      setDropOffLocationId(_pickupLocation)
    }
  }

  const handleDropOffLocationSelect = (_dropOffLocation: string) => {
    setDropOffLocationId(_dropOffLocation)
  }

  const blurLocations = () => {
    setBlur(true)
    setClosePickupLocation(true)
    setCloseDropOffLocation(true)
  }

  const handleTouchableOpacityClick = () => {
    blurLocations()
  }

  const handleSameLocationChange = (checked: boolean) => {
    setSameLocation(checked)
    blurLocations()
    if (checked) {
      setDropOffLocationId(pickupLocationId)
    } else {
      setDropOffLocationId('')
    }
  }

  const handleSearch = () => {
    blurLocations()

    if (!pickupLocationId) {
      helper.toast(i18n.t('PICKUP_LOCATION_EMPTY'))
      return
    }

    if (!dropOffLocationId) {
      helper.toast(i18n.t('DROP_OFF_LOCATION_EMPTY'))
      return
    }

    if (!fromDate) {
      helper.toast(i18n.t('FROM_DATE_EMPTY'))
      return
    }

    if (!fromTime) {
      helper.toast(i18n.t('FROM_TIME_EMPTY'))
      return
    }

    if (!toDate) {
      helper.toast(i18n.t('TO_DATE_EMPTY'))
      return
    }

    if (!toTime) {
      helper.toast(i18n.t('TO_TIME_EMPTY'))
      return
    }

    const now = Date.now()
    const from = helper.dateTime(fromDate, fromTime)
    const to = helper.dateTime(toDate, toTime)

    if (from.getTime() - now < env.MIN_PICK_UP_HOURS * 60 * 60 * 1000) {
      setMinPickupHoursError(true)
      return
    }

    if (to.getTime() - from.getTime() < env.MIN_RENTAL_HOURS * 60 * 60 * 1000) {
      setMinRentalHoursError(true)
      return
    }

    const params = {
      pickupLocation: pickupLocationId,
      dropOffLocation: dropOffLocationId,
      from: from.getTime(),
      to: to.getTime(),
      d: now
    }
    navigation.navigate('Cars', params)
  }

  const onChangeText = async (text: string) => {
    setSearch(text)
    await fetchData(text)
  }

  const fetchData = async (text: string) => {
      try {
        setLoading(true)
        const _response = await LocationService.getLocations(text, 1, env.PAGE_SIZE)
        const _data = _response && _response.length > 0 ? _response[0] : { pageInfo: { totalRecord: 0 }, resultData: [] }
        if (!_data) {
          helper.error()
          return
        }
        const _rows = _data.resultData.map((location) => ({
          id: location._id,
          title: location.name || '',
        }))
        setRows(_rows)
      } catch (err) {
        helper.error(err)
      } finally {
        setLoading(false)
      }
    }

  const DefaultSearch = () => (
    <FlatList
            data={rows}
            style={{ width: '100%', maxWidth: 480, paddingHorizontal: 12 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: any) => (
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                    }}
                    onPress={() => {
                      handlePickupLocationSelect(item.id)
                      setSearch(item.title)
                      setNextStep(true)
                    } }
                >
                    <View style={{ padding: 10, backgroundColor: '#545454', marginRight: 10, borderRadius: 6 }}>
                      <Ionicons
                          name={'location-outline'}
                          size={22}
                          color={'#fff'}/>
                    </View>
                    <View>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
                            {item.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            )} />
  )

  const SuggestionLocation = () => (
    <FlatList
            data={data}
            style={{ width: '100%', maxWidth: 480, paddingHorizontal: 12 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: any) => (
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                    }}
                    onPress={() => {
                        if (item.id === '1') {
                            // setNextStep(true)
                          //   props.onClose()
                        } else {
                            // props.onClose()
                            // setNextStep(false)
                        }
                    } }
                >
                    <View style={{ padding: 10, backgroundColor: '#545454', marginRight: 10, borderRadius: 6 }}>
                      <Ionicons
                          name={item.icon}
                          size={22}
                          color={'#fff'}/>
                    </View>
                    <View>
                        <Text style={{ color: '#fff', fontSize: 16 }}>
                            {item.label}
                        </Text>
                        {item.subLabel && (
                            <Text style={{ color: '#85868F', fontSize: 13 }}>
                                {item.subLabel}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
            )} />
  )

  // eslint-disable-next-line arrow-body-style
  const DatePickerComp = () => {
    return (
      <>
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
          } }
          onPress={blurLocations}
          backgroundColor={backgroundColor} /><DateTimePicker
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
            } }
            onPress={blurLocations}
            backgroundColor={backgroundColor}
            error={minPickupHoursError}
            helperText={(minPickupHoursError && i18n.t('MIN_PICK_UP_HOURS_ERROR')) || ''} /><DateTimePicker
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
            } }
            onPress={blurLocations}
            backgroundColor={backgroundColor} /><DateTimePicker
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
            } }
            onPress={blurLocations}
            backgroundColor={backgroundColor}
            error={minRentalHoursError}
            helperText={(minRentalHoursError && i18n.t('MIN_RENTAL_HOURS_ERROR')) || ''} />
          <TouchableOpacity onPress={handleSearch} style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8, marginHorizontal: 12, marginTop: 10 }}>
            <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>{'Search'}</Text>
          </TouchableOpacity>
        </>
    )
  }

  return (
    init && visible && (
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            opacity: 0,
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
          }}
          onPress={handleTouchableOpacityClick}
        />
        <View style={styles.searchContainer}>
          <TextInput
            onChangeText={(text:string) => onChangeText(text)}
            style={styles.input}
            placeholderTextColor={'707071'}
            placeholder='City, airport, address or train station'
            value={search}
          />
        </View>
        {(_.isEmpty(search) && _.isEmpty(rows) && _.isEmpty(pickupLocationId)) ? <SuggestionLocation/> : (!_.isEmpty(pickupLocationId) && !!nextStep) ? <DatePickerComp /> : <DefaultSearch />}
      </View>
    )
  )
}

const styles = StyleSheet.create({
  // master: {
  //   flex: 1,
  // },
  // container: {
  //   flexGrow: 1,
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   paddingTop: 20,
  //   paddingBottom: 10,
  // },
  searchContainer: {
    backgroundColor: colors.bgInput,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.borderInput,
    marginHorizontal: 12,
    marginVertical: 20
  },
  input: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#fff'
  },
  icon: {
    marginRight: 10,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 480,
  },
  component: {
    alignSelf: 'stretch',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  timeComponent: {
    alignSelf: 'stretch',
    marginHorizontal: 10,
    marginBottom: 40,
  },
})

export default SearchForm
