import React, { useContext, useRef, useState, Component } from "react";
import { TouchableOpacity, Text, View, Image, Animated } from "react-native";
import Colors from "../constants/Colors";

export function FloatingButton({ children, with_text = true, opacity = 0.6 }) {
  const [visible] = useState(new Animated.Value(50));
  const [opc] = useState(new Animated.Value(0));
  const [visible_] = useState(new Animated.Value(50));
  const [right] = useState(new Animated.Value(4)); //4 -> 66
  const [width] = useState(new Animated.Value(46)); //46 -> 70
  const [isOpen, setOpen] = useState(false);
  const [isBg, setBg] = useState(false);

  const show = () => {
    return () => {
      if (!isOpen) {
        setBg(true);

        Animated.parallel([
          Animated.timing(width, {
            toValue: 70,
            duration: 200,
          }),
          Animated.timing(right, {
            toValue: 66,
            duration: 200,
          }),
          Animated.timing(opc, {
            toValue: opacity,
            duration: 200,
          }),
          Animated.timing(visible, {
            toValue: 130,
            duration: 200,
          }),
          Animated.timing(visible_, {
            toValue: 200,
            duration: 200,
          }),
        ]).start(() => {
          setOpen(true);
        });
      } else {
        Animated.parallel([
          Animated.timing(width, {
            toValue: 46,
            duration: 200,
          }),
          Animated.timing(right, {
            toValue: 4,
            duration: 200,
          }),
          Animated.timing(opc, {
            toValue: 0,
            duration: 200,
          }),
          Animated.timing(visible, {
            toValue: 50,
            duration: 200,
          }),
          Animated.timing(visible_, {
            toValue: 50,
            duration: 200,
          }),
        ]).start(() => {
          setOpen(false);
          setBg(false);
        });
      }
    };
  };

  return (
    <View
      style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
    >
      {children}
      {isBg && (
        <Animated.View
          style={{
            flex: 1,
            opacity: opc,
            backgroundColor: "#4a4a4a",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        ></Animated.View>
      )}

      <Animated.View
        style={{
          width: 136,
          height: 46,
          // backgroundColor: 'blue',
          position: "absolute",
          right: 20,
          alignItems: "center",
          bottom: visible,
          flexDirection: "row",
        }}
      >
        {with_text && (
          <Animated.View
            style={{
              width: width,
              backgroundColor: "#FFF",
              height: 30,
              borderRadius: 3,
              position: "absolute",
              right: right,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, color: "#4a4a4a" }}>Add</Text>
          </Animated.View>
        )}

      
      </Animated.View>

      <Animated.View
        style={{
          width: 136,
          height: 46,
          position: "absolute",
          right: 20,
          alignItems: "center",
          bottom: visible_,
          flexDirection: "row",
        }}
      >
        {with_text && (
          <Animated.View
            style={{
              width: width,
              backgroundColor: "#FFF",
              height: 30,
              borderRadius: 3,
              position: "absolute",
              right: right,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, color: "#4a4a4a" }}>Close</Text>
          </Animated.View>
        )}
        <Animated.View
          style={{
            borderRadius: 50,
            width: 46,
            height: 46,
            bottom: 0,
            backgroundColor: "#FFF",
            position: "absolute",
            right: 0,

            borderWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
            elevation: isBg ? 5 : 0,
            margin: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: 20, height: 20, tintColor: "#4a4a4a" }}
            source={require("../assets/icons/ic_close.png")}
          />
        </Animated.View>
      </Animated.View>
      
      <TouchableOpacity
        onPress={show()}
        style={{
          width: 56,
          height: 56,
          backgroundColor: Colors.dark,
          borderRadius: 60,
          position: "absolute",
          bottom: 50,
          right: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            tintColor: Colors.primary,
            resizeMode: "cover",
          }}
          source={require("../assets/icons/ic_plus.png")}
        />
      </TouchableOpacity>
    </View>
  );
}
