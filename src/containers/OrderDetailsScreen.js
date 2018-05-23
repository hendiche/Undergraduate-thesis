import React from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  PixelRatio,
  Alert
} from "react-native";
import {
  Container,
  Header,
  Body,
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
  Spinner,
} from "native-base";
import StarRating from "react-native-star-rating";
import Communications from 'react-native-communications';
import commonColor from "../../native-base-theme/variables/commonColor";
import variable from "../../native-base-theme/variables/platform";
import api from "../lib/api";
import moment from "moment";
import { connect } from "react-redux";
import { loadUser } from "../actions/user";
import {
  loadWaitingTransactions,
  loadProgressTransactions,
  loadCompletedTransactions
} from "../actions/transactions";
import PropTypes from "prop-types";
import Transfer from '../components/Transfer';

const platformStyle = variable.platformStyle;
const platform = variable.platform;

class OrderDetailsScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { order } = props.navigation.state.params;
    this.state = {
      refreshing: true,
      order,
      size: 0,
      rating: 0,
      comment: "",
      pay: false
    };
  }

  componentDidMount() {
    const { order } = this.state;
    api
      .transaction(order.id)
      .then(order => {
        let rating = 0;
        let comment = "";
        if (order.review) {
          rating = order.review.rating;
          comment = order.review.message;
        }
        this.setState({ order, rating, comment, refreshing: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderDriverButton() {
    const { order } = this.state;
    const { user } = this.props;
    let result = null;
    if (user.role === "driver") {
      if (order.status === 0) {
        result = (
          <Button full style={styles.btnAccept} onPress={this._onAccept}>
            <Text>ACCEPT</Text>
          </Button>
        );
      } else if (order.status === 1) {
        result = (
          <Button full style={styles.btnAccept} onPress={this._onComplete}>
            <Text>COMPLETE</Text>
          </Button>
        );
      }
    } else if (order.status === 2) {
      result = (
        <Form style={styles.form}>
          <View style={{ marginTop: 10, width: 200, alignSelf: "center" }}>
            <StarRating
              disabled={order.review != null}
              maxStars={5}
              rating={this.state.rating}
              starSize={30}
              selectedStar={rating => this.setState({ rating })}
              starColor={commonColor.brandPrimary}
              emptyStarColor={commonColor.brandPrimary}
            />
          </View>
          {(order.review != null && order.review.message) ||
          order.review === null ? (
            <Item last>
              <Icon active name="ios-mail-outline" />
              <Input
                placeholder="Write your comment"
                value={this.state.comment}
                disabled={order.review != null}
                onChangeText={comment => this.setState({ comment })}
              />
            </Item>
          ) : null}
          {order.review == null && (
            <Button full style={{ margin: 10 }} onPress={this._onRate}>
              <Text>RATE</Text>
            </Button>
          )}
        </Form>
      );
    }
    return result;
  }

  render() {
    const { order, refreshing } = this.state;
    const { user } = this.props;
    let discount = 0;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>ORDER #{order.code}</Title>
          </Body>
          <Right />
        </Header>
        {refreshing ? (
          <Spinner style={{ flex: 1 }} color={commonColor.brandPrimary} />
        )
        : this.state.pay && (order.status === 4 && order.paymentConfirmation) ? (
          <Transfer 
            paymentConfirmation={order.paymentConfirmation} 
            onCancel={() => {
              this.props.dispatch(loadProgressTransactions());
              this.props.dispatch(loadCompletedTransactions());
              this.props.navigation.goBack();
            }}
            onConfirm={() => this.props.navigation.goBack()}
          />
        ) 
        : (
          <View style={{ flex: 1 }}>
            <Content>
              <Form style={styles.form}>
                <View style={styles.detailTitle}>
                  <Text style={styles.detailsText}>DETAILS</Text>
                  <Text style={styles.statusText} uppercase>
                    {order.statusInString}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: commonColor.listDividerBg,
                    height: 1
                  }}
                />
                {
                  order.details.map((item, index) => {
                    discount += parseFloat(item.discountedPrice);
                    return (
                      <View style={styles.orderType} key={index}>
                        <View style={styles.orderDetail}>
                          <Text>Amount</Text>
                          <Text style={styles.valueDetails}>
                            Rp {Number(item.amount).formatMoney(2)}
                          </Text>
                        </View>
                        <View style={[styles.orderDetail, { marginTop: 10 }]}>
                          <Text>Description</Text>
                          <Text style={styles.valueDetails}>
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                }
                <View
                  style={{
                    backgroundColor: commonColor.listDividerBg,
                    height: 1
                  }}
                />
                <Text style={{padding: 10}}>ADDRESS</Text>
                <View
                  style={{
                    backgroundColor: commonColor.listDividerBg,
                    height: 1
                  }}
                />
                <Text style={{padding: 10}}>{order.address}</Text>
                <View
                  style={{
                    backgroundColor: commonColor.listDividerBg,
                    height: 1
                  }}
                />
                <View style={styles.pricing}>
                  <View style={styles.timeView}>
                    <Text style={styles.timeText}>
                      {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Text>
                  </View>
                  <View style={styles.timeView}>
                    <Text>Cost</Text>
                    <Text style={styles.priceText}>
                      Rp {(Number(order.amount) + discount).formatMoney()}
                    </Text>
                  </View>
                  <View style={styles.timeView}>
                    <Text>Discount</Text>
                    <Text style={styles.priceText}>
                      {discount
                        ? `Rp ${discount.formatMoney()}`
                        : "-"}
                    </Text>
                  </View>
                  <View style={styles.timeView}>
                    <Text>Total Price</Text>
                    <Text style={styles.priceText}>
                      Rp {Number(order.amount).formatMoney()}
                    </Text>
                  </View>
                </View>
              </Form>
              {this.renderDriverButton()}
              {order.status === 0 &&
                user.role != "driver" && (
                  <Button
                    style={{ margin: 10 }}
                    full
                    danger
                    onPress={this._onCancel}
                  >
                    <Text>CANCEL</Text>
                  </Button>
                )}
                {order.status === 4 &&
                  user.role != "driver" && (
                    <Button
                      style={{ margin: 10 }}
                      full
                      onPress={() => this.setState({pay: true})}
                    >
                      <Text>PAY</Text>
                    </Button>
                  )}
            </Content>
            {order.status == 1 &&
              user.role == "driver" && (
                <View
                  style={{
                    borderTopColor: commonColor.cardBorderColor,
                    borderTopWidth: 1,
                    backgroundColor: "white",
                    paddingTop: 10
                  }}
                >
                  <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 18}}>{order.user.name}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Button style={{flex: 1, justifyContent: 'center'}} 
                    onPress={this._onCall}
                    transparent iconLeft>
                      <Icon name='ios-call' />
                      <Text>CALL</Text>
                    </Button>
                    <Button style={{flex: 1, justifyContent: 'center'}} 
                    onPress={this._onMessage}
                    transparent iconLeft>
                      <Icon name='ios-text' />
                      <Text>MESSAGE</Text>
                    </Button>
                  </View>
                </View>
              )}
          </View>
        )}
      </Container>
    );
  }

  _onCall = () => {
    const { user } = this.state.order;
    if (user.profile) {
      Communications.phonecall('+62' + user.profile.phone, false);
    }
  }

  _onMessage = () => {
    const { user } = this.state.order;
    if (user.profile) {
      Communications.text('+62' + user.profile.phone);
    }
  }

  _onCancel = () => {
    Alert.alert("Cancel Order", "Are you sure want to cancel this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          const { order } = this.state;
          this.context.showSpinner(true);
          api
            .cancelTransaction(order.id)
            .then(res => {
              this.context.showSpinner(false);
              this.props.dispatch(loadUser());
              this.props.dispatch(loadProgressTransactions());
              this.props.dispatch(loadCompletedTransactions());
              this.props.navigation.goBack();
            })
            .catch(err => {
              this.context.showSpinner(false);
              console.log(err);
              requestAnimationFrame(() => {
                Alert.alert("Error", err.message);
              });
            });
        }
      }
    ]);
  };

  _onAccept = () => {
    const { order } = this.state;
    this.context.showSpinner(true);
    api
      .acceptTransaction(order.id)
      .then(res => {
        this.context.showSpinner(false);
        this.props.dispatch(loadWaitingTransactions());
        this.props.dispatch(loadProgressTransactions());
        this.props.navigation.goBack();
      })
      .catch(err => {
        this.context.showSpinner(false);
        console.log(err);
        requestAnimationFrame(() => {
          Alert.alert("Error", err.message);
        });
      });
  };

  _onComplete = () => {
    const { order } = this.state;
    this.context.showSpinner(true);
    api
      .completeTransaction(order.id)
      .then(res => {
        this.context.showSpinner(false);
        this.props.dispatch(loadProgressTransactions());
        this.props.dispatch(loadCompletedTransactions());
        this.props.dispatch(loadUser());
        this.props.navigation.goBack();
      })
      .catch(err => {
        this.context.showSpinner(false);
        console.log(err);
        requestAnimationFrame(() => {
          Alert.alert("Error", err.message);
        });
      });
  };

  _onRate = () => {
    const { order } = this.state;
    this.context.showSpinner(true);
    api
      .reviewTransaction(order.id, this.state.rating, this.state.comment)
      .then(review => {
        const order = this.state.order;
        order.review = review;
        this.setState({ order });
        this.context.showSpinner(false);
      })
      .catch(err => {
        this.context.showSpinner(false);
        console.log(err);
        requestAnimationFrame(() => {
          Alert.alert("Error", err.message);
        });
      });
  };
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#fff",
    marginTop: 10,
    borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    borderBottomColor: variable.cardBorderColor
  },
  detailTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 10
  },
  statusText: {
    flex: 1,
    textAlign: "right",
    fontWeight: "800"
  },
  order: {
    height: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  orderType: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 10
  },
  orderTypeDetail: {
    flex: 1,
    justifyContent: "center"
  },
  orderDetail: {
    flexDirection: "row",
  },
  typeText: {
    textAlign: "right"
  },
  valueDetails: {
    flex: 1,
    textAlign: "right",
  },
  pricing: {
    padding: 10
  },
  timeView: {
    flexDirection: "row",
    paddingVertical: 7,
    justifyContent: "center"
  },
  timeText: {
    flex: 1,
    textAlign: "right"
  },
  priceText: {
    flex: 1,
    textAlign: "right",
    fontWeight: "400"
  },
  btnAccept: {
    margin: 10
  }
});

function select({ user }) {
  return {
    user
  };
}

export default connect(select)(OrderDetailsScreen);
