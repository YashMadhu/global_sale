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

const { width } = Dimensions.get('window')

const StoreListScreen = ({navigation}) => {
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
    // <View style={styles.storeItemSyle}>
    //         <View style={styles.storeContainer}>
    //             <ImageBackground
    //                 source={{ uri: item.image }}
    //                 style={{
    //                     width: '100%',
    //                     height: 180,
    //                     borderRadius: 30,
    //                     overflow: 'hidden',
    //                 }}
    //             />
    //             <TouchableOpacity onPress={() => navigation.navigate(ScreenName.StoreDetails, { store: item })}>
    //             <Text style={styles.viewStoreTextStyle}>View Store</Text>
    //             </TouchableOpacity>
    //         </View>

    //         <View>
    //             <Text style={styles.itemNameStyle}>{item?.name}</Text>
    //             <Text style={styles.typeTextStyle}>{item?.category}</Text>
    //         </View>
    //     </View>
   
<View style={{ width: 328, height: 189,marginBottom: 20 }}>


<Svg width={328} height={189} >
  <Defs>
    <ClipPath id="clip">
      <Path d="M0.740542 27.2022C1.30044 1.11069 1.85939 1.66557 43.7998 0H296.779C325.08 0.269459 326.43 1.61957 327 30.4038V74.9743C327 141.635 324.163 139.757 288.729 140.066H217.84C179.979 139.483 217.84 187.747 178.702 187.747H38.1791C1.19262 188.677 1.19262 188.677 0 157.291L0.740542 27.2022Z" />
    </ClipPath>
  </Defs>

  <Image
    href={{ uri: item?.image }}
    width="100%"
    height="100%"
    clipPath="url(#clip)"

    preserveAspectRatio="xMidYMid slice"
  />



</Svg>
<TouchableOpacity style={{
  position: 'absolute',
  right: 10,
  bottom: -0,
  backgroundColor: Colors.primary,
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 12,
  elevation: 4,
}}>
  <Text style={{ color: 'white' }}>View Store</Text>
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
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

export default StoreListScreen

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
