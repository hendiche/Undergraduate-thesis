import React from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Picker,
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
  Spinner
} from "native-base";
import commonColor from "../../native-base-theme/variables/commonColor";
import { Dropdown } from "react-native-material-dropdown";
import api from '../lib/api';
import PropTypes from "prop-types";
import { NavigationActions } from "react-navigation";
import Transfer from "../components/Transfer";

export default class TopUpScreen extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func
  };

  constructor() {
    super();
    const data = [];
    for (let i = 1; i <= 20; i++) {
      let value = i * 50;
      data.push({
        value: value.formatMoney()
      });
    }
    this.state = {
      data,
      balance: 0,
      refreshing: true,
      topUp: null
    };
  }

  componentDidMount() {
    api.getTopUp()
    .then(topUp => {
      if (topUp && !_.isEmpty(topUp)) {
        this.setState({refreshing: false, topUp});
      } else {
        this.setState({refreshing: false});
      }
    })
    .catch(err => {
      this.setState({refreshing: false});
      console.log(err);
    });
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Header navigation={navigation} style={{ borderBottomWidth: 0 }}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Text style={styles.merchant}>TOP UP JEK PAY</Text>
          </Body>
          <Right />
        </Header>
        {
          this.state.refreshing ? 
          <Spinner style={{flex: 1}} />
          : 
          this.state.topUp ?
          <Transfer 
            paymentConfirmation={this.state.topUp.paymentConfirmation} 
            onCancel={() => this.setState({topUp: null})}
            onConfirm={() => this.props.navigation.goBack()}
          />
          :
          <Content>
            <Form style={styles.form}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text>Rp</Text>
                <Dropdown
                  containerStyle={{
                    width: 100,
                    paddingHorizontal: 10,
                    paddingBottom: 15
                  }}
                  label=""
                  itemTextStyle={{ textAlign: "center" }}
                  data={this.state.data}
                  onChangeText={this._onChangeBalance}
                />
                <Text>.000</Text>
              </View>
            </Form>
            <Button
              style={{ margin: 10 }}
              onPress={this._onCheckout}
              full
              disabled={this.state.balance <= 0}
            >
              <Text style={{ alignSelf: "center" }}>NEXT</Text>
            </Button>
          </Content>
        }
      </Container>
    );
  }

  _onChangeBalance = (value, index, data) => {
    this.setState({
      balance: Number(value.replace('.', '') + '000')
    });
  }

  _onCheckout = () => {
    this.context.showSpinner(true);
    api.topUp(this.state.balance)
    .then(topUp => {
      this.context.showSpinner(false);
      this.setState({topUp});
    })
    .catch(err => {
      this.context.showSpinner(false);
      requestAnimationFrame(() => {
        Alert.alert("Error", err.error);
      });
    });
  }
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#fff",
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10
  },
  cashbackText: {
    marginLeft: 50,
    marginBottom: 12,
    marginTop: 5
  },
  selectionImage: {
    width: 8,
    height: 8,
    marginTop: 10
  },
  merchant: {
    color: "#fff",
    fontSize: 15,
    letterSpacing: 4
  }
});
