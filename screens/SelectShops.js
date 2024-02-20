import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import AppStatusBar from "../components/AppStatusBar";
import TopHeader from "../components/TopHeader";
import Colors from "../constants/Colors";
import { Image } from "react-native";
import { UserContext } from "../context/UserContext";

const SelectShopBars = ({ navigation }) => {
  const { shops, setSelectedShop, selectedShop } = useContext(UserContext);

  useEffect(() => {
    if (selectedShop === null) {
      setSelectedShop(shops[0]);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar />

      <TopHeader
        title="Select shop"
        onBackPress={() => navigation.goBack()}
        showShopName={false}
      />

      <View
        style={{
          paddingHorizontal: 5,
          marginTop: 10,
        }}
      >
        {shops.map((shop) => (
          <ShopItem
            key={shop?.name}
            shop={shop}
            selected={selectedShop?.name === shop?.name}
            onItemPress={() => {
              setSelectedShop(shop);
            }}
          />
        ))}
      </View>
    </View>
  );
};

function ShopItem({ shop, onItemPress, selected }) {
  return (
    <TouchableOpacity
      onPress={onItemPress}
      style={{
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        backgroundColor: Colors.dark,
        marginBottom: 10,
        borderRadius: 5,
      }}
    >
      <Image
        source={require("../assets/icons/icons8-store-50.png")}
        style={{
          height: 25,
          width: 25,
          resizeMode: "contain",
          tintColor: Colors.primary,
        }}
      />
      <Text style={{ color: Colors.primary, flex: 1, marginLeft: 20 }}>
        {shop?.name}
      </Text>

      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: Colors.light,
          alignItems: "center",
          justifyContent: "center",
          borderColor: Colors.gray,
          borderWidth: 2,
        }}
      >
        {selected && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: Colors.dark,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
export default SelectShopBars;
