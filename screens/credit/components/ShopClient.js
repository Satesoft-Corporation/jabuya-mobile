import { View, Text } from "react-native";
import React, { memo } from "react";
import { formatDate } from "../../../utils/Utils";
import Colors from "../../../constants/Colors";
import ChipButton2 from "../../../components/buttons/ChipButton2";
import CardHeader from "../../../components/cardComponents/CardHeader";

const ShopClient = ({ client }) => {
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
      <CardHeader
        value1={`SN: ${client?.serialNumber}`}
        value2={formatDate(client?.dateCreated)}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              backgroundColor: Colors.gray,
              height: 45,
              width: 45,
              borderWidth: 1,
              borderRadius: 50,
              borderColor: Colors.gray,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: 600 }}>
              {client?.fullName[0]}
            </Text>
          </View>
          <View>
            <Text style={{ fontWeight: 500 }}>{client?.fullName}</Text>
            <Text style={{ fontSize: 12 }}>Mob: {client?.phoneNumber}</Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12 }}>Status: {client?.recordStatus}</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View>
          <Text style={{ fontSize: 13, fontWeight: 600 }}>
            <Text style={{ fontWeight: 400 }}>Registered by:</Text>{" "}
            {client?.createdByFullName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <ChipButton2 darkMode={false} title={"Pay"} />
          <ChipButton2 title={"More"} />
        </View>
      </View>
    </View>
  );
};

export default memo(ShopClient);
