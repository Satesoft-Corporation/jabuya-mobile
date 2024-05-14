import React, { Component } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

class Snackbar extends Component {
  constructor() {
    super();
    this.animatedValue = new Animated.Value(150);
    this.ShowSnackBar = false;
    this.state = {
      SnackBarInsideMsgHolder: "",
    };
  }

  show(
    SnackBarInsideMsgHolder = "Default SnackBar Message...",
    duration = 4000
  ) {
    if (this.ShowSnackBar === false) {
      this.setState({
        SnackBarInsideMsgHolder: SnackBarInsideMsgHolder,
        SnackBarDuration: duration,
      });
      this.ShowSnackBar = true;
      Animated.timing(this.animatedValue, {
        toValue: 50,
        duration: 400,
        useNativeDriver: true,
      }).start(this.hide(duration));
    }
  }

  hide = (duration) => {
    this.timerID = setTimeout(() => {
      Animated.timing(this.animatedValue, {
        toValue: 150,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        this.ShowSnackBar = false;
        clearTimeout(this.timerID);
      });
    }, duration);
  };

  isVisible = () => {
    return this.ShowSnackBar === true;
  };

  render() {
    return (
      <Animated.View
        style={[
          { transform: [{ translateY: this.animatedValue }] },
          styles.SnackBarContainter,
        ]}
      >
        <Text numberOfLines={3} style={styles.SnackBarMessage}>
          {this.state.SnackBarInsideMsgHolder}
        </Text>
      </Animated.View>
    );
  }
}

export default Snackbar;

const styles = StyleSheet.create({
  SnackBarContainter: {
    position: "absolute",
    backgroundColor: Colors.dark,
    flexDirection: "row",
    alignItems: "flex-start",
    elevation: 10,
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 55,
    paddingBottom: 10,
  },
  SnackBarMessage: {
    color: "#fff",
    fontSize: 14,
  },
});
