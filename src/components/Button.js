// @flow

import React from "react";

import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity
        {...this.props}
        style={[styles.container, this.props.style]}
      >
        <Text style={styles.title}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    padding: 12
  },
  title: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
