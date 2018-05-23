// @flow

import React from "react";
import { StackNavigator } from "react-navigation";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image
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
import Wallet from '../components/Wallet';
import OrderList from "../components/OrderList";
import commonColor from "../../native-base-theme/variables/commonColor";
import { connect } from 'react-redux';
import { loadMerchants } from '../actions/merchants';
import { Dropdown } from "react-native-material-dropdown";
import { loadCities } from "../actions/cities";

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      data: [],
      size: 0,
      city: props.cities && props.cities.length > 0 ? props.cities[0] : null,
    };
  }

  componentDidMount() {
    if (this.props.user.role === 'customer') {
      this.props.dispatch(loadCities())
      .then((action) => {
        if (action.cities && action.cities.length > 0) {
          this.setState({city: action.cities[0]}, () => this._onRefresh());
        }
      });
    }
  }

  _onRefresh = () => {
    this.props.dispatch(loadMerchants(this.state.city.id))
    .then(() => {
      this.setState({refreshing: false});
    });
  }
  
  render() {
    const { height, width } = Dimensions.get("window");
    let numCol = 4;
    if (width > height) {
      numCol = 6;
    }
    const { user, cities } = this.props;
    cities.map((city) => {
      city.value = city.name;
      return city;
    });
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Image
              style={{ width: 200, height: 40, resizeMode: "contain" }}
              source={require("../images/ojek_logo.png")}
            />
          </Body>
          <Right />
        </Header>
        {
          user.role == 'driver' ?
          <OrderList status={"waiting"} screenProps={this.props.screenProps} />
        :
          [
            <View key={0} style={styles.banner}>
              <Text style={styles.welcome}>WELCOME</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>,
            <Content key={1}>
              <Wallet style={{marginTop: 10}} navigation={this.props.screenProps.navigation} />
              <Form style={{backgroundColor: "#fff", marginTop: 10}}>
                <Dropdown
                  containerStyle={{
                    paddingHorizontal: 16,
                  }}
                  label=""
                  itemTextStyle={{ textAlign: "center" }}
                  data={cities}
                  value={this.state.city ? this.state.city.name : undefined}
                  dropdownPosition={0}
                  onChangeText={(value, index, data) => {
                    const city = data[index];
                    this.setState({city}, () => this._onRefresh());
                  }}
                />
                {
                  this.state.refreshing ?
                  <Spinner />
                  :
                  <FlatList
                    extraData={this.state}
                    onLayout={this._handleLayout}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    data={this.props.merchants}
                    numColumns={numCol}
                  />
                }
              </Form>
            </Content>
          ]
        }
      </Container>
    );
  }

  _renderItem = ({ item }) => {
    return (
      <ServiceListItem
        navigation={this.props.screenProps.navigation}
        size={this.state.size}
        item={item}
      />
    );
  };

  _handleLayout = event => {
    const { height, width } = Dimensions.get("window");
    const size = width / 4;
    this.setState({ size });
  };

  _keyExtractor = (item, index) => item;
}

const styles = StyleSheet.create({
  banner: {
    height: 125,
    backgroundColor: commonColor.brandPrimary,
    justifyContent: "center"
  },
  welcome: {
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    letterSpacing: 4,
    lineHeight: 33,
  },
  userName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    letterSpacing: 3
  },
  itemTitle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold"
  }
});

class ServiceListItem extends React.PureComponent {
  
  render() {
    const { navigation, item, size } = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Merchant", { merchant: item })}>
        <View style={{ width: size, height: 1.25 * size, padding: 10 }}>
          <Image
            style={{ alignSelf: "center", flex: 1 }}
            source={{ uri: item.logoUrl, width: size - 20 }}
            resizeMode="contain"
          />
          <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
}

function select({ merchants, user, cities }) {
  return {
    merchants,
    user,
    cities,
  };
}

export default connect(select)(HomeScreen);
