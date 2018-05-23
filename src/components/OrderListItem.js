import React from "react";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  PixelRatio
} from "react-native";
import commonColor from "../../native-base-theme/variables/commonColor";
import variable from "../../native-base-theme/variables/platform";
import moment from "moment";
import {
  Text,
} from "native-base";

const platformStyle = variable.platformStyle;
const platform = variable.platform;

export default class OrderListItem extends React.PureComponent {
  
  render() {
    const { item } = this.props;
    const img = item.merchant ? item.merchant.logoUrl : 'https://www.placehold.it/400x400&text=JEK';
    const merchantName = item.merchant ? item.merchant.name : '-';
    const product = item.details.length > 0 ? item.details[0].description : '-';
    return (
      <TouchableOpacity style={styles.card} onPress={this._onPress}>
        <View style={styles.item}>
          <Image
            source={{ uri: img }}
            resizeMode="cover"
            style={styles.itemImage}
          />
          <View style={styles.itemDesc}>
            <View style={styles.descStatusDate}>
              <Text style={styles.descStatus} uppercase={true}>
                {item.code}
              </Text>
              <Text style={styles.descDate}>
                - {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
            <Text style={styles.itemName}>{merchantName}</Text>
            <Text style={styles.descProduct}>{product}</Text>
            <Text style={styles.descType} uppercase={true}>
              {item.statusInString}
            </Text>
          </View>
          <Image
            source={require("../images/right_arrow.png")}
            style={styles.ImageArror}
          />
        </View>
      </TouchableOpacity>
    );
  }

  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };
}

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
    backgroundColor: "white",
    borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    borderBottomColor: variable.cardBorderColor,
  },
  item: {
    flexDirection: "row",
    padding: 10,
  },
  itemImage: {
    alignSelf: "center",
    width: 56,
    height: 56,
    resizeMode: 'cover',
  },
  ImageArror: {
    alignSelf: "center",
  },
  itemDesc: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center"
  },
  descStatusDate: {
    flexDirection: "row",
  },
  descStatus: {
    fontWeight: "500",
    fontSize: 10,
    letterSpacing: 0.4,
    color: "#4a4a4a"
  },
  descDate: {
    flex: 1,
    fontSize: 10,
    fontWeight: "400",
    marginLeft: 4,
    letterSpacing: 0.4,
    color: "#6d6e71"
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 4,
    color: commonColor.brandPrimary
  },
  descFooter: {
    flexDirection: "row",
    justifyContent: "center",
  },
  descType: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFCC00",
    marginTop: 4,
  },
  descProduct: {
    fontSize: 10,
    fontWeight: "400",
    marginTop: 4,
  },
});
