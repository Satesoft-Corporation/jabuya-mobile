import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import TopHeader from "../components/TopHeader";
import AppStatusBar from "../components/AppStatusBar";
import Colors from "../constants/Colors";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import { BaseApiService } from "../utils/BaseApiService";
import { UserContext } from "../context/UserContext";

const ContactBook = () => {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState(null);
  const [showFooter, setShowFooter] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const { selectedShop } = useContext(UserContext);

  const fetchClients = () => {
    const serachParams = {
      shopId: selectedShop?.id,
      limit: 0,
      offset: 0,
    };
    new BaseApiService("/clients-controller")
      .getRequestWithJsonResponse(serachParams)
      .then(async (response) => {
        setClients(response.records);
        setTotalItems(response.totalItems);
        if (response?.totalItems === 0) {
          setMessage("No shop clients found");
          setShowFooter(false);
        }
      })
      .catch(async (error) => {
        let clients = await UserSessionUtils.getShopClients();
        setClients(clients);
        setTotalItems(clients.length);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const renderFooter = () => {
    if (showFooter === true) {
      if (clients.length === totalItems && clients.length > 0) {
        return null;
      }

      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating size="large" color={Colors.dark} />
        </View>
      );
    }
  };
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
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0}
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
