import { View, Text, Image } from "react-native";
import React from "react";
import OutlinedButton from "../components/buttons/OutlinedButton";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const UpdateScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 500,
        }}
      >
        Update Duquat
      </Text>
      <Image
        source={require("../assets/icons/icon2.png")}
        style={{
          height: 250,
          width: 250,
          resizeMode: "contain",
        }}
      />
      <Text style={{ fontSize: 15 }}>
        The current app version you are using is out of date and you will need
        to upgrade to the latest version for better experience.
      </Text>

      <View style={{ marginTop: 15 }}>
        <PrimaryButton
          title={"Update"}
          width={screenWidth - 30}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default UpdateScreen;
