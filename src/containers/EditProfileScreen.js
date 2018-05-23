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
import { loadUser } from '../actions/user';
import api from '../lib/api';
import PropTypes from 'prop-types';

class EditProfileScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { user } = props;
    const { profile } = user;
    this.state = {
      name: user.name,
      phone: profile ? profile.phone : "",
      email: user.email,
      address: profile ? profile.address : "",
    };
  }

  _onSave() {
    const { name, phone, email, address } = this.state;

    let error = "";
    if (!address) error = 'Addres is required';
    if (!phone) error = 'Phone is required';
    if (!name) error = 'Name is required';
    
    if (error) {
      return Alert.alert('Warning', error);
    }

    this.context.showSpinner(true);
    api.updateProfile(name, phone, email, address)
    .then(() => {
      this.context.showSpinner(false);
      this.props.dispatch(loadUser());
      requestAnimationFrame(() => {
        Alert.alert(
          'Success',
          'Profile updated',
          [
            {text: 'OK', onPress: () => this.props.navigation.goBack()}
          ]
        );
      });
    })
    .catch(err => {
      Alert.alert('Error', err.error);
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
            <Title>EDIT PROFILE</Title>
          </Body>
          <Right/>
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
                disabled
                placeholder="email"
                keyboardType="email-address"
                placeholderTextColor={Colors.placeholderColor}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Item last>
              <Icon name="ios-pin" />
              <Input
                value={this.state.address}
                onChangeText={address => this.setState({ address })}
                multiline
              />
            </Item>
          </Form>
          <Button
            style={{ margin: 10 }}
            onPress={() => this._onSave()}
            full
          >
            <Text>SUBMIT</Text>
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

function select({ user }) {
  return {
    user,
  };
}

export default connect(select)(EditProfileScreen);