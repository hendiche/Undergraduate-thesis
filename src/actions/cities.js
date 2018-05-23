// @flow

import { AsyncStorage } from 'react-native';
import api from '../lib/api';

export const LOADED_CITIES = 'LOADED_CITIES';

export function loadCities() {
  return async dispatch => {
    const cities = await api.getCities();
    return dispatch({
      type: LOADED_CITIES,
      cities,
    });
  };
}