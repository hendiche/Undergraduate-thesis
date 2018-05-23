// @flow

import React from "react";
import { StackNavigator } from "react-navigation";
import { StyleSheet, View, Image, FlatList, PixelRatio } from "react-native";
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
  Form,
  Item,
  Container,
  Input
} from "native-base";
import Wallet from "../components/Wallet";
import commonColor from "../../native-base-theme/variables/commonColor";
import variable from "../../native-base-theme/variables/platform";

const platformStyle = variable.platformStyle;
const platform = variable.platform;

export default class ProductScreen extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    const { navigation } = this.props;
    const { product, merchant, key } = this.props.navigation.state.params;
    return (
      <Container>
        <Header navigation={navigation} style={{ borderBottomWidth: 0 }}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Text style={styles.merchant}>{product.name.toUpperCase()}</Text>
          </Body>
          <Right />
        </Header>
        <Content>
          <Wallet style={{ marginTop: 10 }} navigation={navigation} />
          <View style={styles.service}>
            <Image
              style={styles.image}
              source={{
                uri: product.imageUrl || "http://via.placeholder.com/400x400"
              }}
            />
            <View style={styles.details}>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.price}>
                Rp {Number(product.price).formatMoney()}
              </Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          </View>
          <Button
            full
            style={{ margin: 10 }}
            onPress={() => this.props.navigation.navigate("Order", { product, merchant, key })}
          >
            <Text>ORDER NOW</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  _keyExtractor = (item, index) => index;
}

const styles = StyleSheet.create({
  merchant: {
    color: "#fff",
    fontSize: 15,
    letterSpacing: 4
  },
  service: {
    marginTop: 10,
    backgroundColor: "white",
    paddingBottom: 20,
    borderBottomWidth:
      platform === "ios" ? 1 / PixelRatio.getPixelSizeForLayoutSize(1) : 0,
    borderBottomColor: variable.toolbarDefaultBorder
  },
  image: {
    height: 180,
    backgroundColor: "gray"
  },
  details: {
    padding: 10,
    paddingBottom: 0
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    marginTop: 10
  },
  list: {
    fontSize: 10,
    marginTop: 15,
    marginLeft: 30
  },
  payment: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    margin: 10,
    elevation: 2,
    borderBottomWidth:
      platform === "ios" ? 1 / PixelRatio.getPixelSizeForLayoutSize(1) : 0,
    borderBottomColor: variable.toolbarDefaultBorder
  },
  price: {
    marginTop: 5,
    fontWeight: '400'
  }
});
