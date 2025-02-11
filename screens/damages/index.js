import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { MAXIMUM_RECORDS_PER_FETCH } from "@constants/Constants";
import { BaseApiService } from "@utils/BaseApiService";
import AppStatusBar from "@components/AppStatusBar";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Snackbar from "@components/Snackbar";
import { DAMAGES_ENDPOINT } from "@utils/EndPointUtils";
import { getFilterParams, getIsShopAttendant, getSelectedShop } from "duqactStore/selectors";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import DamagesCard from "./DamagesCard";

const Damages = () => {
  const [damages, setDamages] = useState([]);
  const [damageRecords, setDamageRecords] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const snackbarRef = useRef(null);

  const filterParams = useSelector(getFilterParams);
  const selectedShop = useSelector(getSelectedShop);
  const isShopAttendant = useSelector(getIsShopAttendant);

  const navigation = useNavigation();

  const fetchDamages = async (offsetToUse = 0) => {
    try {
      setMessage(null);
      setLoading(true);

      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        ...filterParams,
        offset: offsetToUse,
        ...(searchTerm && searchTerm.trim() !== "" && { searchTerm: searchTerm }),
      };

      setIsFetchingMore(true);

      const response = await new BaseApiService(DAMAGES_ENDPOINT).getRequestWithJsonResponse(searchParameters);

      console.log(response?.records[0]);

      if (offsetToUse === 0) {
        setDamages(response.records);
      } else {
        setDamages((prev) => [...prev, ...response?.records]);
      }
      setDamageRecords(response?.totalItems);
      setDisable(false);

      if (response?.totalItems === 0) {
        setMessage("No stock entries found");
      }

      if (response.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
      setIsFetchingMore(false);
      setLoading(false);
    } catch (error) {
      setDisable(false);
      console.log(error);
      setMessage("Error fetching stock records");
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && damages.length < damageRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
      fetchDamages(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
    if (damages.length === damageRecords && damages.length > 10) {
      snackbarRef.current.show("No more additional data", 2500);
    }
  };

  const onSearch = () => {
    setDisable(true);
    setDamages([]);
    setOffset(0);
    fetchDamages();
  };

  useEffect(() => {
    fetchDamages();
  }, [selectedShop]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <TopHeader title="Damages" showSearch={true} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} showShops />

      <FlatList
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item.id.toString()}
        data={damages}
        onRefresh={() => onSearch()}
        renderItem={({ item }) => <DamagesCard damage={item} />}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>{damageRecords === 0 && <Text>{message}</Text>}</View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
      />

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default Damages;
