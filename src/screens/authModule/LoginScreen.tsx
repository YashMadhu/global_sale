import React, { useRef, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import AppTextInput from '../../components/TextInputComponent'
import Colors from '../../constants/Colors'
import { Screen } from 'react-native-screens'
import { ScreenName } from '../../navigation/Screenname'
import fonts from '../../assets/fonts'
import { showErrorToast, showSuccessToast } from '../../components/ToastMessage'
import { postData } from '../../services/apiServices'
import { ENDPOINTS } from '../../services/apiEndPoints'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState<string>('user1')
  const [password, setPassword] = useState<string>('password')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const onPressLogin = () => {
    if (email.trim().length === 0) {
      showErrorToast('Please enter email')
      return
    }
    if (password.trim().length === 0) {
      showErrorToast('Please enter password')
      return
    }
    else {

      loginApiCall()
    };
    // navigation.replace(ScreenName.BottomTab)
  }


  const loginApiCall = async () => {
    const payload = {

      username: email,
      password: password

    }
    setIsLoading(true)
    postData(ENDPOINTS.login, payload).then(async (response) => {
      console.log('response', response);
      await AsyncStorage.setItem('bearerToken', response.token);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoading(false)
      showSuccessToast('Login successful!')
      navigation.replace(ScreenName.BottomTab)
    }).catch((error) => {
      console.log('error', error);
      setIsLoading(false)
      showErrorToast(error.message)
    })
  }


  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/login_image.png')}
        style={{ width: '100%', height: 200, resizeMode: 'contain', marginBottom: 30 }}
      />
      <AppTextInput
        inputRef={emailRef}

        sourceLeft={require('../../assets/icons/mail.png')}
        placeholder='Email or Mobile Number'
        value={email}
        keyboardType='email-address'
        onChangeText={setEmail}
        returnKeyType='next'
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <AppTextInput
        inputRef={passwordRef}

        sourceLeft={require('../../assets/icons/lock.png')}
        placeholder='Password'
        value={password}
        secureTextEntry={!isPasswordVisible}
        onChangeText={setPassword}
        sourceRight={isPasswordVisible ? require('../../assets/icons/ic_eye.png') : require('../../assets/icons/eye_off.png')}
        onPressRight={() => setIsPasswordVisible(!isPasswordVisible)} />

      <TouchableOpacity
        style={styles.loginButtonStyle}
        onPress={() => onPressLogin()}
        disabled={isLoading}>
        <Text style={{ color: Colors.white, fontFamily: fonts.PlusJakartaSansSemiBold }}>Login</Text>
        {isLoading && <ActivityIndicator color={Colors.white} style={{ marginRight: 10 }} />}
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

  container: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  loginButtonStyle: {
    backgroundColor: Colors.primary, paddingHorizontal: 15,
    paddingVertical: 15, marginTop: 20, alignItems: 'center', borderRadius: 25,
    flexDirection: 'row', justifyContent: 'center'
  }
})


