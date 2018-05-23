// @flow

import React from "react";
import {
  Button,
  ScrollView,
  Text,
  Modal,
  View,
  StyleSheet,
  AppState,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import { StackNavigator } from "react-navigation";
import { StyleProvider, Spinner, Root } from "native-base";
import getTheme from "../native-base-theme/components";
import commonColor from "../native-base-theme/variables/commonColor";
import { navigateOnce } from "./lib/navigator";
import { Provider } from "react-redux";
import configureStore from "./lib/configureStore";
import { PersistGate } from "redux-persist/lib/integration/react";
import { loadUser } from "./actions/user";
import { loadConfig } from "./actions/config";
import { loadTransactions } from './actions/transactions';
import { api } from './lib/api';

import { GoogleSignin } from "react-native-google-signin";
GoogleSignin.configure({
  iosClientId:
    "382005737624-67jpnh0148hhasg98jeedl7g9spv6u9h.apps.googleusercontent.com",
  webClientId:
    "382005737624-gps3dla2qkdt9jco0ro9dceg59mknclh.apps.googleusercontent.com",
  offlineAccess: true
});

import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";

// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async notif => {
  // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
  if (notif.local_notification) {
    //this is a local notification
  }
  if (notif.opened_from_tray) {
    //iOS: app is open/resumed because user clicked banner
    //Android: app is open/resumed because user clicked banner or tapped app icon
  }
  // await someAsyncCall();

  if (Platform.OS === "ios") {
    //optional
    //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
    //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
    //notif._notificationType is available for iOS platfrom
    switch (notif._notificationType) {
      case NotificationType.Remote:
        notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
        break;
      case NotificationType.NotificationResponse:
        notif.finish();
        break;
      case NotificationType.WillPresent:
        notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
        break;
    }
  }
});

console.disableYellowBox = true;

import SplashScreen from "./containers/SplashScreen";
import LoginScreen from "./containers/LoginScreen";
import MainScreen from "./containers/MainScreen";
import AlbumListScreen from "./containers/AlbumListScreen";
import PhotoGridScreen from "./containers/PhotoGridScreen";
import HelpScreen from "./containers/HelpScreen";
import HomeScreen from "./containers/HomeScreen";
import RegisterScreen from "./containers/RegisterScreen";
import ForgotPassScreen from "./containers/ForgotPassScreen";
import MerchantScreen from "./containers/MerchantScreen";
import TopUpScreen from "./containers/TopUpScreen";
import ProductScreen from "./containers/ProductScreen";
import OrderScreen from "./containers/OrderScreen";
import EditProfileScreen from "./containers/EditProfileScreen";
import ChangePassScreen from "./containers/ChangePassScreen";
import OrderDetailsScreen from "./containers/OrderDetailsScreen";
import InfoScreen from "./containers/InfoScreen";

Number.prototype.formatMoney = function() {
  var n = this,
    c = isNaN((c = Math.abs(c))) ? 2 : c,
    t = t == undefined ? "." : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t)
  );
};

String.prototype.formatMoney = function() {
  return Number(this).formatMoney();
};

Math.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const AppNavigator = StackNavigator(
  {
    Splash: {
      screen: SplashScreen
    },
    Login: {
      screen: LoginScreen
    },
    Main: {
      screen: MainScreen
    },
    Albums: {
      screen: AlbumListScreen
    },
    Photos: {
      screen: PhotoGridScreen
    },
    Help: {
      screen: HelpScreen
    },
    Register: {
      screen: RegisterScreen
    },
    Merchant: {
      screen: MerchantScreen
    },
    TopUp: {
      screen: TopUpScreen
    },
    Product: {
      screen: ProductScreen
    },
    Order: {
      screen: OrderScreen
    },
    Forgot: {
      screen: ForgotPassScreen
    },
    EditProfile: {
      screen: EditProfileScreen
    },
    ChangePass: {
      screen: ChangePassScreen
    },
    OrderDetails: {
      screen: OrderDetailsScreen
    },
    Info: {
      screen: InfoScreen
    },
  },
  {
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    },
    cardStyle: {
      backgroundColor: "#F2F2F2"
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
      },
      screenInterpolator: () => null
    })
  }
);

AppNavigator.router.getStateForAction = navigateOnce(
  AppNavigator.router.getStateForAction
);

const { persistor, store } = configureStore();

export default class App extends React.Component {
  static childContextTypes = {
    showSpinner: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      spinner: false
    };
  }

  getChildContext() {
    return {
      showSpinner: spinner => {
        this.setState({ spinner });
      }
    };
  }

  componentDidMount() {
    AppState.addListener("appStateDidChange", ({ app_state }) => {
      if (app_state === "active") {
        this._onRefresh();
      }
    });
    // iOS: show permission prompt for the first call. later just check permission in user settings
    // Android: check permission in user settings
    FCM.requestPermissions()
      .then(() => console.log("granted"))
      .catch(() => console.log("notification permission rejected"));
  }

  _onRefresh = () => {
    const { user } = store.getState();
    if (user.isLoggedIn) {
      store.dispatch(loadUser());
      store.dispatch(loadConfig());
      store.dispatch(loadTransactions());
    }
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <StyleProvider style={getTheme(commonColor)}>
            <Root>
              <Modal
                transparent
                animationType="none"
                visible={this.state.spinner}
                onRequestClose={() => {}}
              >
                <View style={styles.container}>
                  <Spinner
                    style={styles.spinner}
                    color={commonColor.brandPrimary}
                  />
                </View>
              </Modal>
              <AppNavigator onNavigationStateChange={null} />
            </Root>
          </StyleProvider>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center"
  },
  spinner: {
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 120,
    width: 120
  }
});
