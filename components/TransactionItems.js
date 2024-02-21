import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import Colors from "../constants/Colors";
import { formatDate, formatNumberWithCommas } from "../utils/Utils";
import { useEffect, useState } from "react";

export function SaleTransactionItem({ data, isShopOwner }) {
  // sales report item card

  const { lineItems, totalCost, amountPaid, balanceGivenOut, shopName } = data;

  const [expanded, setExpanded] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (lineItems !== undefined) {
      let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);
      setItemCount(cartQty);
    }
  }, [data]);
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: Colors.dark,
            marginBottom: 2,
          }}
        >
          SN: {data?.serialNumber}
        </Text>

        <View>
          <Text
            style={{
              fontSize: 12,
              color: Colors.gray,
              alignSelf: "flex-end",
            }}
          >
            {formatDate(data?.dateCreated)}
          </Text>
          {expanded && (
            <Text
              style={{
                alignSelf: "flex-end",
                fontSize: 12,
              }}
            >
              Currency : UGX
            </Text>
          )}
        </View>
      </View>
      {!expanded && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Items</Text>
              <Text>{itemCount}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Recieved</Text>
              <Text>{formatNumberWithCommas(amountPaid)}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Amount</Text>
              <Text>{formatNumberWithCommas(totalCost)}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Balance</Text>
              <Text>{formatNumberWithCommas(balanceGivenOut)}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                Served by:{" "}
                <Text
                  style={{
                    fontWeight: 300,
                    fontSize: 12,
                  }}
                >
                  {data?.createdByFullName}
                </Text>
              </Text>
              {isShopOwner && (
                <Text
                  style={{
                    fontWeight: 300,
                    fontSize: 12,
                  }}
                >
                  {shopName}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={toggleExpand}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.dark,
                borderRadius: 3,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 13,
                  fontWeight: 300,
                }}
              >
                More
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {expanded && (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 25,
              paddingEnd: 10,
              borderBottomColor: Colors.gray,
              borderBottomWidth: 0.3,
              marginTop: 10,
            }}
          >
            <Text style={{ flex: 2.5, fontWeight: 600 }}>Item</Text>
            <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>
              Qty
            </Text>
            <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
              Cost
            </Text>

            <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
              Amount
            </Text>
          </View>
          <FlatList
            data={lineItems}
            renderItem={({ item }) => <SaleItem data={item} />}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingEnd: 5,
              marginTop: 5,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: 600 }}>Total</Text>

            <Text style={{ textAlign: "center", fontWeight: 600 }}>
              {formatNumberWithCommas(totalCost)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Recieved </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(amountPaid)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 3,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Purchased{" "}
              <Text style={{ fontWeight: "400" }}>
                {itemCount >= 1 && (
                  <Text>
                    {itemCount}
                    {itemCount > 1 ? <Text> items</Text> : <Text> item</Text>}
                  </Text>
                )}
              </Text>
            </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(totalCost)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Balance</Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(balanceGivenOut)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                Served by:{" "}
                <Text
                  style={{
                    fontWeight: 300,
                    fontSize: 12,
                  }}
                >
                  {data?.createdByFullName}
                </Text>
              </Text>
              {isShopOwner && (
                <Text
                  style={{
                    fontWeight: 300,
                    fontSize: 12,
                  }}
                >
                  {shopName}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={toggleExpand}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.dark,
                borderRadius: 3,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 13,
                  fontWeight: 300,
                }}
              >
                Hide
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export const SaleListItem = ({ data }) => {
  // table item on sales entry
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.3,
        alignItems: "center",
        height: "fit-content",
        paddingVertical: 8,
      }}
    >
      <Text style={{ flex: 2.5, justifyContent: "center" }}>
        {data?.productName}
      </Text>
      <Text style={{ flex: 0.5, textAlign: "center" }}>{data?.quantity}</Text>
      <Text style={{ flex: 1, textAlign: "right" }}>
        {formatNumberWithCommas(data?.unitCost)}
      </Text>
      <Text style={{ flex: 1, textAlign: "right", paddingEnd: 10 }}>
        {formatNumberWithCommas(data?.totalCost)}
      </Text>
    </View>
  );
};

export const SaleItem = ({ data }) => {
  //part of SaleTransaction item component

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomColor: Colors.gray,
          borderBottomWidth: 0.3,
          alignItems: "center",
          height: "fit-content",
          paddingVertical: 8,
        }}
      >
        <Text style={{ flex: 2.5, justifyContent: "center" }}>
          {data?.productName || data?.shopProductName}
        </Text>

        <Text style={{ flex: 0.5, textAlign: "center" }}>{data?.quantity}</Text>

        <Text style={{ flex: 1, textAlign: "right" }}>
          {formatNumberWithCommas(data?.unitCost)}
        </Text>
        <Text style={{ flex: 1, textAlign: "right", paddingEnd: 10 }}>
          {formatNumberWithCommas(data?.totalCost)}
        </Text>
      </View>
    </>
  );
};
