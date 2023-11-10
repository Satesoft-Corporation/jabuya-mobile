import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import BlackAndWhiteScreen from "../components/BlackAndWhiteScreen";
import AppStatusBar from "../components/AppStatusBar";
import Colors from "../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";

const ShopSummary = () => {
  return (
    <BlackAndWhiteScreen flex={1} bgColor={Colors.light_2}>
      <AppStatusBar bgColor="black" content="light-content" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 20,
          paddingHorizontal: 13,
        }}
      >
        <View>
          <Text style={{ color: Colors.primary }}>UGX 16,000,000</Text>
          <Text
            style={{ color: Colors.primary, fontSize: 13, fontWeight: 300 }}
          >
            Investment
          </Text>
        </View>
        <View
          style={{
            width: 1,
            height: "inherit",
            backgroundColor: Colors.primary,
          }}
        />
        <View>
          <Text style={{ color: Colors.primary, alignSelf: "flex-end" }}>
            01
          </Text>
          <Text
            style={{
              color: Colors.primary,
              alignSelf: "flex-end",
              fontWeight: 300,
            }}
          >
            Shops
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 3,
            height: 25,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: Colors.dark,
              paddingHorizontal: 6,
              alignSelf: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            ADD CAPITAL
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 10, marginTop: 25 }}>
        <View
          style={{
            backgroundColor: Colors.primary,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/icons8-box-501.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />
            <View>
              <Text style={{ fontWeight: 400, fontWeight: 16 }}>Stock</Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>Total Value</Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
              12,5000,000
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderRadius: 3,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.light,
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              borderRadius: 3,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Image
              source={require("../assets/icons/icons8-cash-50.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  alignSelf: "flex-end",
                  fontSize: 16,
                }}
              >
                4,500,200
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Cash at hand
              </Text>
            </View>
          </View>

          
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderRadius: 3,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.light,
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              borderRadius: 3,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Image
              source={require("../assets/icons/icons8-money-50.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  alignSelf: "flex-end",
                  fontSize: 16,
                }}
              >
                4,500,200
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Sold capital value
              </Text>
            </View>
          </View>

          <View style={{ width: 10 }}></View>
          <View
            style={{
              backgroundColor: Colors.light,
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              borderRadius: 3,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Image
              source={require("../assets/icons/icons8-box-502.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  alignSelf: "flex-end",
                }}
              >
                3,500,200
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Restocking
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors.light,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/icons8-money-bag-64.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />
            <View>
              <Text style={{ fontWeight: 400, fontSize: 16 }}>
                Gross profit
              </Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>
                Before expenses
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
              1,5000,000
            </Text>
          </View>
        </View>

       

        <View
          style={{
            backgroundColor: Colors.light,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/icons8-current-expenses-64.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />
            <View>
              <Text style={{ fontWeight: 400, fontSize: 16 }}>Expenses</Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>
                Monthly total
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
              120,000
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.dark,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/icons8-money-bag-48.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.primary,
                marginEnd: 10,
              }}
            />
            <View>
              <Text
                style={{ fontWeight: 400, color: Colors.primary, fontSize: 16 }}
              >
                Net profit
              </Text>
              <Text
                style={{ fontWeight: 300, fontSize: 10, color: Colors.primary }}
              >
                After expenses
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontWeight: 500,
                fontSize: 20,
                marginEnd: 10,
                color: Colors.primary,
              }}
            >
              880,200
            </Text>
          </View>
        </View>
      </View>
    </BlackAndWhiteScreen>
  );
};

export default ShopSummary;
