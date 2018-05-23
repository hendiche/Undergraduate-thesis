// @flow

import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";
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
import api from '../lib/api';
import PropTypes from 'prop-types';

class ChangePassScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      oldPass: '',
      newPass: '',
      rePass: ''
    };
  }

  componentDidMount() {

  }

  _onPress() {
    const { oldPass, newPass, rePass } = this.state;

    let error = "";
    if (!oldPass) error = 'Old password is required';
    else if (!newPass) error = 'New password is required';
    else if (!rePass) error = 'Re-type password is required';
    else if (oldPass === newPass) error = 'Old password and New password must be different';
    else if (rePass !== newPass) error = 'Re-type new password and new password must same';
    
    if (error) {
      return Alert.alert('Warning', error);
    }

    this.context.showSpinner(true);
    api.changePassword(oldPass, newPass, rePass)
    .then((response) => {
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        Alert.alert(
          'Success',
          response.success,
          [
            {text: 'OK', onPress: () => this.setState({ oldPass: '', newPass: '', rePass: '' })}
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

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>CHANGE PASSWORD</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          <Form style={{ backgroundColor: "#fff", marginTop: 10 }}>
            <Item last>
              <Icon name="ios-lock" />
              <Input
                secureTextEntry
                placeholder="Old password"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.oldPass}
                onChangeText={oldPass => this.setState({ oldPass })}
              />
            </Item>
            <Item last>
              <Icon name="ios-lock" />
              <Input
                secureTextEntry
                placeholder="New password"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.newPass}
                onChangeText={newPass => this.setState({ newPass })}
              />
            </Item>
            <Item last>
              <Icon name="ios-lock" />
              <Input
                secureTextEntry
                placeholder="Re-type new password"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.rePass}
                onChangeText={rePass => this.setState({ rePass })}
              />
            </Item>
          </Form>
          <Button
            style={{ margin: 10 }}
            onPress={() => this._onPress()}
            full
          >
            <Text>CHANGE PASSWORD</Text>
          </Button>
        </Content>
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
    backgroundColor: commonColor.brandPrimary,
    height: 85
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


export default connect()(ChangePassScreen);