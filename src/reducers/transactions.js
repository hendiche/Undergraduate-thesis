"use strict";

import {
  LOADED_WAITING_TRANSACTIONS,
  LOADED_PROGRESS_TRANSACTIONS,
  LOADED_COMPLETED_TRANSACTIONS
} from "../actions/transactions";
import {
    LOGGED_OUT,
  } from '../actions/user';

const initialState = {
  waiting: [],
  progress: [],
  completed: []
};

const transactions = (state = initialState, action) => {
  switch (action.type) {
    case LOADED_WAITING_TRANSACTIONS:
      return {
        ...state,
        waiting: action.transactions
      };
    case LOADED_PROGRESS_TRANSACTIONS:
      return {
        ...state,
        progress: action.transactions
      };
    case LOADED_COMPLETED_TRANSACTIONS:
      return {
        ...state,
        completed: action.transactions
      };
    case LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};

export default transactions;
