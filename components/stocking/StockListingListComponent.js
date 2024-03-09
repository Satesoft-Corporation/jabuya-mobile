import React, { useState, memo } from "react";
import Colors from "../../constants/Colors";
import { formatDate } from "../../utils/Utils";
import { View, Text, TouchableOpacity } from "react-native";

function StockListingListComponent({ data }) {
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
          <View style={{ alignItems: "center", flex: 1 }}>
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

          <View style={{ alignItems: "flex-end", flex: 1, marginEnd: 5 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Status
            </Text>
            <Text
              style={{
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
              gap: 3,
              marginEnd:5
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
                Last restocked:{" "}
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
                marginBottom: 10,
              }}
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

            {data?.remarks && (
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
            )}
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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
            {/* <Text
              style={{
                fontWeight: 300,
                fontSize: 12,
              }}
            >
              {data?.shopName}
            </Text> */}
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

export default StockListingListComponent;
