import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  PixelRatio
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
import OrderListItem from "../components/OrderListItem";
import api from "../lib/api";
import moment from "moment";
import { connect } from "react-redux";
import {
  loadWaitingTransactions,
  loadProgressTransactions,
  loadCompletedTransactions
} from "../actions/transactions";

const platformStyle = variable.platformStyle;
const platform = variable.platform;

class OrderList extends React.Component {
  constructor() {
    super();
    this.state = {
      refreshing: true,
      size: 0,
      page: 1,
      hasNextPage: false
    };
  }

  componentDidMount() {
    // this._onGetTransactions()
    //   .then(({ response }) => {
    //     this.setState({
    //       loading: false,
    //       hasNextPage: response.nextPageUrl != null
    //     });
    //   })
    //   .catch(err => {
    //     this.setState({ loading: false });
    //   });
    this._onRefresh();
  }

  _onGetTransactions() {
    let promise;
    if (this.props.status === "waiting") {
      promise = this.props.dispatch(loadWaitingTransactions());
    } else if (this.props.status === "progress") {
      promise = this.props.dispatch(loadProgressTransactions());
    } else {
      promise = this.props.dispatch(loadCompletedTransactions());
    }
    return promise;
  }

  _onRefresh = () => {
    let page = 1;
    this.setState({ refreshing: true, page });
    this._onGetTransactions()
      .then(({ response }) => {
        this.setState({
          refreshing: false,
          hasNextPage: response.nextPageUrl != null
        });
      })
      .catch(err => {
        this.setState({ refreshing: false });
      });
  };

  _onLoadMore = () => {
    if (this.state.hasNextPage) {
      let page = this.state.page + 1;
      this.setState({ page });
      let promise;
      if (this.props.user.role === "driver") {
        promise = api.driverTransactions(this.props.status, page);
      } else {
        promise = api.transactions(this.props.status, page);
      }
      promise
        .then(response => {
          this.setState({
            data: [...this.state.data, ...response.data],
            hasNextPage: response.nextPageUrl != null
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.transactions });
  }

  render() {
    return (
      <FlatList
        style={{flex: 1}}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        data={this.state.data}
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}
        ListFooterComponent={this._renderFooter}
        onEndReached={this._onLoadMore}
        onEndReachedThreshold={0.5}
      />
    );
  }

  _renderItem = ({ item }) => {
    return <OrderListItem item={item} onPressItem={this._onPressItem} />;
  };

  _renderFooter = () => {
    if (!this.state.hasNextPage) return null;
    return <Spinner />;
  };

  _keyExtractor = (item, index) => item.id;

  _onPressItem = item => {
    const navigation = this.props.screenProps.navigation;
    navigation.navigate("OrderDetails", { order: item });
  };
}

function select({ user, transactions }, props) {
  return {
    user,
    transactions: transactions[props.status]
  };
}

export default connect(select)(OrderList);
