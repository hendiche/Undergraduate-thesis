// @flow

import React from "react";
import { StackNavigator } from "react-navigation";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  SectionList,
  Dimensions,
  Image,
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
  Tab,
  Tabs,
  Footer,
  ScrollableTab,
  FooterTab,
  Spinner,
} from "native-base";
import commonColor from "../../native-base-theme/variables/commonColor";
import Swiper from "react-native-swiper";
import Wallet from "../components/Wallet";
import PropTypes from "prop-types";
import api from "../lib/api";

export default class MerchantScreen extends React.Component {

  constructor(props) {
    super(props);
    const { merchant } = props.navigation.state.params;
    this.state = {
      refreshing: true,
      data: [],
      size: 0,
      category: merchant.categories.length > 0 ? merchant.categories[0] : null,
    };
  }

  componentDidMount() {
    this._onRefresh();
  }
  
  _onRefresh = () => {
    this.setState({ refreshing: true });
    const { merchant } = this.props.navigation.state.params;
    const { category } = this.state;
    api.getMerchantProducts(merchant.id, category ? category.id : 0)
    .then(merchants => {
      this.setState({ refreshing: false, data: merchants });
    })
    .catch(err => {
      this.setState({ refreshing: false });
    });
  }

  render() {
    const { navigation } = this.props;
    const { merchant } = this.props.navigation.state.params;
    return (
      <Container>
        <Header navigation={navigation} style={{ borderBottomWidth: 0 }}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{merchant.name.toUpperCase()}</Title>
          </Body>
          <Right />
        </Header>
        <Wallet style={{ marginTop: 10 }} navigation={navigation} />
        <SectionList
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          onLayout={this._handleLayout}
          sections={[
            {
              data: [{ key: "", data: this.state.data }],
              swipers: merchant.swipers,
              key: "section"
            }
          ]}
          renderItem={({ item }) => (
            <FlatList
              numColumns={2}
              data={item.data}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          )}
          renderSectionHeader={this._renderSectionHeader}
          stickySectionHeadersEnabled={false}
        />
        <View style={{ height: 45, backgroundColor: 'white' }}>
          <Tabs
            onChangeTab={this._onChangeTab}
            initialPage={0}
            tabBarPosition="bottom"
            renderTabBar={() => <ScrollableTab style={{ height: 45 }} />}
          >
            {merchant.categories.map((item, index) => {
              return <Tab key={index} heading={item.name} />;
            })}
            <Tab heading="All" />
          </Tabs>
        </View>
      </Container>
    );
  }

  _onChangeTab = (tab) => {
    const { merchant } = this.props.navigation.state.params;
    const { categories } = merchant;
    let category;
    if (tab.i < categories.length) {
      category = categories[tab.i];
    }
    this.setState({ category }, () => this._onRefresh());
  };

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => {
    return (
      <ProductListItem
        size={this.state.size}
        item={item}
        onPressItem={this._onPressItem}
      />
    );
  };

  _renderSectionHeader = ({ section }) => {
    return (
      <View>
        {section.swipers.length > 0 ? (
          <View style={{ height: 200, marginTop: 10 }}>
            <Swiper
              style={{ height: 200 }}
              autoplay={false}
              loop={false}
              activeDotColor={commonColor.brandPrimary}
            >
              {section.swipers.map((swiper, i) => {
                return (
                  <Image
                    key={i}
                    style={styles.image}
                    source={{
                      uri:
                        swiper.imageUrl || "http://via.placeholder.com/400x400",
                      height: 200
                    }}
                  />
                );
              })}
            </Swiper>
          </View>
        ) : null}
      </View>
    );
  };

  _handleLayout = event => {
    const { height, width } = Dimensions.get("window");
    const size = width / 2;
    this.setState({ size });
  };

  _onPressItem = item => {
    const navigation = this.props.navigation;
    const { merchant } = this.props.navigation.state.params;
    navigation.navigate("Product", { product: item, merchant, key: this.props.navigation.state.key });
  };
}

class ProductListItem extends React.PureComponent {
  render() {
    const { navigation, item, size } = this.props;
    return (
      <TouchableOpacity
        style={{ width: size, paddingHorizontal: 5, paddingTop: 5 }}
        onPress={this._onPress}
      >
        <View style={{ height: size, backgroundColor: "white" }}>
          <Image
            style={{
              resizeMode: "cover"
            }}
            source={{
              uri: item.imageUrl || "http://via.placeholder.com/400x400",
              height: size / 1.6,
              width: size - 10
            }}
          />
          <Text style={styles.name}>{item.name}</Text>
          <Text numberOfLines={3} style={styles.description}>
            Rp {Number(item.price).formatMoney()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };
}

const styles = StyleSheet.create({
  merchant: {
    color: "#fff",
    fontSize: 15,
    letterSpacing: 4
  },
  slide: {
    justifyContent: "center",
    alignItems: "stretch"
  },
  image: {
    alignSelf: "stretch"
  },
  text: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold"
  },
  name: {
    fontWeight: "500",
    margin: 8
  },
  description: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 12
  }
});
