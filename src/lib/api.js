"use strict";

import qs from "qs";

import { AsyncStorage, Platform } from "react-native";
import fetch from "react-native-fetch-polyfill";
import Cookie from 'react-native-cookie';
import cookie from 'cookie';

class Api {
  constructor() {
    // this.BASE_URL = 'http://ojek.wenhao.id/api/v1';
    this.BASE_URL = 'http://sutibun-nasipadang.com/api/v1';
    if (__DEV__) {
      // this.BASE_URL = "http://192.168.2.189:8000/api/v1";
    }
  }

  async _fetch(opts) {
    opts = {
      method: "GET",
      url: null,
      body: null,
      callback: null,
      ...opts
    };

    const reqOpts = {
      timeout: 90 * 1000,
      method: opts.method,
      headers: {},
    };

    const deviceId = await AsyncStorage.getItem("deviceId");
    if (deviceId) {
      reqOpts.headers["X-Device-ID"] = deviceId;
    }

    reqOpts.headers["Accept"] = "application/json";

    if (opts.method != "GET") {
      if (opts.headers) {
        reqOpts.headers = {
          ...reqOpts.headers,
          ...opts.headers,
        };
      } else {
        reqOpts.headers["Content-Type"] = "application/json";
      }
    }

    let url = this.BASE_URL + "/" + opts.url;

    if (opts.body) {
      if (opts.method === "GET") {
        url += `?${qs.stringify(opts.body)}`;
      }
      else if (reqOpts.headers["Content-Type"] === 'application/json') {
        if (
          Object.keys(opts.body).length > 0 &&
          opts.body.constructor === Object
        ) {
          reqOpts.body = JSON.stringify(opts.body);
        }
      } else {
        // url = 'http://posttestserver.com/post.php';
        reqOpts.body = opts.body;
      }
    }

    const sessionId = await AsyncStorage.getItem("sessionId");
    if (sessionId) {
      if (Platform.OS === 'ios') {
        reqOpts.headers["Cookie"] = "laravel_session=" + sessionId;
      } else {
        await Cookie.set(url, 'laravel_session', sessionId);
      }
    }
    console.log(reqOpts, "REQUEST OPTIONS");
    const res = await fetch(url, reqOpts);
    const cookies = cookie.parse(res.headers.get('set-cookie'));
    AsyncStorage.setItem('sessionId', cookies['laravel_session']);

    if (res.headers.get("content-type").indexOf("application/json") !== -1) {
      return res.json().then(function(json) {
        console.log("REQUEST URL:", url);
        console.log("REQUEST OPTIONS:", reqOpts);
        // console.log('REQUEST SESSION ID', sessionId);
        // console.log('RESPONSE SESSION ID', cookies['laravel_session']);
        console.log("RESPONSE:", json);
        if (res.status >= 200 && res.status < 400) {
          return json;
        } else {
          throw json;
        }
      });
    } else {
      res.text().then(text => console.log(text));
    }
    return Promise.reject(new Error("Unexpected error"));
  }

  async logIn(email, password) {
    return this._fetch({
      url: "login",
      method: "POST",
      body: {
        email: email.toLowerCase(),
        password: password
      }
    });
  }

  async logOut() {
    return this._fetch({
      url: "logout",
      method: "POST",
    });
  }

  async register(data) {
    return this._fetch({
      url: "register",
      method: "POST",
      body: {
        name: data.name,
        phone: data.phone,
        email: data.email.toLowerCase(),
        password: data.password,
        re_password: data.re_password
      }
    });
  }

  async getProfile() {
    return this._fetch({
      url: "profile",
      method: "GET"
    });
  }

  async getMerchants(city) {
    return this._fetch({
      url: "merchants",
      body: {
        city
      }
    });
  }

  async getMerchantProducts(merchantId, cateId) {
    let url = `merchants/${merchantId}/products`;
    if (cateId) url = url + `?cat=${cateId}`;
    return this._fetch({
      url
    });
  }

  async updateProfile(name, phone, email, address) {
    return this._fetch({
      url: "me",
      method: "PUT",
      body: {
        name,
        email,
        phone,
        address,
      }
    });
  }

  async forgotPassword(email) {
    return this._fetch({
      url: "forgot_password",
      method: "POST",
      body: {
        email
      }
    });
  }

  async order(productId, paymentMethod, note, address) {
    return this._fetch({
      url: `user/order/${productId}`,
      method: "POST",
      body: {
        payment_method: paymentMethod,
        note,
        address
      }
    });
  }

  async changePassword(oldPass, newPass, reNewPass) {
    return this._fetch({
      url: "change_password",
      method: "POST",
      body: {
        old_password: oldPass,
        new_password: newPass,
        re_new_password: reNewPass
      }
    });
  }

  async transactions(status, page = 1) {
    return this._fetch({
      url: 'transactions',
      body: {
        status,
        page
      }
    });
  }

  async driverTransactions(status, page = 1) {
    return this._fetch({
      url: 'driver/transactions',
      body: {
        status,
        page
      }
    });
  }

  async transaction(id) {
    return this._fetch({
      url: `transactions/${id}`
    });
  }

  async topUp(value) {
    return this._fetch({
      url: "user/topup",
      method: "POST",
      body: {
        value
      }
    });
  }

  async getTopUp() {
    return this._fetch({
      url: "topup",
    });
  }

  async getConfig() {
    return this._fetch({
      url: "config"
    });
  }

  async googleLogin(token, data) {
    const body = {
      access_token: token
    };
    if (data) body.data = data;
    return this._fetch({
      url: "google/login",
      method: "POST",
      body
    });
  }

  async facebookLogin(token, data) {
    const body = {
      access_token: token
    };
    if (data) body.data = data;
    return this._fetch({
      url: "facebook/login",
      method: "POST",
      body
    });
  }

  async acceptTransaction(transactionId) {
    return this._fetch({
      url: `transactions/${transactionId}/action/progress`,
      method: "POST",
    });
  }

  async completeTransaction(transactionId) {
    return this._fetch({
      url: `transactions/${transactionId}/action/complete`,
      method: "POST",
    });
  }

  async reviewTransaction(transactionId, rating, message) {
    return this._fetch({
      url: `transactions/${transactionId}/review`,
      method: "POST",
      body: {
        rating,
        message,
      }
    });
  }

  async cancelTransaction(transactionId) {
    return this._fetch({
      url: `transactions/${transactionId}/action/cancel`,
      method: "POST",
    });
  }

  async initDevice(token) {
    return this._fetch({
      url: "devices",
      method: "POST",
      body: {
        os: Platform.OS,
        token,
      }
    });
  }

  async mutations(page) {
    return this._fetch({
      url: 'mutations',
      body: {
        page
      }
    });
  }

  async getCities() {
    return this._fetch({
      url: 'cities',
    });
  }

  async confirmPayment(id, bankId, name, proofImage) {
    const data = new FormData();
    if (bankId) {
      data.append('bank_id', bankId);
    }
    if (name) {
      data.append('name', name);
    }
    if (proofImage) {
      data.append('proof_image', proofImage);
    }
    return this._fetch({
      url: `payment_confirmations/${id}`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data
    });
  }
  
  async cancelPayment(id) {
    return this._fetch({
      url: `payment_confirmations/${id}/cancel`,
      method: 'POST'
    });
  }
}

// The singleton variable
const api = new Api();
export default api;
