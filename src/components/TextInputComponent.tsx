import React, { FC, LegacyRef, ReactElement, useContext } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  PressableProps,
  Text,
  ViewStyle,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
  Image,
} from 'react-native';
import Colors from '../constants/Colors';
import fonts from '../assets/fonts';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  blurOnSubmit?: boolean,
  mainTextinputStyle?: ViewStyle;
  sourceRight?: string;
  rightIconWidth?: number,
  rightIconHeight?: number,
  onPressRight?: () => void;
  onPressLeft?: () => void;
  sourceLeft?: any;
  inputRef?: any
  onPressIn?: () => void;
  containerStyle?: any;
  isSelectedRightIcon?: boolean;
  TextInputRight?: ReactElement;
  superSecureTextEntry?: boolean;
  errorMessage?: string;
  textInputStyle?: TextStyle;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  onFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined;
  onBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined;
  keyboardType?: any,
  labelStyle?: TextStyle;
  labelRight?: string,
  focused?: boolean,
}

const AppTextInput: FC<AppTextInputProps> = ({
  label,
  placeholder,
  placeholderTextColor,
  secureTextEntry = Platform.select({ ios: false, android: false }),
  editable,
  value,
  onChangeText,
  multiline,
  blurOnSubmit,
  mainTextinputStyle,
  returnKeyType,
  onSubmitEditing,
  inputRef,
  maxLength,
  autoCapitalize = 'none',
  sourceRight,
  rightIconWidth,
  rightIconHeight,
  onPressRight,
  onPressLeft,
  sourceLeft,
  onPressIn,
  containerStyle,
  isSelectedRightIcon,
  TextInputRight,
  errorMessage,
  onLayout,
  onFocus,
  onBlur,
  keyboardType,
  textInputStyle,
  labelStyle,
  labelRight,
  focused
}) => {


  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {label && (
          <Text numberOfLines={1} style={[styles.label, labelStyle]}>
            {label}
          </Text>
        )}
        {labelRight && (
          <Text numberOfLines={1} style={[styles.label, labelStyle]}>
            {labelRight}
          </Text>
        )}
      </View>
      <View style={[styles.textInputView, mainTextinputStyle, { borderColor: focused ? Colors.black : Colors.gray }]}>
        {sourceLeft && <Pressable onPress={onPressLeft}>
          <Image
            style={styles.iconContainer}
            source={sourceLeft} />
        </Pressable>}
        <TextInput
          placeholder={placeholder}
          style={[styles.textinput, textInputStyle]}
          placeholderTextColor={Colors.gray}
          secureTextEntry={secureTextEntry}
          editable={editable}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          blurOnSubmit={blurOnSubmit}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          onPressIn={onPressIn}
          autoComplete={'off'}
          autoCorrect={false}
          onLayout={onLayout}
        />
        {TextInputRight && TextInputRight}
        {sourceRight && <Pressable style={{ padding: 5 }} onPress={onPressRight}>
           <Image
            style={styles.iconContainer}
            source={sourceRight} />
            </Pressable>}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    // fontFamily: fonts.openSansMedium,
  },
  textInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical:5,
    // backgroundColor: APP_COLORS.lightGray,
    // height: 45,
    borderWidth: 0.8,
    zIndex: 2,
  },
  textinput: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    flex: 1,
    paddingLeft:10
    // width: '100%',
    // height: '100%',
  },
  iconContainer: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  }
});




export default AppTextInput;
