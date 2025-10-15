import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dataSlice from './slices/dataSlice';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet,
    // To skip `secureSlice` from presistance
    // blacklist: ['secure']    // TODO: uncomment this line
};

const rootReducer = combineReducers({
    data: dataSlice
});


export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware(getDefault) {
        const defaultMiddlewares = getDefault({
            serializableCheck: {
                ignoredActions: [
                    'persist/REGISTER',
                    'persist/REHYDRATE',
                    'persist/PERSIST',
                ],
            },
        })//.concat([sagaMiddleware]);
        // return setupReduxFlipper([...defaultMiddlewares]);
        return defaultMiddlewares;
    },
})



// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store);
export default store;