'use strict';

import {
  LOADED_USER,
  LOGGED_IN,
  LOGGED_OUT,
} from '../actions/user';

const initialState = {
  isLoggedIn: false,
  name: '',
  email: '',
  balance: '0',
  profile: {
    phone: '',
    profilePicture: '',
    address: '',
  }
}

const user = (state = initialState, action) => {
  switch(action.type) {
    case LOADED_USER:
      return {
        ...state,
        ...action.user,
      };
    case LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
}

export default user;