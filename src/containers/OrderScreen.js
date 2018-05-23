// @flow

import React from "react";
import { StackNavigator } from "react-navigation";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  PixelRatio,
  Alert
} from "react-native";
import {
  Header,
  Title,
  Left,
  Right,
  Body,
  Content,
  Text,
  Button,
  Icon,
  Container,
  Form,
  Input,
  Item,
  Label
} from "native-base";
import { NavigationActions } from "react-navigation";
import api from "../lib/api";
import commonColor from "../../native-base-theme/variables/commonColor";
import variable from "../../native-base-theme/variables/platform";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadUser } from "../actions/user";

const platformStyle = variable.platformStyle;
const platform = variable.platform;

class OrderScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { profile } = props.user;
    this.state = {
      paymentMethod: 2,
      note: "",
      address: profile ? profile.address : ""
    };
  }

  render() {
    const { navigation } = this.props;
    const { product, merchant } = this.props.navigation.state.params;
    const price = Number(product.price);
    const discountPrice = price - product.discountOnJekpay;
    return (
      <Container>
        <Header navigation={navigation} style={{ borderBottomWidth: 0 }}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Text style={styles.merchant}>PAYMENT</Text>
          </Body>
          <Right />
        </Header>
        <Content>
          <Form style={styles.form}>
            <Text style={{ fontWeight: "bold" }}>PAYMENT METHOD</Text>
            {merchant.payWithJekpay == 1 && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ paymentMethod: 2 });
                }}
              >
                <View>
                  <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <Image
                      style={styles.selectionImage}
                      source={
                        this.state.paymentMethod == 2
                          ? require("../images/check.png")
                          : require("../images/uncheck.png")
                      }
                      resizeMode="contain"
                    />
                    <Image
                      style={{ width: 40, height: 25 }}
                      source={require("../images/wallet.png")}
                      resizeMode="contain"
                    />
                    <Text style={{ marginTop: 4 }}>JEK PAY</Text>
                    <Text style={styles.paymentDesc}>
                      Rp {discountPrice.formatMoney()}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: commonColor.listDividerBg,
                      height: 1,
                      marginVertical: 10
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
            {merchant.payWithCash == 1 && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ paymentMethod: 3 });
                }}
              >
                <View>
                  <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <Image
                      style={styles.selectionImage}
                      source={
                        this.state.paymentMethod == 3
                          ? require("../images/check.png")
                          : require("../images/uncheck.png")
                      }
                      resizeMode="contain"
                    />
                    <Image
                      style={{ width: 40, height: 25 }}
                      source={require("../images/cod.png")}
                      resizeMode="contain"
                    />
                    <Text style={{ marginTop: 4 }}>Cash</Text>
                    <Text style={styles.paymentDesc}>
                      Rp {price.formatMoney()}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: commonColor.listDividerBg,
                      height: 1,
                      marginVertical: 10
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
            {merchant.payWithTransfer == 1 && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ paymentMethod: 1 });
                }}
              >
                <View>
                  <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <Image
                      style={styles.selectionImage}
                      source={
                        this.state.paymentMethod == 1
                          ? require("../images/check.png")
                          : require("../images/uncheck.png")
                      }
                      resizeMode="contain"
                    />
                    <Image
                      style={{ width: 40, height: 25 }}
                      source={require("../images/topup.png")}
                      resizeMode="contain"
                    />
                    <Text style={{ marginTop: 4 }}>Transfer</Text>
                    <Text style={styles.paymentDesc}>
                      Rp {price.formatMoney()}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: commonColor.listDividerBg,
                      height: 1,
                      marginVertical: 10
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
            <Text style={{ fontWeight: "bold" }}>ADDRESS</Text>
            <Item last>
              <Icon name="ios-pin" />
              <Input
                multiline
                value={this.state.address}
                onChangeText={address => this.setState({ address })}
              />
            </Item>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>NOTE</Text>
            <Item last>
              <Icon name="ios-paper" />
              <Input
                multiline
                value={this.state.note}
                onChangeText={note => this.setState({ note })}
              />
            </Item>
          </Form>
          <Button
            full
            style={styles.orderButton}
            onPress={() => this._onConfirm()}
          >
            <Text>ORDER</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  _onConfirm() {
    Alert.alert("Order", "Are you sure want to continue?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      { text: "OK", onPress: this._onOrder }
    ]);
  }

  _keyExtractor = (item, index) => index;

  _onOrder = () => {
    const { address } = this.state;
    
    if (!address) return Alert.alert('Warning', 'Address is required');

    this.context.showSpinner(true);
    const { product, key } = this.props.navigation.state.params;
    api
      .order(
        product.id,
        this.state.paymentMethod,
        this.state.note,
        this.state.address
      )
      .then(order => {
        this.context.showSpinner(false);
        this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: "Main" }),
              NavigationActions.navigate({ routeName: "OrderDetails", params: { order } }),
            ],
          })
        );
      })
      .catch(err => {
        console.log(err);
        this.context.showSpinner(false);
        if (err.message) {
          requestAnimationFrame(() => {
            Alert.alert("Order Failed", err.mesage);
          });
        }
      });
  };
}

const styles = StyleSheet.create({
  merchant: {
    color: "#fff",
    fontSize: 15,
    letterSpacing: 4
  },
  form: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 10,
    borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    borderBottomColor: variable.cardBorderColor
  },
  detailTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40
  },
  selectionImage: {
    width: 8,
    height: 8,
    marginTop: 10
  },
  paymentDesc: {
    marginTop: 4,
    textAlign: "right",
    flex: 1
  },
  orderButton: {
    margin: 10
  },
  note: {
    marginTop: 10,
    textAlignVertical: "top",
    height: 120
  }
});

function select({ user }) {
  return {
    user
  };
}

export default connect(select)(OrderScreen);
