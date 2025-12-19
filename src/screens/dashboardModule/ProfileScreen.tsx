import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import HeaderComponent from '../../components/HeaderComponent'
import Colors from '../../constants/Colors'
import fonts from '../../assets/fonts'
import { ScreenName } from '../../navigation/Screenname'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ProfileScreen = ({navigation}: any) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    setShowLogoutModal(false)
    await AsyncStorage.clear()
    await AsyncStorage.setItem('bearerToken', '')
    await AsyncStorage.setItem('isLoggedIn', 'false')
    navigation.reset({
      index: 0,
      routes: [{ name: ScreenName.Login }],
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <HeaderComponent
            showBackButton
            title="Profile" />
        </View>
        <TouchableOpacity onPress={() => setShowLogoutModal(true)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate(ScreenName.AudioRecording)}
      >
        <View style={styles.menuItemContent}>
          <Image 
            source={require('../../assets/icons/ic_microphone.png')} 
            style={styles.menuIcon}
          />
          <Text style={styles.headerTextStyle}>Audio Recording</Text>
        </View>
        <Image 
          source={require('../../assets/icons/ic_right_arrow.png')} 
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.menuItem,{
          borderTopWidth: 1,
          borderTopColor: Colors.gray,
        }]}
        onPress={() => navigation.navigate(ScreenName.ManageNotifications)}
      >
        <View style={styles.menuItemContent}>
          <Image 
            source={require('../../assets/icons/ic_notification.png')} 
            style={styles.menuIcon}
          />
          <Text style={styles.headerTextStyle}>Manage Notifications</Text>
        </View>
        <Image 
          source={require('../../assets/icons/ic_right_arrow.png')} 
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalButtonNo}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonNoText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonYes}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonYesText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ProfileScreen


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: Colors.red,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    // paddingHorizontal: 15,
  
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: Colors.primary,
  },
  headerTextStyle: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: Colors.black,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: Colors.black,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonNo: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    alignItems: 'center',
  },
  modalButtonNoText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: Colors.black,
  },
  modalButtonYes: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalButtonYesText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: Colors.white,
  },
});