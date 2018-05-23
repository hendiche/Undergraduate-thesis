'use strict';

import { combineReducers } from 'redux';

import user from './user';
import merchants from './merchants';
import config from './config';
import transactions from './transactions';
import cities from './cities';

export default combineReducers({
  user,
  merchants,
  config,
  transactions,
  cities,
});
