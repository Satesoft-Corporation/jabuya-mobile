import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import TopHeader from "../../components/TopHeader";
import Colors from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import AppStatusBar from "../../components/AppStatusBar";
import { ActivityIndicator } from "react-native";
import ShopClient from "./components/ShopClient";
import { UserSessionUtils } from "@utils/UserSessionUtils";

const ClientRegister = () => {
  const { selectedShop } = useContext(UserContext);

  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState(null);
  const [showFooter, setShowFooter] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchClients = async () => {
    setShowFooter(true);
    setMessage(null);
    const { name, id } = selectedShop;

    await UserSessionUtils.getShopClients(name?.includes("All") ? null : id)
      .then((response) => {
        setClients(response);
        setTotalItems(response.length);

        if (response?.length === 0) {
          setMessage("No shop clients found");
          setShowFooter(false);
        }
      })
      .catch((error) => {
        setShowFooter(false);
        setMessage("Error fetching shop clients");
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
      <TopHeader title="Client Register" />
      <View>
        <FlatList
          style={{ marginTop: 5 }}
          keyExtractor={(item) => item.id.toString()}
          data={clients}
          renderItem={({ item }) => <ShopClient client={item} />}
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
          //   onEndReached={handleEndReached}
          onEndReachedThreshold={0}
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientRegister;
