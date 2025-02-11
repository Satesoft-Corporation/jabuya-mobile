import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BaseApiService } from "../../utils/BaseApiService";
import AppStatusBar from "../../components/AppStatusBar";
import Colors from "../../constants/Colors";
import Loader from "../../components/Loader";
import UserProfile from "../../components/UserProfile";
import Stripe from "./components/Stripe1";
import { formatNumberWithCommas } from "../../utils/Utils";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import { useSelector } from "react-redux";
import { getSelectedShop, getShopOwnerId } from "duqactStore/selectors";

const ShopSummary = ({ navigation, route }) => {
  const [initialCapital, setInitialCapital] = useState("");
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState(null);
  const [totalSalesValue, setTotalSalesValue] = useState(null); //cash at hand
  const [financialRecords, setFinancialRecords] = useState(null);

  const selectedShop = useSelector(getSelectedShop);
  const shopOwnerId = useSelector(getShopOwnerId);

  const fetchShopProducts = async () => {
    let products = await UserSessionUtils.getShopProducts();

    let totalStockValue = [];
    let totalSaleValue = [];

    products.forEach((item) => {
      const { salesPrice } = item;
      const summary = item?.performanceSummary;

      const qtyStocked = summary?.totalQuantityStocked || 0;
      const qtySold = summary?.totalQuantitySold || 0;

      const remainingStock = qtyStocked - qtySold;

      const iteSalesValue = qtySold * salesPrice;
      const itemStockValue = salesPrice * remainingStock; //itemstock value

      totalSaleValue.push(iteSalesValue);
      totalStockValue.push(itemStockValue);
    });

    let stockValue = totalStockValue.reduce((a, b) => a + b, 0);
    let cash = totalSaleValue.reduce((a, b) => a + b, 0);
    setStock(stockValue);
    setTotalSalesValue(cash);

    setLoading(false);
  };

  const fetchShopDetails = () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      shopOwnerId: shopOwnerId, //1427, // 2453,
    };

    new BaseApiService("/shops")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        let totalCapital = 0;
        let stockValue = 0;
        let cashAtHand = 0;
        let expenses = 0;
        let grossProfit = 0;
        let initialCap = 0;

        response.records.forEach(async (item) => {
          totalCapital += item?.initialCapital;

          stockValue += item?.performanceSummary?.totalStockValue || 0;

          cashAtHand += item?.performanceSummary?.totalSalesValue || 0;

          expenses += item?.performanceSummary?.totalExpenses || 0;

          grossProfit += item?.performanceSummary?.totalStockValue || 0;
          initialCap += item?.initialCapital;
        });

        setFinancialRecords({
          totalCapital,
          stockValue,
          cashAtHand,
          expenses,
          grossProfit,
        });
        setInitialCapital(initialCap);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShopProducts();
    fetchShopDetails();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: Colors.light_2, flex: 1 }}>
      <AppStatusBar bgColor="black" content="light-content" />
      <Loader loading={loading} />

      <View style={{ backgroundColor: Colors.dark }}>
        <UserProfile navigation={navigation} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 20,
            paddingHorizontal: 13,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                color: Colors.primary,
                opacity: 0.6,
                marginBottom: 3,
              }}
            >
              Investment
            </Text>
            <Text style={{ fontSize: 15, color: Colors.primary, fontWeight: 600 }}>
              <Text
                style={{
                  fontSize: 10,
                }}
              >
                {selectedShop?.currency}
              </Text>{" "}
              {formatNumberWithCommas(initialCapital)}
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
            <Text
              style={{
                fontSize: 12,
                color: Colors.primary,
                opacity: 0.6,
                marginBottom: 3,
                alignSelf: "flex-end",
              }}
            >
              Shops
            </Text>
            <Text style={{ color: Colors.primary, alignSelf: "flex-end" }}>01</Text>
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
      </View>
      <View style={{ paddingHorizontal: 10, marginTop: 8 }}>
        <Stripe value={stock} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderRadius: 3,
            justifyContent: "space-between",
            gap: 10,
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
              source={require("../../assets/icons/bank1.png")}
              style={{
                width: 40,
                height: 40,
                marginEnd: 10,
              }}
              tintColor={Colors.dark}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  alignSelf: "flex-end",
                }}
              >
                {formatNumberWithCommas(0)}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Banked
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
              flex: 1,
            }}
          >
            <Image
              source={require("../../assets/icons/open-hand.png")}
              style={{
                width: 40,
                height: 40,
                marginEnd: 10,
              }}
              tintColor={Colors.dark}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  alignSelf: "flex-end",
                  fontSize: 16,
                }}
              >
                {formatNumberWithCommas(totalSalesValue)}
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
            gap: 10,
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
              source={require("../../assets/icons/icons8-cash-50.png")}
              style={{
                width: 40,
                height: 40,
                marginEnd: 10,
              }}
              tintColor={Colors.dark}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  alignSelf: "flex-end",
                  fontSize: 16,
                }}
              >
                0
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Debt
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
              flex: 1,
            }}
          >
            <Image
              source={require("../../assets/icons/icons8-money-50.png")}
              style={{
                width: 40,
                height: 40,
                marginEnd: 10,
              }}
              tintColor={Colors.dark}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  alignSelf: "flex-end",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Credit
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
              source={require("../../assets/icons/icons8-money-bag-64.png")}
              style={{
                width: 40,
                height: 40,
                marginEnd: 10,
              }}
              tintColor={Colors.dark}
            />
            <View>
              <Text style={{ fontWeight: 400, fontSize: 16 }}>Gross income</Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>Before expenses</Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>{formatNumberWithCommas(financialRecords?.grossProfit)}</Text>
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
              source={require("../../assets/icons/spending.png")}
              style={{
                width: 40,
                height: 40,
                marginEnd: 10,
              }}
              tintColor={Colors.dark}
            />
            <View>
              <Text style={{ fontWeight: 400, fontSize: 16 }}>Expenses</Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>Monthly total</Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>{formatNumberWithCommas(financialRecords?.expenses)}</Text>
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
              source={require("../../assets/icons/icons8-money-bag-48.png")}
              style={{
                width: 40,
                height: 40,
                marginEnd: 10,
              }}
              tintColor={Colors.primary}
            />
            <View>
              <Text style={{ fontWeight: 400, color: Colors.primary, fontSize: 16 }}>Net profit</Text>
              <Text style={{ fontWeight: 300, fontSize: 10, color: Colors.primary }}>After expenses</Text>
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
              {formatNumberWithCommas(0)}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShopSummary;
