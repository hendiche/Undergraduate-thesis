"use strict";

import { LOADED_CONFIG } from "../actions/config";

const initialState = {
  bankInformation: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOADED_CONFIG:
      return {
        ...state,
        ...action.config
      };
    default:
      return state;
  }
};

export default user;
