/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import Colors from './src/constants/Colors';
import ToastMessage from './src/components/ToastMessage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.white} />
      <AppNavigator />
      <ToastMessage/>
    </SafeAreaProvider>
    </PersistGate>
    </Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
