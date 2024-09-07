import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import Colors from "@constants/Colors";
import { useSelector } from "react-redux";
import { getSelectedShop } from "reducers/selectors";

const ContactBook = () => {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState(null);

  const selectedShop = useSelector(getSelectedShop);

  const fetchClients = async () => {
    const { name, id } = selectedShop;
    await UserSessionUtils.getShopClients(name?.includes("All") ? null : id)
      .then((response) => {
        setClients(response);

        if (response?.length === 0) {
          setMessage("No shop clients found");
        }
      })
      .catch((error) => {
        setMessage("Error fetching shop clients");
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />

      <TopHeader title="Contact List" />
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <FlatList
          data={clients}
          renderItem={({ item }) => <Card client={item} />}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {clients === 0 && <Text>{message}</Text>}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

function Card({ client }) {
  const makePhoneCall = () => {
    Linking.openURL(`tel:${client?.phoneNumber}`);
  };

  const openWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${client?.phoneNumber}`);
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
        flexDirection: "row",
        justifyContent: "space-between",
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

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity onPress={makePhoneCall}>
          <Image
            source={require("../assets/icons/icons8-phone-50.png")}
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openWhatsApp}>
          <Image
            source={require("../assets/icons/icons8-message-48.png")}
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default ContactBook;
