import React from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity
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
  ActionSheet
} from "native-base";
import commonColor from "../../native-base-theme/variables/commonColor";
import api from "../lib/api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";

class Transfer extends React.Component {
  static contextTypes = {
    showSpinner: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { paymentConfirmation } = props;
    console.log(paymentConfirmation);
    this.state = {
      bank: { id: paymentConfirmation.bankId },
      proofImage: paymentConfirmation.proofImageUrl
        ? { uri: paymentConfirmation.proofImageUrl, credentials: 'omit' }
        : null,
      proofImageUpdated: false,
      name: paymentConfirmation.name
    };
  }

  _onAddImage = () => {
    ActionSheet.show(
      {
        title: "Add Proof of Payment",
        options: ["Take Photo", "Choose from Library", "Cancel"],
        cancelButtonIndex: 2
      },
      buttonIndex => {
        const options = {
          compressImageMaxWidth: 500,
          compressImageMaxHeight: 800,
          cropping: false,
          mediaType: "photo"
        };
        let picker;
        if (buttonIndex == 0) {
          picker = ImagePicker.openCamera(options);
        } else if (buttonIndex == 1) {
          picker = ImagePicker.openPicker(options);
        }
        if (picker != null) {
          picker
            .then(image => {
              console.log('image', image);
              this.setState({
                proofImage: {
                  uri: image.path,
                  name: 'proof.jpg',
                  type: image.mime
                },
                proofImageUpdated: true
              });
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    );
  };

  _renderRow = bank => {
    return (
      <TouchableOpacity key={bank.id} onPress={() => this.setState({ bank })}>
        <View style={styles.row}>
          <Image
            style={{ width: 8, height: 8, marginRight: 10 }}
            source={
              this.state.bank && this.state.bank.id == bank.id
                ? require("../images/check.png")
                : require("../images/uncheck.png")
            }
            resizeMode="contain"
          />
          <Image
            style={{ width: 50, height: 50, resizeMode: "contain" }}
            source={{ uri: bank.imageUrl }}
          />
          <Text style={{ flex: 1, marginLeft: 10, fontWeight: "bold" }}>
            {bank.name}
          </Text>
          <Text style={{ fontWeight: "bold" }}>{bank.accountNumber}</Text>
        </View>
        <View
          style={{ backgroundColor: commonColor.listDividerBg, height: 1 }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation } = this.props;
    const { paymentConfirmation } = this.props;
    const total = paymentConfirmation.amount + Number(paymentConfirmation.uniqueCode);
    return (
      <Content>
        <Text style={{ padding: 10, fontWeight: "bold" }}>SUMMARY</Text>
        <Form style={styles.form}>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Balance</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              Rp {paymentConfirmation.amount.formatMoney()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Unique Code</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {paymentConfirmation.uniqueCode}
            </Text>
          </View>
          <View
            style={{ backgroundColor: commonColor.listDividerBg, height: 1 }}
          />
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Total</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              Rp {total.formatMoney()}
            </Text>
          </View>
        </Form>
        <Text style={{ padding: 10, fontWeight: "bold" }}>SELECT A BANK</Text>
        <Form style={styles.form}>
          {this.props.config.bankInformation.map(bank => this._renderRow(bank))}
        </Form>
        <Text style={{ padding: 10, fontWeight: "bold" }}>YOUR NAME</Text>
        <Form style={[styles.form, { paddingHorizontal: 5 }]}>
          <Input
            value={this.state.name}
            placeholder="Type here"
            onChangeText={name => this.setState({ name })}
          />
        </Form>
        <Text style={{ padding: 10, fontWeight: "bold" }}>
          PROOF OF PAYMENT (OPTIONAL)
        </Text>
        <Form style={styles.form}>
          <TouchableOpacity
            style={{ justifyContent: "center", height: 200 }}
            onPress={this._onAddImage}
          >
            {this.state.proofImage ? (
              <Image
                style={{
                  flex: 1,
                  width: null,
                  height: null,
                  resizeMode: "cover"
                }}
                source={this.state.proofImage}
              />
            ) : (
              <Text style={{ alignSelf: "center" }}>Click here to add</Text>
            )}
          </TouchableOpacity>
        </Form>
        <Button
          style={{ marginHorizontal: 10, marginTop: 10 }}
          onPress={this._onConfirm}
          full
        >
          <Text>{paymentConfirmation.status == 0 ? "CONFIRM" : "UPDATE"}</Text>
        </Button>
        <Button
          style={{ margin: 10 }}
          onPress={this._onCancel}
          danger
          full
        >
          <Text>CANCEL</Text>
        </Button>
      </Content>
    );
  }

  _onConfirm = () => {
    const { paymentConfirmation } = this.props;
    const { bank, name, proofImage, proofImageUpdated } = this.state;
    if (!bank) {
      Alert.alert("Error", "Please select a bank");
      return;
    } else {
      if (!bank.id) return Alert.alert('Warning', 'Please select a bank');
    }
    
    if (!name) {
      return Alert.alert('Warning', 'Please input your name');
    }
    this.context.showSpinner(true);
    api
      .confirmPayment(
        paymentConfirmation.id,
        bank.id,
        name,
        proofImageUpdated ? proofImage : null
      )
      .then(response => {
        this.context.showSpinner(false);
        requestAnimationFrame(() => {
          Alert.alert(
            "Payment Confirmation",
            "Please wait for admin confirmation",
            [
              {
                text: "OK",
                onPress: () => {
                  this.props.onConfirm && this.props.onConfirm();
                }
              }
            ]
          );
        });
      })
      .catch(err => {
        this.context.showSpinner(false);
        requestAnimationFrame(() => {
          Alert.alert("Error", err.message);
        });
      });
  };

  _onCancel = () => {
    Alert.alert("Cancel", "Are you sure want to continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          const { paymentConfirmation } = this.props;
          this.context.showSpinner(true);
          api
            .cancelPayment(paymentConfirmation.id)
            .then(res => {
              this.context.showSpinner(false);
              this.props.onCancel && this.props.onCancel();
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
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#fff"
  },
  balanceText: {
    marginTop: 4,
    marginLeft: 10,
    fontWeight: "900"
  },
  row: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center"
  },
  topUpValueText: {
    textAlign: "right",
    flex: 1,
    marginTop: 5
  }
});

function select({ config }) {
  return {
    config
  };
}

export default connect(select)(Transfer);
