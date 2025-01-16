import { Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import { useSelector } from "react-redux";
import { getFilterParams, getSelectedShop } from "duqactStore/selectors";
import { STOCK_INFO_ENDPOINT } from "@utils/EndPointUtils";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import SBPCard from "./SBPCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertDateFormat, formatDate, getCurrentDay } from "@utils/Utils";
import { hasInternetConnection } from "@utils/NetWork";
import { ALL_SHOPS_LABEL } from "@constants/Constants";

const SalesByProduct = () => {
  const filterParams = useSelector(getFilterParams);
  const selectedShop = useSelector(getSelectedShop);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState(null);

  const getRecords = async () => {
    const hasNet = await hasInternetConnection();
    setMessage(null);
    if (hasNet === true) {
      setLoading(true);

      if (selectedShop?.name === ALL_SHOPS_LABEL) {
        setData([]);
        setMessage("Please select a shop.");
        setLoading(false);
        return;
      }
      const searchParameters = {
        ...filterParams,
        startDate: convertDateFormat(date),
        endDate: convertDateFormat(date, true),
      };
      // console.log(searchParameters);
      await new BaseApiService(STOCK_INFO_ENDPOINT)
        .getRequestWithJsonResponse(searchParameters)
        .then((data) => {
          // console.log(data);
          if (data?.length === 0) {
            setMessage("No records found.");
          }

          setData(data);
          setLoading(false);
        })
        .catch((e) => {
          setMessage(e?.message);
          setLoading(false);
        });
    } else {
      setData([]);
      setMessage("Cannot connect to the internet.");
    }
  };

  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    setVisible(false);
    // getRecords(selectedDate);
  };

  useEffect(() => {
    getRecords();
  }, [date, selectedShop]);

  const menuItems = [
    {
      name: "Select Date",
      onClick: () => setVisible(true),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      {visible && <DateTimePicker testID="dateTimePicker" value={date} mode={"date"} onChange={onChange} maximumDate={new Date()} />}

      <TopHeader title={`Sales by product  ${formatDate(date, true)}`} showMenuDots showShops menuItems={menuItems} />

      <FlatList
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item.name.toString()}
        data={data}
        renderItem={({ item }) => <SBPCard product={item} />}
        onRefresh={() => getRecords()}
        refreshing={loading}
        ListEmptyComponent={() => <Text style={{ textAlign: "center" }}>{message}</Text>}
      />
    </SafeAreaView>
  );
};

export default SalesByProduct;
