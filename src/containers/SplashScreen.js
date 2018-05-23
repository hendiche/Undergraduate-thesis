// @flow

import React from "react";
import { StyleSheet, View, Image, PixelRatio } from "react-native";
import commonColor from "../../native-base-theme/variables/commonColor";
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

class SplashScreen extends React.Component {

  componentDidMount() {
    this.timeoutID = setTimeout(() => {
      clearTimeout(this.timeoutID);
      let routeName = 'Login';
      if (this.props.user.isLoggedIn) {
        routeName = 'Main';
      }
      this.props.navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName })
          ],
          key: routeName
        })
      );
    }, 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ resizeMode: "contain", width: 400, height: 100 }}
          source={require("../images/ojek_logo.png")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: commonColor.brandPrimary
  }
});

function select({ user }) {
  return {
    user,
  };
}

export default connect(select)(SplashScreen);