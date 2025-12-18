import React, { useEffect, useMemo, useState } from 'react'
import { View, Dimensions, StyleSheet, Text, ImageBackground, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import Colors, { PERIOD_COLORS } from '../../constants/Colors'
import fonts from '../../assets/fonts'
import HeaderComponent from '../../components/HeaderComponent'
import { getData } from '../../services/apiServices'
import { ENDPOINTS } from '../../services/apiEndPoints'
import { showErrorToast } from '../../components/ToastMessage'
import { ScreenName } from '../../navigation/Screenname'
import { PieChart } from 'react-native-gifted-charts'
import Svg, { ClipPath, Defs, LinearGradient, Path,  Image as SvgImage,
} from 'react-native-svg'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
// import SvgImage from 'react-native-svg/lib/typescript/elements/Image'

const { width } = Dimensions.get('window')

const CARD_WIDTH = 320;
const CARD_HEIGHT = 200;

const HomeScreen = ({ navigation }: any) => {

  // ✅ HOOKS MUST BE HERE
  const [hotDealList, setHotDealList] = useState([])
  const [storeList, setStoreList] = useState([])
  const [statisticsData, setStatisticsData] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('Month')
  const periodTypeArray = ['Day', 'Week', 'Month']
  const periodApiValues: { [key: string]: string } = { 'Day': 'daily', 'Week': 'weekly', 'Month': 'monthly' }
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    getStoreList()
    getHotDealList()
    getStatistics(selectedPeriod)
  }, [])

  const getHotDealList = () => {
    setIsLoading(true)  
    getData(ENDPOINTS.offers)
      .then((response) => {
        setHotDealList(response?.data || [])
        console.log('response?.data?.data', response?.data);
        setIsLoading(false)
      })
      .catch(() => {
        showErrorToast('Failed to fetch offers.')
        setIsLoading(false)
      })
  }

  const getStoreList = () => {
    setIsLoading(true)
    getData(ENDPOINTS.stores)
      .then((response) => {
        console.log('store list response:', response?.data)
        setStoreList(response?.data || [])
        setIsLoading(false)
      })
      .catch(() => {
        showErrorToast('Failed to fetch stores.')
        setIsLoading(false)
      })
  }

  const getStatistics = (period: string) => {
    setIsLoading(true)
    getData(`${ENDPOINTS.statistics}?period=${periodApiValues[period]}&filter=true`)
      .then((response) => {
        console.log('statistics response:', response?.data)
        setStatisticsData(response?.data || null)
        setIsLoading(false)
      })
      .catch(() => {
        showErrorToast('Failed to fetch statistics.')
        setIsLoading(false)
      })
  }

  const renderShimmerItem = useMemo(() => () => (
    <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.shimmerItem}
        shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
    />
), []);

  const renderCarouselItem = ({ item }: { item: any }) => (
    <View style={styles.carouselItemContainer}>
      <ImageBackground
        source={{ uri: item?.image || item?.imageUrl || item?.banner }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </View>
  )

  const renderStoreItem = ({ item }: any) => (
<View style={{ width: 190, height: 188,}}>


<Svg width={190} height={188} >
  <Defs>
    <ClipPath id="clip">
      <Path d="M0 0h186.306C188.417 0 190 2.53 190 5.901v73.346c0 59.856-1.583 58.17-32.722 58.17h-55.417c-21.111 0-.528 50.583-22.694 50.583H4.222C1.583 185.471 0 182.942 0 177.04V5.901C0 2.53 1.583 0 3.694 0H0Z" />
    </ClipPath>
  </Defs>

  <SvgImage
    href={{ uri: item?.image || item?.imageUrl || item?.banner }}
    width="100%"
    height="100%"
    clipPath="url(#clip)"
    preserveAspectRatio="xMidYMid slice"
  />



</Svg>
<TouchableOpacity style={{
  position: 'absolute',
  right: 0,
  bottom: -0,
  backgroundColor: Colors.primary,
  paddingHorizontal: 10,
  paddingVertical: 12,
  borderRadius: 12,
  elevation: 4,
}}>
  <Text style={{ color:     Colors.white }}>View Store</Text>
</TouchableOpacity>
</View>
  )


  /* ---------- TRANSFORM DATA FOR CHART ---------- */
  const pieData = useMemo(() => {
    if (!statisticsData || statisticsData.length === 0) return [];
    
    const grouped: { [key: string]: number } = {};

    statisticsData?.forEach((item: any) => {
      if (!grouped[item.period]) {
        grouped[item.period] = 0;
      }
      grouped[item.period] += item.percentage;
    });
  
    return Object.keys(grouped).map(period => ({
      value: grouped[period],
      color: (PERIOD_COLORS as { [key: string]: string })[period] || Colors.gray,
      text: period,
    }));
  }, [statisticsData]);

  /* ---------- TOTAL FOR CENTER ---------- */
  const totalPercentage = pieData.reduce(
    (sum, item) => sum + item.value,
    0,
  );


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} 
      
      contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Software Co</Text>
      <Text style={[styles.subtitle, {
        paddingStart: 20,
      }]}>Hot Deals</Text>

      {hotDealList.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={width}
            height={150}
            autoPlay
            data={hotDealList}
            scrollAnimationDuration={1000}
            renderItem={renderCarouselItem}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <View style={styles.paginationContainer}>
            {hotDealList.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 20, }}>
        <Text style={styles.subtitle}>Stores</Text>
        <TouchableOpacity onPress={() => navigation.navigate(ScreenName.StoreList)}>
          <Text style={styles.viewAllTextStyle}>View All</Text>
        </TouchableOpacity>
      </View>
        {
          isLoading ?
          <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          contentContainerStyle={{ paddingStart: 20, marginTop: 15 }}
          data={[...Array(3).keys()]}
          renderItem={renderShimmerItem}
          removeClippedSubviews={false}
        />:
        <View>
        <FlatList
          data={storeList}
          horizontal
          renderItem={renderStoreItem}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
          contentContainerStyle={{ gap: 10, paddingStart: 20 }}
        />
        </View>
        }
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 20, }}>
        <Text style={styles.subtitle}>Statistics</Text>
        <View>
          <TouchableOpacity onPress={() => setShowPeriodDropdown(!showPeriodDropdown)
          } style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={styles.viewAllTextStyle}>{selectedPeriod}</Text>
            <Image source={require('../../assets/icons/ic_expand.png')} style={{ transform: [{ rotate: showPeriodDropdown ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
          {showPeriodDropdown && (
            <View style={styles.periodDropdown}>
              {periodTypeArray.map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[styles.periodItem, selectedPeriod === period && styles.selectedPeriodItem]}
                  onPress={() => {
                    setSelectedPeriod(period)
                    setShowPeriodDropdown(false)
                    getStatistics(period)
                  }}
                >
                  <Text style={[styles.periodText, selectedPeriod === period && styles.selectedPeriodText]}>{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

       {/* <PieChart
        data={statisticsData}
        donut
        // You can customize the radius, innerRadius, and other props
        radius={120} // Outer radius of the donut
        innerRadius={80} // Inner radius to create the 'donut' effect
        showText // Optional: displays text from the data object
        centerLabelComponent={() => {
          return <Text style={{fontSize: 20}}>71%</Text>; // Example of a custom center label
        }}
        // Add animation prop for animated charts
        // animationDuration={1000} 
      /> */}

<PieChart
        data={pieData}
        donut
        radius={120}
        innerRadius={80}
        showText
        textColor="white"
        textSize={12}
        centerLabelComponent={() => (
          <Text style={styles.centerText}>
            {totalPercentage.toFixed(1)}%
          </Text>
        )}
      />

      {/* ---------- LEGEND ---------- */}
      <View style={styles.legendContainer}>
        {pieData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {backgroundColor: item.color},
              ]}
            />
            <Text style={styles.legendText}>
              {item.text} ({item.value.toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen



const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  title: {
    paddingStart: 20,
    color: Colors.black,
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    marginVertical: 10
  },
  subtitle: {
    color: Colors.black,
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansSemiBold,
  },
  viewAllTextStyle: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  storeContainer: {
    backgroundColor: Colors.gray,
    // width: 100,
    height: 150,
    borderRadius: 30,
    overflow: 'hidden',
    // marginRight: 15,
  },
  shimmerItem: {
    width: 190,
    height: 188,
    borderRadius: 20,
    marginRight: 10,
  },
  viewStoreTextStyle: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansRegular,
    // position: 'absolute',
    // bottom: 10,
    // right: 10,
    // borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // backgroundColor: Colors.primary
  },
  storeItemSyle: {

  },
  itemNameStyle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansSemiBold,
    marginTop: 5
  },
  typeTextStyle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.gray
  },
  carouselContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: width - 40,
    height: 150,
    borderRadius: 20,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 30,
  },
  inactiveDot: {
    backgroundColor: Colors.gray,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  periodDropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
    minWidth: 100,
  },
  periodItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  selectedPeriodItem: {
    backgroundColor: Colors.primary + '20',
  },
  periodText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
  },
  selectedPeriodText: {
    color: Colors.primary,
    fontFamily: fonts.PlusJakartaSansSemiBold,
  },
  centerText: {
    fontSize: 20,
    fontWeight: '700',
  },
  legendContainer: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
})