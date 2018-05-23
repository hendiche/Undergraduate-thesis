// @flow

import api from '../lib/api';

export const LOADED_CONFIG = 'LOADED_CONFIG';

export function loadConfig() {
  return async dispatch => {
    const config = await api.getConfig();
    return dispatch({
      type: LOADED_CONFIG,
      config,
    });
  };
}