import { View, Text, Image, Linking } from "react-native";
import React from "react";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
let url = "https://play.google.com/store/apps/details?id=com.byaffe.duqact";

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
        Update Duqact
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
          onPress={() => {
            Linking.openURL(url);
          }}
        />
      </View>
    </View>
  );
};

export default UpdateScreen;
