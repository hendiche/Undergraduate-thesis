// @flow

import React from "react";
import { StyleSheet, View, Image, Alert } from "react-native";
import {
  Container,
  Body,
  Header,
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
import { NavigationActions } from "react-navigation";
import commonColor from "../../native-base-theme/variables/commonColor";
import { connect } from "react-redux";
import { logIn } from "../actions/user";
import api from "../lib/api";
import PropTypes from 'prop-types';

class ForgotPassScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      email: ""
    };
  }

  _onPress() {
    const { email } = this.state;

    if (!email) return Alert.alert("Warning", "Email is required");

    this.context.showSpinner(true);
    api.forgotPassword(email)
    .then(() => {
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        Alert.alert(
          'Success',
          'You password have been sent to your email',
          [
            {text: 'OK', onPress: () => this.props.navigation.goBack()}
          ]
        );
      });
    })
    .catch(err => {
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        // Alert.alert("Error", err.error);
        Alert.alert(
          'Success',
          'You password have been sent to your email',
          [
            {text: 'OK', onPress: () => this.props.navigation.goBack()}
          ]
        );
      });
    });
  }

  render() {
    return (
      <Container>
        <Header noShadow style={{ height: 135 }}>
          <Left />
          <Body>
            <Image
              style={{ width: 250, height: 70, resizeMode: "contain" }}
              source={require("../images/ojek_logo.png")}
            />
          </Body>
          <Right />
        </Header>
        <Content>
          <Form style={{ backgroundColor: "#fff", marginTop: 10 }}>
            <Item last>
              <Icon name="ios-mail" />
              <Input
                placeholder="email"
                keyboardType="email-address"
                onChangeText={email => this.setState({ email })}
                placeholderTextColor={commonColor.jumbotronBg}
                value={this.state.email}
              />
            </Item>
          </Form>
          <Button onPress={() => this._onPress()} style={{ margin: 10 }} full>
            <Text>RETRIEVE PASSWORD</Text>
          </Button>
          <Button
            onPress={() => this.props.navigation.goBack()}
            style={{ margin: 10, alignSelf: "center" }}
            transparent
            small
          >
            <Text>BACK TO LOGIN</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  forgotPassword: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "700",
    color: commonColor.inputColorPlaceholder
  },
  container: {
    alignItems: "center",
    backgroundColor: commonColor.brandPrimary,
    height: 85
  },
  registerButton: {
    alignSelf: "stretch",
    justifyContent: "center"
  },
  registerText: {
    fontSize: 14,
    fontWeight: "900"
  },
  contactUsText: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 5
  },
  helpText: {
    alignSelf: "center",
    fontSize: 11,
    fontWeight: "600",
    color: commonColor.inputColorPlaceholder
  },
  btnFooter: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 9
  }
});

export default connect()(ForgotPassScreen);
