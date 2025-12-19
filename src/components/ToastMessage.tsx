
import React from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import fonts from '../assets/fonts';
import Colors from '../constants/Colors';

const NUMBER_OF_TOAST_MESSAGE_LINES = 5;

const ToastMessage = () => {
  const toastConfig = {
    error: (props: any) => (
      <BaseToast
        {...props}
        text2NumberOfLines={NUMBER_OF_TOAST_MESSAGE_LINES}
        style={[styles.toastErrorStyle, styles.toastStyle,{paddingHorizontal:10}]}
        contentContainerStyle={[styles.toastContentContainer,{height:'100%'}]}
        text2Style={[styles.toastMessage,{color:Colors.error}]}
      />
    ),
    success: (props: any) => (
      <BaseToast
        {...props}
        text2NumberOfLines={NUMBER_OF_TOAST_MESSAGE_LINES}
        style={[styles.toastSuccessStyle, styles.toastStyle]}
        contentContainerStyle={[styles.toastContentContainer,{height:'100%'}]}
        text2Style={[styles.toastMessage,{color:Colors.success}]}
      />
    ),
  };

  return <Toast config={toastConfig} position={'bottom'} bottomOffset={40} />;
};
const styles = StyleSheet.create({
  toastErrorStyle: {
    borderLeftColor: Colors.error,
  },
  toastStyle: {
    height: '100%',
  },
  toastContentContainer: {
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  toastMessage: {
    fontSize: 14,
    lineHeight: 17.57,
    fontFamily:fonts.PlusJakartaSansMedium,
  },
  toastSuccessStyle: {
    borderLeftColor: Colors.success,
  },

});

export const showErrorToast = (message: string) => {
  Toast.show({
    type: 'error',
    text2: message,
  });
};

export const showSuccessToast = (message: string) => {
  Toast.show({
    type: 'success',
    text2: message,
  });
};

export default ToastMessage;
