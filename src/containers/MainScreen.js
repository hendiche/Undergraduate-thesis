import React, { Component } from "react";
import commonColor from "../../native-base-theme/variables/commonColor";
import {
  TabNavigator,
  TabBarBottom,
  NavigationActions,
} from "react-navigation";
import { Image, AsyncStorage } from "react-native";
import {
  Toast
} from "native-base";
import { connect } from "react-redux";
import {
  loadWaitingTransactions,
  loadProgressTransactions,
  loadCompletedTransactions
} from "../actions/transactions";
import { loadUser, logOut } from "../actions/user";
import { loadCities } from "../actions/cities";
import api from "../lib/api";
import FCM, { FCMEvent } from "react-native-fcm";

import HomeScreen from "./HomeScreen";
import HistoryScreen from "./HistoryScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";
import { loadConfig } from "../actions/config";

const MainScreen = TabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={
              focused
                ? require("../images/ico_home_active.png")
                : require("../images/ico_home.png")
            }
          />
        )
      }
    },
    Order: {
      screen: HistoryScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={
              focused
                ? require("../images/ico_clock_active.png")
                : require("../images/ico_clock.png")
            }
          />
        )
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={
              focused
                ? require("../images/ico_profile_active.png")
                : require("../images/ico_profile.png")
            }
          />
        )
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={
              focused
                ? require("../images/ico_settings_active.png")
                : require("../images/ico_settings.png")
            }
          />
        )
      }
    }
  },
  {
    swipeEnabled: false,
    tabBarPosition: "bottom",
    animationEnabled: false,
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      activeTintColor: commonColor.brandPrimary,
      inactiveTintColor: "#CCC",
      indicatorStyle: {
        backgroundColor: "transparent"
      },
      style: {
        backgroundColor: "#fff",
        height: 51,
        borderTopColor: "#CCC",
        borderTopWidth: 0.5
      }
    }
  }
);

class Main extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.dispatch(loadUser())
    .catch(err => {
      if (err.message == "Unauthorized") {
        this.props.dispatch(logOut());
      }
    });
    this.props.dispatch(loadConfig());
    // this.props.dispatch(loadProgressTransactions());
    // this.props.dispatch(loadCompletedTransactions());
    this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
      if (notif.type == "order") {
        if (notif.opened_from_tray) {
          this.props.navigation.navigate("OrderDetails", {
            order: { id: notif.id }
          });
        } else {
          this.props.dispatch(loadWaitingTransactions());
        }
      } else if (notif.type == "refresh") {
        if (!notif.opened_from_tray) {
          this.props.dispatch(loadUser());
        }
      }
    });

    FCM.getFCMToken().then(token => {
      console.log("FCM Token:", token);
      api.initDevice(token)
      .then(device => {
        AsyncStorage.setItem('deviceId', device.id);
      });
    });

    FCM.on(FCMEvent.RefreshToken, token => {
      api.initDevice(token)
      .then(device => {
        AsyncStorage.setItem('deviceId', device.id);
      });
    });
  }

  componentWillUnmount() {
    this.notificationListener.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.isLoggedIn) {
      this.props.navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "Login" })],
          key: "Login"
        })
      );
    }
  }

  render() {
    return (
      <MainScreen screenProps={this.props} onNavigationStateChange={null} />
    );
  }
}

function select({ user }) {
  return {
    user
  };
}

export default connect(select)(Main);
