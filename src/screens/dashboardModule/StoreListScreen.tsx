import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Text, Dimensions, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import HeaderComponent from '../../components/HeaderComponent'
import fonts from '../../assets/fonts'
import { getData } from '../../services/apiServices'
import { ENDPOINTS } from '../../services/apiEndPoints'
import { showErrorToast } from '../../components/ToastMessage'
import { ScreenName } from '../../navigation/Screenname'
import Svg, { ClipPath, Defs, Image, Path } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

const StoreListScreen = ({ navigation }) => {
  const [storeList, setStoreList] = useState([])

  useEffect(() => {
    getStoreList()
  }, [])

  const getStoreList = () => {
    getData(ENDPOINTS.stores)
      .then((response) => {
        setStoreList(response?.data || [])
      })
      .catch(() => {
        showErrorToast('Failed to fetch stores.')
      })
  }

  const renderStoreItem = ({ item }) => (
 
    <View style={styles.storeCardContainer}>
      <Svg 
        width={width - 40}
        height={(width - 40) * 189 / 328}
        viewBox="0 0 328 189"
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <ClipPath id={`clip-${item?.id || item?.name}`}>
            <Path d="M0 31.9948C0.0751178 0.0159585 0.0751164 0.0159592 32.3292 0.00278607H293.815C326.929 -0.0329697 326.934 -0.0800168 327.043 24.2904V74.7671C327.095 140.203 327.095 139.262 291.913 140.203H203.484C165.42 139.619 203.484 187.989 164.136 187.989H33.28C0 188.191 0 188.191 0 153.376V31.9948Z" />
          </ClipPath>
        </Defs>

        <Image
          href={{ uri: item?.image }}
          width="100%"
          height="100%"
          clipPath={`url(#clip-${item?.id || item?.name})`}
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
  );


  return (
    <View style={styles.container}>
      <HeaderComponent
        showBackButton
        title="Stores" />
      <FlatList
        data={storeList}
        renderItem={renderStoreItem}
        // contentContainerStyle={{ paddingHorizontal: 20,alignItems: 'center', justifyContent: 'center' }}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

export default StoreListScreen

const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 189 / 328;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  storeCardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT + 20,
    marginBottom: 20,
  },
  viewStoreButton: {
    position: 'absolute',
    right: width * 0.01,
    bottom: height * 0.025,
    backgroundColor: Colors.primary,
    paddingHorizontal: width * 0.085,
    paddingVertical: height * 0.013,
    borderRadius: width * 0.045,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  viewStoreButtonText: {
    color: 'white',
    fontFamily: fonts.PlusJakartaSansRegular,
    fontSize: width * 0.038,
  },
  storeItemSyle: {
    marginBottom: 20,
  },
  storeContainer: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  viewStoreTextStyle: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansRegular,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  itemNameStyle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansSemiBold,
    marginTop: 15
  },
  typeTextStyle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.gray
  }
})
