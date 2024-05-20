import { View, Text, FlatList, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import OfflineSaleTxnCard, {
  TxnCashSummary,
} from "./components/OfflineSaleTxnCard";
import ModalContent from "../../components/ModalContent";
import SalesTable from "../sales_desk/components/SalesTable";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Colors from "../../constants/Colors";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";

const OfflineSales = () => {
  const [sales, setSales] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOfflineSales = async () => {
    setVisible(false);
    setLoading(true);
    const salesList = await UserSessionUtils.getPendingSales();

    setSales(salesList);
    setLoading(false);
  };

  const handleRemove = (item, index) => {
    setSelectedSale(item);
    setVisible(true);
  };
  useEffect(() => {
    getOfflineSales();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <TopHeader title="Offline Sales" showShopName={false} />

      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={sales}
        renderItem={({ item, index }) => (
          <OfflineSaleTxnCard
            key={index}
            data={item}
            onRemove={() => handleRemove(item, index)}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={{ flex: 1, textAlign: "center", alignSelf: "center" }}>
            {"No sales found"}
          </Text>
        )}
        onRefresh={() => getOfflineSales()}
        refreshing={loading}
      />

      <RemoveSaleModal
        visible={visible}
        data={selectedSale}
        onComplete={getOfflineSales}
        hide={() => setVisible(false)}
      />
    </SafeAreaView>
  );
};

const RemoveSaleModal = ({
  visible = false,
  data,
  index,
  onComplete,
  ...props
}) => {
  const removeSale = async () => {
    await UserSessionUtils.removePendingSale(index);
    onComplete();
  };
  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            marginTop: 10,
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 12,
            marginStart: 1,
          }}
        >
          Confirm, remove sale record
        </Text>
      </View>

      <SalesTable sales={data?.lineItems} fixHeight={false} />

      <TxnCashSummary data={data} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          gap: 10,
          marginBottom: 5,
        }}
      >
        <PrimaryButton
          darkMode={false}
          title={"Cancel"}
          onPress={props?.hide}
        />
        <PrimaryButton title={"Remove"} onPress={removeSale} />
      </View>
    </ModalContent>
  );
};

export default OfflineSales;
