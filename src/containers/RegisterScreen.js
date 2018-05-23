// @flow

import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert, AsyncStorage } from "react-native";
import {
  Container,
  Body,
  Content,
  Footer,
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
  Header
} from "native-base";
import { NavigationActions } from 'react-navigation';
import Colors from "../components/Colors";
import commonColor from "../../native-base-theme/variables/commonColor";
import { connect } from 'react-redux';
import { register, logIn } from '../actions/user';
import PropTypes from 'prop-types';
import api from '../lib/api';

class RegisterScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      name: "",
      phone: "",
      email: "",
      password: "",
      re_password: "",

      token: '',
      type: '',
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params) {
      this.setState({
        token: params.token,
        name: params.data.name,
        email: params.data.email,
        type: params.provider,
      });
    }
  }

  _onRegister() {
    const { name, phone, email, password, re_password, token, type } = this.state;
    let error = "";
    if (!name) error = 'Name is required';
    else if (!phone) error = 'Phone is required';
    else if (!email) error = 'Email is required';
    else if (!password) error = 'Password is required';
    else if (!re_password) error = 'Re-type password is required';
    else if (password !== re_password) error = 'Password and Re-type password must match';
    
    if (error) {
      return Alert.alert('Warning', error);
    }
    this.context.showSpinner(true);
    const data = {
      name,
      phone,
      email,
      password,
      re_password
    };
    if (token) {
      if (type === 'fb') {
        this._regisFB(token, data, email, password);
        return 
      } else if (type === 'google') {
        this._regisGoogle(token, data, email, password);
        return
      }
    }
    this.props.dispatch(register(data))
    .then((response) => {
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        Alert.alert(
          'Success',
          'Your account successfully created',
          [
            {text: 'OK', onPress: () => {
              this.props.navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'Main' })
                  ],
                  key: 'Main'
                })
              );
            }},
          ]
        );
      });
    })
    .catch(err => {
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        Alert.alert('Error', err.error);
      });
    });
  }

  _regisFB(token, data, email, password) {
    api.facebookLogin(token, data)
    .then((response) => {
      this.props.dispatch(logIn(email, password))
      .then((response) => {
        this.context.showSpinner(false);
        requestAnimationFrame(() => {
          Alert.alert(
            'Success',
            'Your account successfully created',
            [
              {text: 'OK', onPress: () => {
                this.props.navigation.dispatch(
                  NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Main' })
                    ],
                    key: 'Main'
                  })
                );
              }},
            ]
          );
        });
      })
      .catch(err => {
        this.context.showSpinner(false);
        requestAnimationFrame(() => {
          Alert.alert('Error', err.error);
        });
      });
    })
    .catch(err => {
      console.log(err);
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        Alert.alert('Error', err.error);
      });
    });
  }

  _regisGoogle(token, data, email, password) {
    api.googleLogin(token, data)
    .then((response) => {
      this.props.dispatch(logIn(email, password))
      .then((response) => {
        this.context.showSpinner(false);
        requestAnimationFrame(() => {
          Alert.alert(
            'Success',
            'Your account successfully created',
            [
              {text: 'OK', onPress: () => {
                this.props.navigation.dispatch(
                  NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Main' })
                    ],
                    key: 'Main'
                  })
                );
              }},
            ]
          );
        });
      })
      .catch(err => {
        this.context.showSpinner(false);
        requestAnimationFrame(() => {
          Alert.alert('Error', err.error);
        });
      });
    })
    .catch(err => {
      console.log(err);
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        Alert.alert('Error', err.error);
      });
    });
  }

  render() {
    const { navigation } = this.props;
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
              <Icon name="ios-person" />
              <Input
                placeholder="name"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
              />
            </Item>
            <Item last>
              <Icon name="ios-phone-portrait" />
              <Text style={styles.subText}>+62</Text>
              <Input
                placeholder="phone"
                keyboardType="phone-pad"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.phone}
                onChangeText={phone => this.setState({ phone })}
              />
            </Item>
            <Item last>
              <Icon name="ios-mail" />
              <Input
                placeholder="email"
                keyboardType="email-address"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Item last>
              <Icon name="ios-lock" />
              <Input
                secureTextEntry
                placeholder="password"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </Item>
            <Item last>
              <Icon name="ios-lock" />
              <Input
                secureTextEntry
                placeholder="re-type password"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.re_password}
                onChangeText={re_password => this.setState({ re_password })}
              />
            </Item>
          </Form>
          <Text style={styles.footerText}>
            By registering. I agree to the
          </Text>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              alignContent: "space-around"
            }}
          >
            <TouchableOpacity style={styles.termsView}
              onPress={() => navigation.navigate("Info", { title: 'TERMS OF SERVICE'})}>
              <Text style={[styles.footerLink, styles.termsButton]}>
                Terms of service
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 11,
                fontWeight: "200",
                color: commonColor.inputColorPlaceholder
              }}
            >
              and
            </Text>

            <TouchableOpacity style={styles.termsView}
              onPress={() => navigation.navigate("Info", { title: 'PRIVACY POLICY'})}>
              <Text style={[styles.footerLink, styles.privacyButton]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            style={{ margin: 10 }}
            onPress={() => this._onRegister()}
            full
          >
            <Text>REGISTER</Text>
          </Button>
        </Content>
        <Footer style={{flexDirection: 'column'}}>
          <Text style={{textAlign: 'center'}}>Already have an account?</Text>
          <Button
            onPress={() => this.props.navigation.goBack()}
            transparent
            small
            block
          >
            <Text>LOGIN</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loginText: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "200",
    color: commonColor.inputColorPlaceholder
  },
  container: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: commonColor.brandPrimary,
    height: 150
  },
  subText: {
    fontFamily: "Raleway-Regular",
    color: Colors.placeholderColor
  },
  toLoginButton: {
    textAlign: "center",
    fontWeight: "900",
    backgroundColor: Colors.clearColor,
    color: Colors.mainGreenColor,
    fontFamily: "Raleway-Bold",
    flex: 1
  },
  termsView: {
    paddingTop: 0
  },
  footerText: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: "200",
    flex: 1,
    textAlign: "center",
    color: commonColor.inputColorPlaceholder
  },
  footerLink: {
    fontSize: 11,
    color: Colors.mainGreenColor,
    fontWeight: "900"
  },
  termsButton: {
    marginRight: 5
  },
  privacyButton: {
    marginLeft: 5
  },
  footerStyle: {
    backgroundColor: Colors.clearColor,
    flexDirection: "column",
    marginTop: 40
  }
});

export default connect()(RegisterScreen);