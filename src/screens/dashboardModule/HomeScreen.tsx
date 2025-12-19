import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { View, Dimensions, StyleSheet, Text, ImageBackground, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Carousel from 'react-native-reanimated-carousel'
import Colors, { CHART_COLORS, } from '../../constants/Colors'
import fonts from '../../assets/fonts'
import { getData } from '../../services/apiServices'
import { ENDPOINTS } from '../../services/apiEndPoints'
import { showErrorToast, showSuccessToast } from '../../components/ToastMessage'
import { ScreenName } from '../../navigation/Screenname'
import { PieChart } from 'react-native-gifted-charts'
import Svg, {
  ClipPath, Defs, LinearGradient, Path, Image as SvgImage,
} from 'react-native-svg'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width, height } = Dimensions.get('window')

const CARD_WIDTH = 320;
const CARD_HEIGHT = 200;

const HomeScreen = ({ navigation }: any) => {

  const [hotDealList, setHotDealList] = useState([])
  const [storeList, setStoreList] = useState([])
  const [statisticsData, setStatisticsData] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('Month')
  const periodTypeArray = ['Day', 'Week', 'Month']
  const periodApiValues: { [key: string]: string } = { 'Day': 'daily', 'Week': 'weekly', 'Month': 'monthly' }
  const [isLoading, setIsLoading] = useState(false)              // for offers & store list
  const [isStatisticsLoading, setIsStatisticsLoading] = useState(false) // for statistics only
 
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
        setStoreList(response?.data || [])
        setIsLoading(false)
      })
      .catch(() => {
        showErrorToast('Failed to fetch stores.')
        setIsLoading(false)
      })
  }

  const getStatistics = (period: string, showSuccess: boolean = false) => {
    setIsStatisticsLoading(true)
    getData(`${ENDPOINTS.statistics}?period=${periodApiValues[period]}&filter=true`)
      .then((response) => {
        setStatisticsData(response?.data || null)
        if (showSuccess) {
          showSuccessToast(`Statistics data updated for ${period}`)
        }
        setIsStatisticsLoading(false)
      })
      .catch(() => {
        showErrorToast('Failed to fetch statistics.')
        setIsStatisticsLoading(false)
      })
  }


  const renderCarouselItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.carouselItemContainer}>
        <ImageBackground
          source={{ uri: item?.image || item?.imageUrl || item?.banner }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      </View>
    ),
    [],
  )

  const renderStoreItem = useMemo(() => ({ item }: any) => (
    <View style={styles.storeItemContainer}>
      <View style={styles.storeImageContainer}>
        <Svg width={190} height={188}>
          <Defs>
            <ClipPath id="clip">
              <Path d="M0 31.9948C0.0436464 0.0159585 0.0436456 0.0159592 18.7845 0.00278607H170.718C189.959 -0.0329697 189.962 -0.0800168 190.025 24.2904V74.7671C190.055 140.203 190.055 139.262 169.613 140.203H97.2376C75.121 139.619 97.2376 187.989 74.3751 187.989H19.337C0 188.191 0 188.191 0 153.376V31.9948Z" />
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

        <TouchableOpacity
          style={styles.viewStoreButton}
          onPress={() => navigation.navigate(ScreenName.StoreDetails, { store: item })}
        >
          <Text style={styles.viewStoreButtonText}>View Store</Text>
        </TouchableOpacity>
      </View>

      {/* Name and category + rating below image */}
      <Text style={styles.itemNameStyle} numberOfLines={1}>
        {item?.name}
      </Text>
      <View style={styles.categoryRow}>
        <Text style={styles.typeTextStyle} numberOfLines={1}>
          {item?.category}
        </Text>
        <Image
          source={require('../../assets/images/rating_image.png')}
          style={styles.ratingImage}
        />
      </View>
    </View>
  ), [navigation])



  const pieData = useMemo(() => {
    if (!statisticsData || !Array.isArray(statisticsData) || statisticsData.length === 0) {
      return []
    }

    return statisticsData.map((item: any, index: number) => ({
      value: Number(item?.percentage) || 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
      text: '',
    }))
  }, [statisticsData])

  const totalPercentage = pieData.reduce((sum, item) => sum + item.value, 0)


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Software Co</Text>
        <Text style={[styles.subtitle, {
          paddingStart: 20,
          marginTop: 20,
        }]}>Hot Deals</Text>

        {
          isLoading ?
            <SkeletonPlaceholder>
              <View
                style={styles.carasoulShimmer}
              />
            </SkeletonPlaceholder>

            :
            hotDealList.length > 0 && (
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
          isLoading ? (
            <SkeletonPlaceholder>
              <View style={styles.storeListShimmerContainer}>
                {[...Array(3).keys()].map((index) => (
                  <View key={index} style={styles.storeItemShimmer} />
                ))}
              </View>
            </SkeletonPlaceholder>
          ) : (
            <View>
              <FlatList
                data={storeList}
                horizontal
                renderItem={renderStoreItem}
                keyExtractor={(_, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
                contentContainerStyle={{ gap: 10, paddingStart: 20, paddingHorizontal: 15 }}
              />
            </View>
          )
        }
        <View style={styles.statisticsHeaderContainer}>
          <Text style={styles.subtitle}>Statistics</Text>
          <View>
            <TouchableOpacity onPress={() => setShowPeriodDropdown(!showPeriodDropdown)
            } style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={styles.viewAllTextStyle}>{`${selectedPeriod}ly`}</Text>
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
                      getStatistics(period, true)
                    }}
                  >
                    <Text style={[styles.periodText, selectedPeriod === period && styles.selectedPeriodText]}>{period}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Chart Container - Centered */}
        <View style={styles.chartContainer}>
          {isStatisticsLoading ? (
            <SkeletonPlaceholder>
              <View style={styles.chartShimmer} />
            </SkeletonPlaceholder>
          ) : pieData.length > 0 ? (
            <PieChart
              data={pieData}
              donut
              radius={120}
              innerRadius={80}
              showText
              textColor="white"
              textSize={12}
              centerLabelComponent={() => (
                <View style={styles.centerLabelContainer}>
                  <Text style={styles.centerText}>
                    ₹ {totalPercentage.toFixed(2)}
                  </Text>
                  <Text style={styles.centerSubText}>Total Sales</Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyChartContainer}>
              <Text style={styles.emptyChartText}>No data available</Text>
            </View>
          )}
        </View>

        {isStatisticsLoading ? (
          <SkeletonPlaceholder>
            <View style={styles.legendShimmerContainer}>
              {[...Array(4).keys()].map((index) => (
                <View key={index} style={styles.legendItemShimmer} />
              ))}
            </View>
          </SkeletonPlaceholder>
        ) : pieData.length > 0 && (
          <View style={styles.legendContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.legendText}>
                  Store {index + 1} ({item.value.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen



const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 150,
    borderRadius: 30,
    overflow: 'hidden',
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
  storeItemContainer: {
    width: 190,
  },
  storeImageContainer: {
    width: 190,
    height: 188,
  },
  viewStoreButton: {
    position: 'absolute',
    right: width * 0.01,
    bottom: height * 0.0001,
    backgroundColor: Colors.primary,
    // paddingHorizontal: width * 0.04,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.03,
    elevation: 4,
  },
  viewStoreButtonText: {
    color: Colors.white,
    fontSize: width * 0.032,
  },
  itemNameStyle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansSemiBold,
    marginTop: 5
  },
  typeTextStyle: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.darkGray
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingImage: {
    width: 60,
    height: 23,
    resizeMode: 'contain',
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
  statisticsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 20,
  },
  centerLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  centerSubText: {
    fontSize: 12,
    color: Colors.darkGray,
    fontFamily: fonts.PlusJakartaSansMedium,
    marginTop: 4,
  },
  emptyChartContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray + '20',
    borderRadius: 120,
  },
  emptyChartText: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: fonts.PlusJakartaSansRegular,
  },
  legendContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
  },
  carasoulShimmer: {
    marginVertical: 10,
    marginHorizontal: 20,
    width: width - 40,
    height: 150,
    borderRadius: 20,
  },
  storeListShimmerContainer: {
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 20,
    gap: 10,
  },
  storeItemShimmer: {
    width: 190,
    height: 188 + 50, 
    borderRadius: 20,
    marginRight: 10,
  },
  chartShimmer: {
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  legendShimmerContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItemShimmer: {
    width: '48%',
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
})