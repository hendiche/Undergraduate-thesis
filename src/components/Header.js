// @flow

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { Header as NBHeader, Body, Left, Right, Button, Icon } from "native-base";

export default class Header extends React.Component {

  render() {
    return (
      <NBHeader>
        <Left style={{flex: 1}}>
         {
          this.props.navigation &&
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="ios-arrow-back" />
          </Button>
         }
        </Left>
        <Body>
          <Image source={require('../images/logo_ojek.png')} />
        </Body>
        <Right style={{flex: 1}}>
         {this.props.right}
        </Right>
      </NBHeader>
    );
  }

}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  }
});
