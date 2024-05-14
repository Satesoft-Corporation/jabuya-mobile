import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useRef, useState } from "react";
import Colors from "../../constants/Colors";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import ClientDebtsCard from "./components/ClientDebtsCard";
import Snackbar from "../../components/Snackbar";

const ClientDebts = ({ route }) => {
  const { sales, client } = route?.params ?? {};

  const [loading, setLoading] = useState(true);

  const snackbarRef = useRef(null);

  const removeLoader = () => setLoading(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader title={`Debts for ${client?.fullName}`} />

      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={sales}
          renderItem={({ item, index }) => {
            if (index === sales?.length - 1) {
              removeLoader();
            }
            return <ClientDebtsCard debt={item} snackbarRef={snackbarRef} />;
          }}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={() => {}}
        />
        <Snackbar ref={snackbarRef} />
      </View>
    </SafeAreaView>
  );
};

export default ClientDebts;
