// @flow

import React from "react";
import {
  StyleSheet,
  View,
  Image,
  PixelRatio,
  Platform,
  Linking,
  Alert,
} from "react-native";
import {
  Container,
  Header,
  Body,
  Footer,
  Content,
  Left,
  Right,
  Icon,
  Title,
  Button,
  Text,
  Form,
  Item,
  Label,
  Input
} from "native-base";
import commonColor from "../../native-base-theme/variables/commonColor";
import variable from "../../native-base-theme/variables/platform";
import { navigateOnce } from "../lib/navigator";
import { StackNavigator, NavigationActions } from "react-navigation";
import ChangePassScreen from "./ChangePassScreen";
import { connect } from "react-redux";
import { logOut } from "../actions/user";

const platformStyle = variable.platformStyle;
const platform = variable.platform;

class SettingsScreen extends React.Component {
  
  render() {
    const { navigation } = this.props.screenProps;
    return (
      <Container>
        <Header noShadow>
          <Left />
          <Body>
            <Title>SETTINGS</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Form style={styles.form}>
            <Item
              last
              onPress={() => navigation.navigate("ChangePass")}
            >
              <Label style={styles.label}>Change Password</Label>
            </Item>
            <Item last
              onPress={() => navigation.navigate("Info", { title: 'TERMS OF SERVICE'})}>
              <Label style={styles.label}>Terms of Service</Label>
            </Item>
            <Item last
              onPress={() => navigation.navigate("Info", { title: 'PRIVACY POLICY'})}>
              <Label style={styles.label}>Privacy Policy</Label>
            </Item>
            <Item last onPress={this._onLogOut}>
              <Label style={styles.label}>Log Out</Label>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }

  _onRateApp = () => {
    if (Platform.OS === "ios") {
      const APP_STORE_LINK =
        "itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8";
      Linking.openURL(APP_STORE_LINK).catch(err =>
        console.log("An error occurred", err)
      );
    } else {
      const PLAY_STORE_LINK = "market://details?id=myandroidappid";
      Linking.openURL(PLAY_STORE_LINK).catch(err =>
        console.log("An error occurred", err)
      );
    }
  };
  
  _onLogOut = () => {
    Alert.alert("Confirmation", "Are you sure want to continue?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          this.props.dispatch(logOut());
        }
      }
    ]);
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: commonColor.brandPrimary,
    height: 140
  },
  label: {
    paddingVertical: 18,
    fontSize: 14
  },
  form: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    borderBottomColor: variable.cardBorderColor
  }
});

export default connect()(SettingsScreen);
