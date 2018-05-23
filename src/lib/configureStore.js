'use strict';

import {createStore, applyMiddleware} from 'redux';
import reducers from '../reducers';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import {AsyncStorage} from 'react-native';
import thunk from 'redux-thunk';

const config = {
  key: 'root', // key is required
  storage, // storage is now required
  blacklist: ['merchants']
}
const reducer = persistReducer(config, reducers);
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default function configureStore(onComplete) {
  let store = createStoreWithMiddleware(reducer)
  let persistor = persistStore(store)
  return { persistor, store };
}