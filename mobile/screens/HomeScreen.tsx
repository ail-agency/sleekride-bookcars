import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  Animated
} from 'react-native'
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
import SearchModal from '@/components/SearchModal'
import { getHeaderHeight, getSize } from '@/utils/scale'

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

const HomeScreen = ({
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
const [modalVisible, setModalVisible] = useState(false)
const [address, setAddress] = useState('')

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

const Header = () => (
  <View style={[styles.header, { height: getHeaderHeight() }]}>
  </View>
)

  return (
    <View style={{ flex: 1, backgroundColor: '#121214' }}>
      <Header/>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, zIndex: 1 }}>
        <View style={styles.container}>
        <View>
          <Text style={styles.easy}>{'Easy way to rent a car'}</Text>
            <Pressable style={styles.searchContainer} onPress={() => setModalVisible(true)}>
              <Ionicons name='search-outline' size={20} color='#A0A0A0' style={styles.icon} />
              <Text
                style={styles.input}
              >{'Find your perfect car'}</Text>
            </Pressable>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Recently Viewed'}</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={rows}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card}>
                {/* <Image source={{ uri: `${env.CDN_CARS}/${item.image}` }} style={styles.image} /> */}
                <Image source={require('../assets/m4.png')} style={styles.image} />
                <View style={styles.flexView}>
                  <View>
                    <Text style={styles.carName}>{item.name}</Text>
                    <Text style={styles.rating}>
                      {item.rating} <FontAwesome name='star' color={'#675cfe'} size={10} /> ({item.trips} trips)
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
        <BottomCarousel />
        <BottomView />
      </View>
      </ScrollView>
      {modalVisible && (
        <SearchModal navigation={navigation} isVisible={modalVisible} onClose={() => setModalVisible(false)}/>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#121114',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 25 : 0
  },
  container: { flex: 1, backgroundColor: '#121114', padding: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, lineHeight: 18, color: '#fff' },
  input: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 14
  },
  easy: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 23,
    color: '#fff'
  },
  title: { fontSize: 16, fontWeight: '700', lineHeight: 18, color: '#fff' },
  subTitle: { fontSize: 12, fontWeight: '400', lineHeight: 14, color: '#fff', textAlign: 'center', marginTop: 10, marginBottom: 20 },
  alignView: { alignItems: 'center', marginVertical: 20 },
  btnExplore: { paddingVertical: 16, backgroundColor: '#675cfe', alignItems: 'center', marginHorizontal: 25, borderRadius: 8 },
  txtExplore: { fontSize: 15, fontWeight: '700', lineHeight: 17, color: colors.white },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.borderInput,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 20
  },
  flexView: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 10 },
  icon: {
    // marginRight: 10,
  },
  card: {
    backgroundColor: 'rgba(30,29,30,255)',
    borderRadius: 10,
    marginRight: 10,
    width: getSize.s(320),
    height: getSize.v(260),
    borderColor: '#3e3f41',
    borderWidth: 1
  },
  image: { width: '100%', height: 200, borderTopLeftRadius: 6, borderTopRightRadius: 6, resizeMode: 'cover' },
  carName: { fontSize: 14, fontWeight: '700', marginVertical: 5, lineHeight: 16, color: '#fff' },
  rating: { fontSize: 12, color: '#fff' },
  price: { fontSize: 14, fontWeight: '700', color: '#fff', lineHeight: 16, marginTop: 10, paddingHorizontal: 10, textAlign: 'right' },
  bookButton: {
    backgroundColor: '#675cfe',
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

export default HomeScreen
