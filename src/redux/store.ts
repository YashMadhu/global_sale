import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationsReducer from './reducer';
import productionItemsReducer from './reducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

// const rootReducer = combineReducers({productionItem: productionItemsReducer});
// const store =  () => {
//   return createStore(rootReducer);
// };


const rootReducer = combineReducers({
  notifications: notificationsReducer,
});

// persist config
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // whitelist: ["userData", "permissions"] // only persist these reducers
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
