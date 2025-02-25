import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Snackbar from "@components/Snackbar";
import { SHOP_SALES_ENDPOINT } from "@utils/EndPointUtils";
import { getSelectedShop } from "duqactStore/selectors";
import { useSelector } from "react-redux";

import { formatDate, getCurrentDay } from "@utils/Utils";
import UserCard from "./UserCard";

const UserPerfomance = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState(null);

  const [loading, setLoading] = useState(true);

  const snackbarRef = useRef(null);

  const selectedShop = useSelector(getSelectedShop);

  const getData = async () => {
    const searchParameters = { offset: 0, limit: 100, startDate: getCurrentDay() };
    setLoading(true);
    if (selectedShop) {
      try {
        const response = await new BaseApiService(`/shops/${selectedShop?.id}/user-accounts`).getRequestWithJsonResponse({ offset: 0, limit: 0 });

        const mapped = await Promise.all(
          response.records?.map(async (user) => {
            let data = { ...user };
            try {
              const salesResponse = await new BaseApiService(SHOP_SALES_ENDPOINT).getRequestWithJsonResponse({
                ...searchParameters,
                userId: user?.id,
              });

              data.totalItems = salesResponse?.totalItems;
              data.totalCapital = salesResponse?.totalPurchaseCost;
              data.totalIncome = salesResponse?.totalProfit;
              data.totalSalesValue = salesResponse?.totalCost;
            } catch (error) {
              setLoading(false);
              setMessage("Cannot get sales!", error?.message);
            }

            return data;
          }) || []
        );

        setUserData(mapped);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [selectedShop]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <TopHeader title={`Daily user summary `} />

      {!loading && (
        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
          <Text style={{ fontSize: 16 }}>{formatDate(new Date(), true)}</Text>
        </View>
      )}
      <FlatList
        keyExtractor={(item) => item?.id?.toString()}
        data={userData}
        renderItem={({ item, i }) => <UserCard item={item} users={userData} />}
        onRefresh={() => getData()}
        refreshing={loading}
      />

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default UserPerfomance;
