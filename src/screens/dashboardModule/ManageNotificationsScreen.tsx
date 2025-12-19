import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import HeaderComponent from '../../components/HeaderComponent'
import Colors from '../../constants/Colors'
import fonts from '../../assets/fonts'
import { getData } from '../../services/apiServices'
import { ENDPOINTS } from '../../services/apiEndPoints'
import { showErrorToast } from '../../components/ToastMessage'
import { RootState } from '../../redux/store'
import { setNotificationList, toggleMainSwitch, toggleCheckbox } from '../../redux/actions'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { LinearGradient } from 'react-native-svg'

const ManageNotificationsScreen = () => {
  const dispatch = useDispatch()
  const notificationList = useSelector((state: any) => state?.notifications?.notificationList) || []
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only call API if redux state is empty
    if (notificationList?.length === 0) {
      getNotifications()
    }
  }, [])

  const getNotifications = () => {
    setIsLoading(true)
    getData(ENDPOINTS.notifications)
      .then((response) => {
        console.log('response?.data', response?.data)
        dispatch(setNotificationList(response?.data || []))
        setIsLoading(false)
      })
      .catch(() => {
        showErrorToast('Failed to fetch notifications.')
        setIsLoading(false)
      })
  }

  const renderShimmerItem = useMemo(() => () => (
    <ShimmerPlaceholder
      LinearGradient={LinearGradient}
      style={styles.shimmerCard}
      shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
    />
  ), [])

  const handleMainToggle = useCallback((index: number, currentValue: boolean) => {
    dispatch(toggleMainSwitch(index, !currentValue))
  }, [dispatch])

  const handleCheckboxToggle = useCallback((index: number, field: 'pushEnable' | 'emailEnable' | 'smsEnable', isEnabled: boolean) => {
    if (!isEnabled) return // Don't allow toggle if main switch is off
    dispatch(toggleCheckbox(index, field))
  }, [dispatch])

  const memoizedNotificationList = useMemo(() => notificationList || [], [notificationList])

  const renderNotificationItem = ({ item, index }: { item: any, index: number }) => {
    const isEnabled = item?.isEnabled !== false

    return (
      <View style={[styles.cardContainer, !isEnabled && styles.cardDisabled]}>
        <View style={styles.cardContentWithBorder}>
          <View style={styles.textContainer}>
            <Text style={[styles.displayText, !isEnabled && styles.textDisabled]}>{item?.displayText}</Text>
            <Text style={[styles.descriptionText, !isEnabled && styles.textDisabled]}>{item?.description}</Text>
          </View>
          <TouchableOpacity onPress={() => handleMainToggle(index, isEnabled)}>
            <Image
              source={isEnabled
                ? require('../../assets/icons/ic_switch_on.png')
                : require('../../assets/icons/ic_switch_off.png')}
              style={styles.toggleIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.preferenceContainer}>
          <Text style={[styles.preferenceValue, !isEnabled && styles.textDisabled]}>
            {item?.preference || item?.preferenceKey || 'N/A'}
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={[styles.checkboxItem, !isEnabled && styles.checkboxDisabled]}
            onPress={() => handleCheckboxToggle(index, 'pushEnable', isEnabled)}
            disabled={!isEnabled}
          >
            <Image
              source={item?.pushEnable && isEnabled
                ? require('../../assets/icons/ic_checked.png')
                : require('../../assets/icons/ic_unchecked.png')}
              style={[styles.checkboxIcon, !isEnabled && styles.iconDisabled]}
            />
            <Text style={[styles.checkboxLabel, !isEnabled && styles.textDisabled]}>Push</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.checkboxItem, !isEnabled && styles.checkboxDisabled]}
            onPress={() => handleCheckboxToggle(index, 'emailEnable', isEnabled)}
            disabled={!isEnabled}
          >
            <Image
              source={item?.emailEnable && isEnabled
                ? require('../../assets/icons/ic_checked.png')
                : require('../../assets/icons/ic_unchecked.png')}
              style={[styles.checkboxIcon, !isEnabled && styles.iconDisabled]}
            />
            <Text style={[styles.checkboxLabel, !isEnabled && styles.textDisabled]}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.checkboxItem, !isEnabled && styles.checkboxDisabled]}
            onPress={() => handleCheckboxToggle(index, 'smsEnable', isEnabled)}
            disabled={!isEnabled}
          >
            <Image
              source={item?.smsEnable && isEnabled
                ? require('../../assets/icons/ic_checked.png')
                : require('../../assets/icons/ic_unchecked.png')}
              style={[styles.checkboxIcon, !isEnabled && styles.iconDisabled]}
            />
            <Text style={[styles.checkboxLabel, !isEnabled && styles.textDisabled]}>SMS</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        showBackButton
        title="Manage Notifications" />
      {isLoading ? (
        <FlatList
          data={[...Array(4).keys()]}
          renderItem={renderShimmerItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={memoizedNotificationList}
          renderItem={renderNotificationItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  cardDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.8,
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
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.gray,
  },
  textDisabled: {
    color: '#A0A0A0',
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
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  iconDisabled: {
    tintColor: '#A0A0A0',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
  },
  shimmerCard: {
    height: 150,
    borderRadius: 12,
    marginBottom: 15,
  },
})
