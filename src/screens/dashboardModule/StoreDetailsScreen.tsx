import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, StatusBar, Platform, Image, TouchableOpacity } from 'react-native'
import { getData } from '../../services/apiServices'
import { ENDPOINTS } from '../../services/apiEndPoints'
import { showErrorToast } from '../../components/ToastMessage'
import Colors from '../../constants/Colors'
import HeaderComponent from '../../components/HeaderComponent'
import fonts from '../../assets/fonts'

const StoreDetailsScreen = ({ navigation, route }: any) => {
  const { store } = route.params
  const [storeDetails, setStoreDetails] = useState<any>(null)

  useEffect(() => {
    getStoreDetails()
  }, [])

  const getStoreDetails = () => {
    const storeId = store?._id
    if (!storeId) {
      showErrorToast('Store ID is missing.')
      return
    }

    getData(`${ENDPOINTS.stores}/${storeId}`)
      .then((response) => {
        setStoreDetails(response?.data || null)
      })
      .catch(() => {
        showErrorToast('Failed to fetch store details.')
      })
  }

  const statusBarHeight = Platform.OS === 'android'
    ? StatusBar.currentHeight || 0
    : Platform.OS === 'ios'
      ? 44
      : 0

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />
      {storeDetails?.image && (
        <ImageBackground
          source={{ uri: storeDetails.image }}
          style={[styles.storeImage, { marginTop: -statusBarHeight, paddingTop: statusBarHeight }]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerContainer}>
            <Image source={require('../../assets/icons/back.png')} style={{
              width: 24,
              height: 24,
              tintColor: Colors.white,
            }} />
          </TouchableOpacity>
          <View style={styles.storeDetailsContainer}>
            <Text style={styles.itemNameStyle}>{storeDetails.name}</Text>
            <Text style={styles.typeTextStyle}>{storeDetails.category}</Text>
          </View>
        </ImageBackground>
      )}
      {storeDetails && (
        <View style={{
          paddingHorizontal: 20,
        }}>
          <View style={styles.storeInfoContainer}>
            <Text style={styles.storeLabel}>Store</Text>
            <View style={styles.locationContainer}>
              <Image
                source={require('../../assets/icons/ic_location.png')}
                style={styles.locationIcon}
              />
              <Text style={styles.locationText}>
                {storeDetails?.location?.address}
              </Text>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <Text style={styles.mapLabel}>Map</Text>
            <Image
              source={require('../../assets/images/map_image.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default StoreDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,

  },
  storeImage: {
    width: '100%',
    height: 250,
  },
  headerContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  storeDetailsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  itemNameStyle: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: Colors.white,
    textAlign: 'center',
  },
  typeTextStyle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.white,
    textAlign: 'center',
    marginTop: 8,
  },
  storeInfoContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  storeLabel: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: Colors.black,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.primary,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
    flex: 1,
  },
  mapContainer: {
    paddingVertical: 20,
  },
  mapLabel: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: Colors.black,
    marginBottom: 12,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
  }
})