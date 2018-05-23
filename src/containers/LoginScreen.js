// @flow

import React from "react";
import { StyleSheet, View, Image, Alert, Platform, AsyncStorage } from "react-native";
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
  Input,
} from "native-base";
import { NavigationActions } from "react-navigation";
import commonColor from "../../native-base-theme/variables/commonColor";
import { connect } from "react-redux";
import { logIn, setLoggedIn } from "../actions/user";
import PropTypes from "prop-types";

import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
import { GoogleSignin } from 'react-native-google-signin';
import api from '../lib/api';

class LoginScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      name: "",
    };
  }

  componentDidMount() {
  }

  _onLogin() {
    const { email, password } = this.state;

    let error = "";
    if (!email) error = "Email is required";
    else if (!password) error = "Password is required";

    if (error) {
      return Alert.alert("Warning", error);
    }

    this.context.showSpinner(true);
    this.props
      .dispatch(logIn(email, password))
      .then(response => {
        this.context.showSpinner(false);
        this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Main" })],
            key: "Main"
          })
        );
      })
      .catch(err => {
        console.log(err);
        this.context.showSpinner(false);
        requestAnimationFrame(() => {
          Alert.alert("Error", err.error);
        });
      });
  }

  _onLoginFacebook = () => {
    LoginManager.logInWithReadPermissions(["public_profile", "email"])
      .then(result => {
        if (!result.isCancelled) {
          return AccessToken.getCurrentAccessToken();
        }
      })
      .then(user => {
        if (user) {
          const { accessToken } = user;
          this.context.showSpinner(true);
          api.facebookLogin(accessToken)
          .then((res) => {
            this.context.showSpinner(false);
            this.props.dispatch(setLoggedIn())
            .then((res) => {
              this.props.navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "Main" })],
                  key: "Main"
                })
              );
            });
          })
          .catch(err => {
            console.log(err);
            const infoRequest = new GraphRequest(
              "/me",
              {
                parameters: {
                  fields: {
                    string: "email,name"
                  }
                }
              },
              (error, user) => {
                this.context.showSpinner(false);
                if (!error) {
                  this.props.navigation.navigate("Register", {
                    token: accessToken,
                    data: {
                      name: user.name,
                      email: user.email,
                    },
                    provider: "facebook"
                  });
                }
              }
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  _onLoginGoogle = () => {
    GoogleSignin.hasPlayServices({ autoResolve: true })
    .then(() => GoogleSignin.signIn())
    .then((user) => {
      const data = {
        email: user.email,
        name: user.name,
      }
      api.googleLogin(user.accessToken)
      .then((res) => {
        this.props.dispatch(setLoggedIn())
        .then((res) => {
          this.props.navigation.dispatch(
            NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: "Main" })],
              key: "Main"
            })
          );
        });
      })
      .catch(err => {
        this.props.navigation.navigate("Register", { token: user.accessToken, data, provider: 'google' });
        console.log(err);
      });
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
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
          <Button
            full
            style={[styles.btnLogin, { backgroundColor: "#3b5998" }]}
            onPress={this._onLoginFacebook}
          >
            <Icon name="logo-facebook" />
            <Text style={{ flex: 1, textAlign: "center" }}>
              LOGIN WITH FACEBOOK
            </Text>
          </Button>
          <Button
            full
            style={[styles.btnLogin, { backgroundColor: "#d34836" }]}
            onPress={this._onLoginGoogle}
          >
            <Icon name="logo-google" />
            <Text style={{ flex: 1, textAlign: "center" }}>
              LOGIN WITH GOOGLE
            </Text>
          </Button>
          <Text style={styles.forgotPassword}>OR</Text>
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
            <Item last>
              <Icon name="ios-unlock" />
              <Input
                placeholder="password"
                placeholderTextColor={commonColor.jumbotronBg}
                secureTextEntry
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </Item>
          </Form>
          <Button full onPress={() => this._onLogin()} style={styles.btnLogin}>
            <Text>LOGIN</Text>
          </Button>
        </Content>
        <Footer style={{ flexDirection: "column" }}>
          <Text style={{ textAlign: "center" }}>Don't have an account?</Text>
          <Button
            onPress={() => this.props.navigation.navigate("Register")}
            transparent
            small
            block
          >
            <Text>REGISTER</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  forgotPassword: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: commonColor.inputColorPlaceholder
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: commonColor.brandPrimary,
    height: 150
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
    color: commonColor.inputColorPlaceholder
  },
  btnFooter: {
    paddingLeft: 5,
    paddingRight: 5
  },
  btnLogin: {
    margin: 10,
    marginBottom: 0
  }
});

export default connect()(LoginScreen);
