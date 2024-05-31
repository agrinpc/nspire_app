import { configureStore, isPlain } from '@reduxjs/toolkit'
import {
  firebaseReducer,
  getFirebase,
  actionTypes as rrfActionTypes,
  FirebaseReducer,
  FirestoreReducer
} from 'react-redux-firebase'
import { firestoreReducer, constants as rfConstants } from 'redux-firestore'
import { User } from '@nspire/interfaces/User'
import searchConfigReducer from './searchConfig/searchConfigReducer'
import favoritesReducer from './favorites/favoritesReducer'
import loadingReducer from './loader/loadingReducer'
import locationGroupReducer from './locationGroup/locationGroupReducer'

const store = configureStore({
  reducer: {
    searchConfig: searchConfigReducer,
    favorites: favoritesReducer,
    locationGroups: locationGroupReducer,
    isLoading: loadingReducer,
    firebase: firebaseReducer, // auth, profile
    firestore: firestoreReducer // data
  },
  // https://redux-toolkit.js.org/usage/usage-guide#use-with-react-redux-firebase
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore "non-serializable value was detected" for dates
        isSerializable: (value: any) =>
          isPlain(value) || value instanceof Date || value instanceof Object,
        ignoredActions: [
          // just ignore every redux-firebase and react-redux-firebase action type
          ...Object.keys(rfConstants.actionTypes).map(
            type => `${rfConstants.actionsPrefix}/${type}`
          ),
          ...Object.keys(rrfActionTypes).map(
            type => `@@reactReduxFirebase/${type}`
          )
        ],
        ignoredPaths: ['firebase', 'firestore']
      },
      thunk: {
        extraArgument: {
          getFirebase
        }
      }
    })
})
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState> & {
  firebase: FirebaseReducer.Reducer<User, {}>
  firestore: FirestoreReducer.Reducer
}
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
