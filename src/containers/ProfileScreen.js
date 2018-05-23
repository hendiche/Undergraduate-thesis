// @flow

import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList
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
import { StackNavigator, NavigationActions } from "react-navigation";
import { navigateOnce } from "../lib/navigator";
import { connect } from "react-redux";
import commonColor from "../../native-base-theme/variables/commonColor";
import Wallet from "../components/Wallet";
import api from "../lib/api";
import moment from 'moment';

class ProfileScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      refreshing: true,
      data: [],
      page: 1,
      hasNextPage: false,
    };
  }

  componentDidMount() {
    this._onRefresh();
  }

  _onRefresh = () => {
    let page = 1;
    this.setState({refreshing: true, page});
    api.mutations(page)
    .then(response => {
      this.setState({
        data: response.data,
        refreshing: false,
        hasNextPage: response.nextPageUrl != null
      });
    });
  };

  _onLoadMore = () => {
    if (this.state.hasNextPage) {
      let page = this.state.page + 1;
      this.setState({ page });
      api.mutations(page)
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
    if (nextProps.user.isLoggedIn) {
      if (nextProps.user.balance !== this.props.user.balance) {
        this._onRefresh();
      }
    }
  }

  render() {
    const { user } = this.props;
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
        <View style={styles.banner}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.profile ? (
            <Text style={styles.email}>+62 {user.profile.phone}</Text>
          ) : null}
          <TouchableOpacity
            onPress={() =>
              this.props.screenProps.navigation.navigate("EditProfile")}
            style={styles.editProfile}
          >
            <Text style={styles.editProfileText}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>
        <Wallet
          style={{ marginTop: 10 }}
          navigation={this.props.screenProps.navigation}
        />
        <Form style={{ flex: 1, marginTop: 10, backgroundColor: "#fff" }}>
          <Item last>
            <Text style={{ paddingVertical: 10, fontWeight: "bold" }}>
              HISTORY
            </Text>
          </Item>
          <FlatList
            data={this.state.data}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onPressItem={this._onPressItem}
            ListFooterComponent={this._renderFooter}
            onEndReached={this._onLoadMore}
            onEndReachedThreshold={0.5}
          />
        </Form>
      </Container>
    );
  }

  _renderItem = ({ item }) => <ListItem item={item} />;

  _renderFooter = () => {
    if (!this.state.hasNextPage) return null;
    return <Spinner />;
  };

  _keyExtractor = (item, index) => item.id;
}

class ListItem extends React.PureComponent {
  render() {
    const { item } = this.props;
    return (
      <Item last>
        <View style={{ paddingVertical: 10, paddingRight: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{flex: 1}}>
            <Text style={{fontWeight: 'bold'}}>
              {moment(item.createdAt).format('DD-MM-YYYY')}
            </Text>
            <Text style={{marginTop: 5}}>
              {item.description}
            </Text>
          </View>
          <Text style={{ fontWeight: "bold" }}>
            Rp {item.amount}
          </Text>
        </View>
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center"
  },
  banner: {
    height: 185,
    backgroundColor: commonColor.brandPrimary,
    justifyContent: "center",
    alignItems: "center"
  },
  name: {
    textAlign: "center",
    color: "#fff",
    fontSize: 32,
    letterSpacing: 5,
    lineHeight: 33
  },
  email: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    letterSpacing: 3,
    lineHeight: 25
  },
  editProfile: {
    justifyContent: "center",
    width: 100,
    marginTop: 20,
    marginBottom: 30
  },
  editProfileText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600"
  },
  logout: {
    marginVertical: 15,
    marginHorizontal: 20
  }
});

function select({ user }) {
  return {
    user
  };
}

export default connect(select)(ProfileScreen);
