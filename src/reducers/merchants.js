'use strict';

import {
  LOADED_MERCHANTS,
} from '../actions/merchants';

const merchants = (state = [], action) => {
  switch(action.type) {
    case LOADED_MERCHANTS:
      return action.merchants;
    default:
      return state;
  }
}

export default merchants;