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
const screenWidth = Dimensions.get("window").width;

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
      let profit = lineItems.reduce((a, item) => a + item.totalProfit, 0);
      let cap = lineItems.reduce((a, item) => a + item.totalPurchaseCost, 0);

      setItemCount(cartQty);
      // setCount(cartQty);
      // setSaleProfit(profit); //profit made per cart
      // setSaleCapital(cap);
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
              <Text style={{ fontWeight: 600 }}>Amount</Text>
              <Text>{formatNumberWithCommas(totalCost)}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Recieved</Text>
              <Text>{formatNumberWithCommas(amountPaid)}</Text>
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

export function StockPurchaseTransactionItem({ data }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={{
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
        </View>
      </View>
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ alignItems: "left" }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Product
            </Text>
            <Text>{data?.productName}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Qty
            </Text>
            <Text>{data?.packedQuantity * data?.purchasedQuantity}</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                marginEnd: 2,
              }}
            >
              {formatNumberWithCommas(data?.purchasePrice)}
            </Text>
          </View>
        </View>

        {expanded && (
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Barcode:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.barcode}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Restock date:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {formatDate(data?.dateChanged, true)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Expiry date:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {formatDate(data?.expiryDate, true)}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                Supplier:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.supplierName}
              </Text>
            </View>
          </View>
        )}
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
              Restock by:{" "}
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.createdByFullName}
              </Text>
            </Text>
            <Text
              style={{
                fontWeight: 300,
                fontSize: 12,
              }}
            >
              {data?.shopName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleExpand}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.dark,
              borderRadius: 3,
              paddingHorizontal: 12,
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
              {expanded ? "Hide" : "More"}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}

export function StockLevelTransactionItem({ data }) {
  const [expanded, setExpanded] = useState(false);
  const { performanceSummary } = data;
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  let remainingStock =
    data?.performanceSummary?.totalQuantityStocked -
    data?.performanceSummary?.totalQuantitySold;
  if (
    remainingStock === undefined ||
    isNaN(remainingStock) ||
    remainingStock < 1
  ) {
    remainingStock = 0;
  }
  return (
    <View
      style={{
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
        </View>
      </View>
      <>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <View style={{ alignItems: "left", flex: 2 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Product
            </Text>
            <Text>{data?.productName}</Text>
          </View>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Sold
            </Text>
            <Text
              style={{
                alignSelf: "center",
                marginEnd: 2,
              }}
            >
              {performanceSummary?.totalQuantitySoldThisMonth || 0}
            </Text>
          </View>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              In stock
            </Text>
            <Text style={{ fontWeight: 600 }}>{remainingStock}</Text>
          </View>
        </View>

        {expanded && (
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Restock date:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {formatDate(data?.dateChanged, true)}
              </Text>
            </View>

            {/* <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                  marginVertical: 2,
                }}
              >
                Expiry date:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {formatDate(data?.expiryDate, true)}
              </Text>
            </View> */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                Manufacturer:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.manufacturerName}
              </Text>
            </View>
          </View>
        )}
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
              Restock by:{" "}
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.createdByFullName}
              </Text>
            </Text>
            <Text
              style={{
                fontWeight: 300,
                fontSize: 12,
              }}
            >
              {data?.shopName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleExpand}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.dark,
              borderRadius: 3,
              paddingHorizontal: 12,
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
              {expanded ? "Hide" : "More"}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}

export function StockListingTransactionItem({ data }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={{
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
        </View>
      </View>
      <>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <View style={{ alignItems: "left", flex: 2 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Product
            </Text>
            <Text>{data?.productName}</Text>
          </View>
          <View style={{ alignItems: "center", flex: 2 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Category
            </Text>
            <Text style={{ alignSelf: "center" }}>
              {data?.categoryName || "None"}
            </Text>
          </View>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
                alignSelf: "center",
              }}
            >
              Status
            </Text>
            <Text
              style={{
                alignSelf: "center",
                marginEnd: 2,
              }}
            >
              {data?.recordStatus
                .toLowerCase()
                .replace(/(^|\s)\S/g, (L) => L.toUpperCase())}
            </Text>
          </View>
        </View>

        {expanded && (
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Barcode:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.barcode}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Restock date:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {formatDate(data?.dateChanged, true)}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Manufacturer:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.manufacturerName}
              </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Remarks:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.remarks}
              </Text>
            </View>
          </View>
        )}
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
              Listed by:{" "}
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.createdByFullName}
              </Text>
            </Text>
            <Text
              style={{
                fontWeight: 300,
                fontSize: 12,
              }}
            >
              {data?.shopName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleExpand}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.dark,
              borderRadius: 3,
              paddingHorizontal: 12,
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
              {expanded ? "Hide" : "More"}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}
