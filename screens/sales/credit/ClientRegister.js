import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import TopHeader from "../../../components/TopHeader";
import Colors from "../../../constants/Colors";
import { UserContext } from "../../../context/UserContext";
import AppStatusBar from "../../../components/AppStatusBar";
import { BaseApiService } from "../../../utils/BaseApiService";
import { ActivityIndicator } from "react-native";
import ShopClient from "../../../components/credit/ShopClient";

const ClientRegister = () => {
  const { selectedShop } = useContext(UserContext);

  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchClients = () => {
    setShowFooter(true);
    setMessage(null);

    const serachParams = {
      shopId: selectedShop?.id,
      limit: 0,
      offset: 0,
    };

    new BaseApiService("/clients-controller")
      .getRequestWithJsonResponse(serachParams)
      .then((response) => {
        setClients(response.records);
        setTotalItems(response.totalItems);

        if (response?.totalItems === 0) {
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
