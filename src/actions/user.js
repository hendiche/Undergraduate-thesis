// @flow

import { AsyncStorage } from 'react-native';
import api from '../lib/api';

export const LOADED_USER = 'LOADED_USER';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const REGISTER = 'REGISTER';

export function loadUser() {
  return async dispatch => {
    try {
      const user = await api.getProfile();
      return dispatch({
        type: LOADED_USER,
        user,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export function logIn(email, password) {
  return async dispatch => {
    await api.logIn(email, password);
    await dispatch(loadUser());
    return dispatch({
      type: LOGGED_IN,
    });
  };
}

export function register(data) {
  return async dispatch => {
    const response = await api.register(data);
    return dispatch(logIn(data.email, data.password));
  };
}

export function logOut() {
  api.logOut();
  return async dispatch => {
    return dispatch({
      type: LOGGED_OUT,
    });
  };
}

export function setLoggedIn() {
  return async dispatch => {
    await dispatch(loadUser());
    return dispatch({
      type: LOGGED_IN
    });
  }
}