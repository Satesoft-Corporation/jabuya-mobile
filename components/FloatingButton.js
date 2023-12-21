import React, { useState } from "react";
import { TouchableOpacity, Text, View, Image, Animated } from "react-native";
import Colors from "../constants/Colors";

export function FloatingButton({
  children,
  with_text = true,
  opacity = 0.8,
  handlePress,
  isAttendant,
}) {
  const [visible] = useState(new Animated.Value(50));
  const [opc] = useState(new Animated.Value(0));
  const [visible_] = useState(new Animated.Value(50));
  const [right] = useState(new Animated.Value(4)); //4 -> 66
  const [width] = useState(new Animated.Value(46)); //46 -> 70
  const [isOpen, setOpen] = useState(false);
  const [isBg, setBg] = useState(false);

  let buttonBg = Colors.dark;
  let iconTint = Colors.primary;
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
            useNativeDriver: true,
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
            useNativeDriver: true,
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
            backgroundColor: Colors.dark,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        ></Animated.View>
      )}

      {isAttendant===false && <>
        <Animated.View
        style={{
          width: 136,
          height: 46,
          position: "absolute",
          right: 10,
          alignItems: "center",
          bottom: visible,
          flexDirection: "row",
          marginBottom: -15,
          opacity: isOpen ? 1 : 0,
        }}
      >
        {with_text && (
          <Animated.View
            style={{
              width: 80,
              backgroundColor: "#FFF",
              height: 25,
              borderRadius: 3,
              position: "absolute",
              right: right,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handlePress}>
              <Text
                style={{
                  fontSize: 13,
                  color: "#4a4a4a",
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                Restock
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <Animated.View
          style={{
            borderRadius: 50,
            width: 40,
            height: 40,
            bottom: 3,
            backgroundColor: buttonBg,
            position: "absolute",
            right: 20,

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
          <TouchableOpacity onPress={handlePress}>
            <Image
              style={{
                width: 25,
                height: 25,
                tintColor: iconTint,
                alignSelf: "center",
                resizeMode: "cover",
              }}
              source={require("../assets/icons/icons8-stock-rotation-32.png")}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{
          width: 136,
          height: 46,
          position: "absolute",
          right: 10,
          alignItems: "center",
          bottom: visible_,
          flexDirection: "row",
          marginBottom: -25,
          opacity: isOpen ? 1 : 0,
        }}
      >
        {with_text && (
          <Animated.View
            style={{
              width: 80,
              backgroundColor: "#FFF",
              height: 25,
              borderRadius: 3,
              position: "absolute",
              right: right,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={handlePress}>
              <Text
                style={{
                  fontSize: 13,
                  color: "#4a4a4a",
                  textAlign: "right",
                  opacity: isOpen ? 1 : 0,
                  fontWeight: 600,
                }}
              >
                List product
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <Animated.View
          style={{
            borderRadius: 50,
            width: 40,
            height: 40,
            bottom: 3,
            backgroundColor: buttonBg,
            position: "absolute",
            right: 20,

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
          <TouchableOpacity onPress={handlePress}>
            <Image
              style={{
                width: 25,
                height: 25,
                tintColor: iconTint,
                alignSelf: "center",
              }}
              source={require("../assets/icons/icons8-box-50.png")}
            />
          </TouchableOpacity>
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
      </TouchableOpacity></>}
    </View>
  );
}
