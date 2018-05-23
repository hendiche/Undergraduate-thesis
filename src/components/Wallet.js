// @flow

import React from "react";
import { StyleSheet, View, Image } from "react-native";
import {
  Header as NBHeader,
  Body,
  Left,
  Right,
  Button,
  Icon,
  Form,
  Input,
  Text,
  Item
} from "native-base";
import { connect } from "react-redux";
import api from '../lib/api';
import PropTypes from "prop-types";
import _ from 'lodash';
import { loadUser } from "../actions/user";

class Wallet extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func
  };

  _onTopUp = () => {
    const { navigation } = this.props;
    navigation.navigate("TopUp");
  }

  _onLoadUser = () => {
    this.props.dispatch(loadUser());
  }

  render() {
    let actionButton;
    if (this.props.user.role != "driver") {
      actionButton = (
        <Button
          onPress={this._onTopUp}
        >
          <Text style={{ fontSize: 10, fontWeight: "500" }}>JEK PAY</Text>
        </Button>
      );
    }
    return (
      <Form style={this.props.style}>
        <Item style={styles.content} last
        onPress={this._onLoadUser}>
          <Image source={require("../images/wallet.png")}/>
          <Text style={{ marginLeft: 10, flex: 1 }}>
            Rp {this.props.user.balance.formatMoney()}
          </Text>
          {actionButton}
        </Item>
      </Form>
    );
  }
  
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    height: 50,
  }
});

function select({ user }) {
  return {
    user
  };
}

export default connect(select)(Wallet);
