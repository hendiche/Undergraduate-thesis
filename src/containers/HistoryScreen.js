// @flow

import React from "react";
import { TabBarTop, TabNavigator, StackNavigator } from "react-navigation";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  PixelRatio,
} from "react-native";
import {
  Container,
  Header,
  Title,
  Left,
  Icon,
  Right,
  Button,
  Body,
  Content,
  Text,
  Form,
  Item,
  Input,
  Label,
  Spinner
} from "native-base";
import commonColor from "../../native-base-theme/variables/commonColor";
import variable from "../../native-base-theme/variables/platform";
import OrderDetailsScreen from "./OrderDetailsScreen";
import OrderList from "../components/OrderList";
import api from '../lib/api';
import moment from 'moment';
import { connect } from "react-redux";
import { loadTransactions } from '../actions/transactions';

const platformStyle = variable.platformStyle;
const platform = variable.platform;

const styles = StyleSheet.create({
  
});

const OrderStatusScreen = TabNavigator(
  {
    InProgress: {
      screen: props => <OrderList status={'progress'} screenProps={props.screenProps} />,
      navigationOptions: {
        tabBarLabel: 'IN PROGRESS'
      }
    },
    Completed: {
      screen: props => <OrderList status={'completed'} screenProps={props.screenProps} />,
      navigationOptions: {
        tabBarLabel: 'COMPLETED'
      }
    }
  },
  {
    swipeEnabled: false,
    lazyLoad: true,
    animationEnabled: false,
    tabBarComponent: TabBarTop,
    tabBarPosition: "top",
    animationEnabled: false,
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: commonColor.brandPrimary
      },
      labelStyle: {
        color: commonColor.brandPrimary,
        fontFamily: commonColor.fontFamily,
        fontWeight: "800"
      },
      style: {
        backgroundColor: "#fff"
      }
    }
  }
);

class HistoryScreen extends React.Component {

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>HISTORY</Title>
          </Body>
          <Right />
        </Header>
        <OrderStatusScreen screenProps={this.props.screenProps} onNavigationStateChange={null}/>
      </Container>
    );
  }
}

export default connect()(HistoryScreen);
