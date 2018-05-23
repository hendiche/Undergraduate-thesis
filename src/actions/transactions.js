// @flow

import { AsyncStorage } from "react-native";
import api from "../lib/api";
import _ from "lodash";

export const LOADED_TRANSACTIONS = "LOADED_TRANSACTIONS";
export const LOADED_WAITING_TRANSACTIONS = "LOADED_WAITING_TRANSACTIONS";
export const LOADED_PROGRESS_TRANSACTIONS = "LOADED_PROGRESS_TRANSACTIONS";
export const LOADED_COMPLETED_TRANSACTIONS = "LOADED_COMPLETED_TRANSACTIONS";

export function loadTransactions() {
  return async (dispatch, getState) => {
    dispatch(loadWaitingTransactions());
    dispatch(loadProgressTransactions());
    dispatch(loadCompletedTransactions());
    return dispatch({
      type: LOADED_TRANSACTIONS
    });
  };
}

export function loadWaitingTransactions() {
  return async (dispatch, getState) => {
    const { user } = getState();
    let response;
    let transactions = [];
    if (user.role === "driver") {
      response = await api.driverTransactions("waiting");
      transactions = response.data;
    }
    return dispatch({
      type: LOADED_WAITING_TRANSACTIONS,
      transactions,
      response
    });
  };
}

export function loadProgressTransactions() {
  return async (dispatch, getState) => {
    const { user } = getState();
    let response;
    let transactions = [];
    if (user.role === "driver") {
      response = await api.driverTransactions("progress");
    } else {
      response = await api.transactions("progress");
    }
    transactions = response.data;
    return dispatch({
      type: LOADED_PROGRESS_TRANSACTIONS,
      transactions,
      response
    });
  };
}

export function loadCompletedTransactions() {
  return async (dispatch, getState) => {
    const { user } = getState();
    let response;
    let transactions = [];
    if (user.role === "driver") {
      response = await api.driverTransactions("completed");
    } else {
      response = await api.transactions("completed");
    }
    transactions = response.data;
    return dispatch({
      type: LOADED_COMPLETED_TRANSACTIONS,
      transactions,
      response
    });
  };
}
