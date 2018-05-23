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

export default class InfoScreen extends React.Component {
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
      const { navigation } = this.props;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{navigation.state.params.title}</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          <Form style={{ backgroundColor: "#fff", marginTop: 10, padding: 10 }}>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
});