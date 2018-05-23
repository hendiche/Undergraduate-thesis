// @flow

import { AsyncStorage } from 'react-native';
import api from '../lib/api';

export const LOADED_MERCHANTS = 'LOADED_MERCHANTS';

export function loadMerchants(cityId) {
  return async dispatch => {
    const merchants = await api.getMerchants(cityId);
    return dispatch({
      type: LOADED_MERCHANTS,
      merchants,
    });
  };
}