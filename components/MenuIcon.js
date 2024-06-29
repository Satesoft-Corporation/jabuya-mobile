import { TouchableOpacity, Image, View, Text } from "react-native";
import React, { useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import Colors from "@constants/Colors";
import { SaleEntryContext } from "context/SaleEntryContext";
import { CREDIT_SALES } from "@navigation/ScreenNames";

export function MenuIcon({
  icon,
  containerStyle,
  onPress,
  iconStyle,
  titleStyle,
}) {
  return (
    <TouchableOpacity
      key={icon.id}
      activeOpacity={0.8}
      style={{
        flex: 1,
        alignItems: "center",
        margin: 5,
        borderRadius: 5,
        backgroundColor: Colors.light,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        padding: 5,
        width: 200,
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <View
        key={icon.id}
        style={[
          {
            height: 55,
            width: 55,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          },
          containerStyle,
        ]}
      >
        <Image
          source={icon.icon}
          style={[
            {
              width: 35,
              height: 35,
              tintColor: Colors.dark,
            },
            iconStyle,
          ]}
        />
      </View>
      <Text
        style={[
          {
            color: Colors.dark,
            fontSize: scale(15),
            margin: 10,
            fontWeight: "500",
            textAlign: "center",
          },
          titleStyle,
        ]}
      >
        {icon.title}
      </Text>
    </TouchableOpacity>
  );
}

export const IconsComponent = () => {
  const { clearEverything } = useContext(SaleEntryContext);

  let color = Colors.gray;
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="credit-card" size={25} color={color} />
        <Text style={{ alignSelf: "center", color, fontSize: scale(13) }}>
          Card
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="mobile" size={25} color={color} />
        <Text style={{ alignSelf: "center", color, fontSize: scale(13) }}>
          Mobile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="wechat" size={25} color={color} />
        <Text style={{ alignSelf: "center", color, fontSize: scale(13) }}>
          Fap
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(CREDIT_SALES)}
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
        }}
      >
        <MaterialCommunityIcons
          name="hand-extended-outline"
          size={24}
          color={Colors.dark}
        />
        <Text
          style={{
            alignSelf: "center",
            color: Colors.dark,
            fontSize: scale(13),
          }}
        >
          Debt
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={clearEverything}
        activeOpacity={0.5}
        style={{
          padding: 10,
          backgroundColor: Colors.primary,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
        }}
      >
        <MaterialCommunityIcons name="broom" size={25} color="black" />
        <Text style={{ alignSelf: "center", fontSize: scale(13) }}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};
