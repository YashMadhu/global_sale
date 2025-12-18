import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import fonts from '../assets/fonts';

interface HeaderComponentProps {
  title?: string;
  showBackButton?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  backButton: {
    marginRight: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.primary,
  },
  title: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: fonts.PlusJakartaSansMedium,
    // flex: 1,
    textAlign: 'center',
  },
});

export default HeaderComponent;