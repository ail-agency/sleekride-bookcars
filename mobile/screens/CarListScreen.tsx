import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable} from 'react-native'
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import i18n from '@/lang/i18n'
import colors from '@/themes/colors'
import * as helper from '@/common/helper'
import * as UserService from '@/services/UserService'
import * as env from '@/config/env.config'
import * as bookcarsTypes from ':bookcars-types'
import * as CarService from '@/services/CarService'

interface CarListProps {
  navigation: NativeStackNavigationProp<StackParams, keyof StackParams>
  from?: Date
  to?: Date
  suppliers?: string[]
  rating?: number
  ranges?: bookcarsTypes.CarRange[]
  multimedia?: bookcarsTypes.CarMultimedia[]
  seats?: number,
  carSpecs?: bookcarsTypes.CarSpecs,
  pickupLocation?: string
  dropOffLocation?: string
  pickupLocationName?: string
  distance?: string
  carType?: string[]
  gearbox?: string[]
  mileage?: string[]
  fuelPolicy?: string[]
  deposit?: number
  header?: React.ReactElement
  cars?: bookcarsTypes.Car[]
  hidePrice?: boolean
  footerComponent?: React.ReactElement
  routeName?: 'Cars' | 'Checkout',
  route: RouteProp<StackParams, keyof StackParams>
  includeAlreadyBookedCars?: boolean
  includeComingSoonCars?: boolean
  onLoad?: bookcarsTypes.DataEvent<bookcarsTypes.Car>
}

// eslint-disable-next-line arrow-body-style
const CarList = ({ title, cars }:any) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={cars}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: `${env.CDN_CARS}/${item.image}` }} style={styles.image} />
            <View style={styles.flexView}>
              <View>
                <Text style={styles.carName}>{item.name}</Text>
                <Text style={styles.rating}>
                  {item.rating} <FontAwesome name='star' color={colors.primary} size={10} /> ({item.trips} trips)
                </Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
              <TouchableOpacity style={styles.bookButton}>
                <AntDesign name='arrowright' color='#fff' size={16} />
              </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.price}>{`${item.deposit}$ / day`}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const BottomCarousel = () => (
  <View style={styles.bottomCarousel}>
    <Image source={require('../assets/bottom.png')} style={{
          width: '100%',
          height: 200
        }} />
  </View>
)

const BottomView = () => (
    <View>
      <View style={styles.alignView}>
        <Text style={styles.title}>Rent Cars Or Driver For Any Occasion</Text>
        <Text style={styles.subTitle}>{'Browse an incredible selection \n of cars with flexibility'}</Text>
      </View>
      <Pressable style={styles.btnExplore}>
      <Text style={styles.txtExplore}>Explore cars</Text>
      </Pressable>
    </View>
  )

const CarListScreen = ({
  navigation,
  from,
  to,
  suppliers,
  rating,
  ranges,
  multimedia,
  seats,
  carSpecs,
  pickupLocation,
  dropOffLocation,
  pickupLocationName,
  distance,
  carType: _carType,
  gearbox,
  mileage,
  fuelPolicy,
  deposit,
  header,
  cars,
  hidePrice,
  footerComponent,
  routeName,
  // route,
  includeAlreadyBookedCars,
  includeComingSoonCars,
  onLoad,
}: CarListProps) => {
const [language, setLanguage] = useState(env.DEFAULT_LANGUAGE)
const [onScrollEnd, setOnScrollEnd] = useState(false)
const [loading, setLoading] = useState(true)
const [fetch, setFetch] = useState(false)
const [rows, setRows] = useState<bookcarsTypes.Car[]>([])
const [page, setPage] = useState(1)
const [refreshing, setRefreshing] = useState(false)

useEffect(() => {
  const init = async () => {
    try {
      const _language = await UserService.getLanguage()
      i18n.locale = _language
      setLanguage(_language)
    } catch (err) {
      helper.error(err)
    }
  }

  init()
}, [])

const fetchData = async () => {
  try {
      const payload: bookcarsTypes.GetCarsPayload = {
        suppliers: [
          '628a51b9572a010c6b5d1a2b',
          '628a51a1572a010c6b5d1a10',
          '628a5297572a010c6b5d1ac8',
          '628a527e572a010c6b5d1aad',
          '628a5244572a010c6b5d1a79',
          '628a5255572a010c6b5d1a92',
          '628a5222572a010c6b5d1a5c',
          '628a52a7572a010c6b5d1ae3'
       ],
        rating: -1,
        ranges: [
          'mini',
          'midi',
          'maxi',
          'scooter'
       ],
        multimedia: [],
        seats: -1,
        carSpecs: {},
        pickupLocation: '628a5461572a010c6b5d1b30',
        carType: [
          'diesel',
          'gasoline',
          'electric',
          'hybrid',
          'plugInHybrid',
          'unknown'
        ],
        gearbox: [
          'automatic',
          'manual'
        ],
        mileage: [
          'limited',
          'unlimited'
        ],
        fuelPolicy: [
          'freeTank',
          'likeForlike',
          'fullToFull',
          'FullToEmpty'
        ],
        deposit: -1,
        includeComingSoonCars: true,
        days: 3,
      }

      const _res = await CarService.getCars(payload, 1, 15)

      const _data = _res && _res.length > 0 ? _res[0] : { pageInfo: { totalRecord: 0 }, resultData: [] }
      if (!_data) {
        helper.error()
        return
      }
      const totalRecords = Array.isArray(_data.pageInfo) && _data.pageInfo.length > 0 ? _data.pageInfo[0].totalRecords : 0
      const _rows = page === 1 ? _data.resultData : [...rows, ..._data.resultData]

      setRows(_rows)

      setFetch(_data.resultData.length === env.CARS_PAGE_SIZE)
      if (onLoad) {
        onLoad({ rows: _data.resultData, rowCount: totalRecords })
      }
  } catch (err) {
    helper.error(err)
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  fetchData() // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

// const numToRender = Math.floor(env.CARS_PAGE_SIZE / 2)

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
      <View>
        <Text style={styles.easy}>{'Easy way to rent a car'}</Text>
        <View style={styles.searchContainer}>
          <Ionicons name='search-outline' size={20} color='#A0A0A0' style={styles.icon} />
          <TextInput
            onPress={() => navigation.navigate('Search', {})}
            style={styles.input}
            placeholderTextColor={'#151525'}
            placeholder='Find your perfect car'
            value=''
          />
        </View>
      </View>
      <CarList title='Recently Viewed' cars={rows} />
      <CarList title='Recommended For You' cars={rows} />
      <BottomCarousel />
      <BottomView />
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, lineHeight: 18 },
  input: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14
  },
  easy: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 23,
    color: '#151525'
  },
  title: { fontSize: 16, fontWeight: '700', lineHeight: 18, color: 'rgba(21, 21, 37, 1)' },
  subTitle: { fontSize: 12, fontWeight: '400', lineHeight: 14, color: 'rgba(133, 134, 143, 1)', textAlign: 'center', marginTop: 10, marginBottom: 20 },
  alignView: { alignItems: 'center', marginVertical: 20 },
  btnExplore: { paddingVertical: 16, backgroundColor: colors.primary, alignItems: 'center', marginHorizontal: 25, borderRadius: 8 },
  txtExplore: { fontSize: 15, fontWeight: '700', lineHeight: 17, color: colors.white },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 20
  },
  flexView: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  icon: {
    marginRight: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 280,
    borderColor: '#F1F1F1',
    borderWidth: 1
  },
  image: { width: '100%', height: 150, borderRadius: 6 },
  carName: { fontSize: 14, fontWeight: '700', marginVertical: 5, lineHeight: 16 },
  rating: { fontSize: 12, color: '#666' },
  price: { fontSize: 14, fontWeight: '700', color: colors.primary, lineHeight: 16, marginTop: 10 },
  bookButton: {
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  bottomCarousel: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  imageList: {
    flexDirection: 'row',
    marginBottom: 20
  },
  contentContainer: {
    width: '100%',
    paddingTop: 80
  },
  logo: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10,
    maxWidth: 480,
  }
})

export default CarListScreen
