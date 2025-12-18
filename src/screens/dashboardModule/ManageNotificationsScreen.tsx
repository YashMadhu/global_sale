import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Switch, Image, TouchableOpacity } from 'react-native'
import HeaderComponent from '../../components/HeaderComponent'
import Colors from '../../constants/Colors'
import fonts from '../../assets/fonts'
import { getData } from '../../services/apiServices'
import { ENDPOINTS } from '../../services/apiEndPoints'
import { showErrorToast } from '../../components/ToastMessage'

const ManageNotificationsScreen = () => {
  const [notificationList, setNotificationList] = useState([])

  useEffect(() => {
    getNotifications()
  }, [])

  const getNotifications = () => {
    getData(ENDPOINTS.notifications)
      .then((response) => {
        console.log('response?.data',response?.data);
       setNotificationList(response?.data || [])
      })
      .catch(() => {
        showErrorToast('Failed to fetch notifications.')
      })
  }

  const renderNotificationItem = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardContentWithBorder}>
        <View style={styles.textContainer}>
          <Text style={styles.displayText}>{item?.displayText}</Text>
          <Text style={styles.descriptionText}>{item?.description}</Text>
        </View>
        <Image
          source={require('../../assets/icons/ic_switch_on.png')}
          style={styles.toggleIcon}
        />
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceValue}>{item?.preference || item?.preferenceKey || 'N/A'}</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkboxItem}>
          <Image
            source={item?.pushEnable 
              ? require('../../assets/icons/ic_checked.png')
              : require('../../assets/icons/ic_unchecked.png')}
            style={styles.checkboxIcon}
          />
          <Text style={styles.checkboxLabel}>Push</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxItem}>
          <Image
            source={item?.emailEnable 
              ? require('../../assets/icons/ic_checked.png')
              : require('../../assets/icons/ic_unchecked.png')}
            style={styles.checkboxIcon}
          />
          <Text style={styles.checkboxLabel}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxItem}>
          <Image
            source={item?.smsEnable 
              ? require('../../assets/icons/ic_checked.png')
              : require('../../assets/icons/ic_unchecked.png')}
            style={styles.checkboxIcon}
          />
          <Text style={styles.checkboxLabel}>SMS</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <HeaderComponent
        showBackButton
        title="Manage Notifications" />
      <FlatList
        data={notificationList}
        renderItem={renderNotificationItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

export default ManageNotificationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: Colors.white,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContentWithBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingBottom: 15,
  },
  preferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  preferenceLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
  },
  preferenceValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: Colors.primary,
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  displayText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansSemiBold,
    color: Colors.black,
    // marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.gray,
  },
  toggleIcon: {
    width: 40,
    height: 20,
    resizeMode: 'contain',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    gap: 20,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
  },
})

