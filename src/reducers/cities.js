'use strict';

import {
  LOADED_CITIES,
} from '../actions/cities';

const cities = (state = [], action) => {
  switch(action.type) {
    case LOADED_CITIES:
      return action.cities;
    default:
      return state;
  }
}

export default cities;