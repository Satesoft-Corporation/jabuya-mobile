import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Snackbar from "@components/Snackbar";
import { getSelectedShop } from "duqactStore/selectors";
import { useSelector } from "react-redux";

import { convertDateFormat, convertToServerDate, formatDate } from "@utils/Utils";
import UserCard from "./UserCard";
import { REPORTS_ENDPOINT } from "api";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Modal from "react-native-modal";
import { ALL_SHOPS_LABEL } from "@constants/Constants";

const UserPerfomance = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  const snackbarRef = useRef(null);

  const selectedShop = useSelector(getSelectedShop);

  const formatData = (input) => {
    const grouped = input?.reduce((acc, item) => {
      if (!acc[item.reportDate]) {
        acc[item.reportDate] = { reportDate: item.reportDate, data: [] };
      }
      acc[item.reportDate].data.push(item);
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const getData = async () => {
    hideModal();
    const searchParameters = {
      shopId: selectedShop?.id,
      startDate: convertToServerDate(startDate),
      endDate: convertToServerDate(convertDateFormat(endDate, true)),
    };
    if (selectedShop?.name !== ALL_SHOPS_LABEL) {
      setLoading(true);
      await new BaseApiService(REPORTS_ENDPOINT.GET_SHOP_USER_SUMMARIES)
        .getRequestWithJsonResponse(searchParameters)
        .then((r) => {
          const mapped = formatData(r);
          if (r?.length === 0) {
            setMessage("No records found");
            setLoading(false);
            return;
          }
          setUserData(mapped);

          setLoading(false);
        })
        .catch((e) => {
          console.log(e?.message);
          setMessage(`Error ${e?.message}`);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getData();
  }, [selectedShop]);

  const hideModal = () => {
    setShowFilters(false);
    setMessage(null);
  };

  const applyFilters = () => {
    setFiltering(true);
    getData();
  };

  const clearDates = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setFiltering(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <TopHeader title={`Daily user summary `} filter onFilterPress={() => setShowFilters(true)} />

      <Modal
        isVisible={showFilters}
        onBackdropPress={hideModal}
        onBackButtonPress={hideModal}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        animationOutTiming={0.1}
      >
        <View style={{ backgroundColor: Colors.light, borderRadius: 5, padding: 10, paddingVertical: 15, gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <MyInput maximumDate style={{ flex: 0.5 }} label="From date" isDateInput dateValue={startDate} onDateChange={(e) => setStartDate(e)} />
            <MyInput
              style={{ flex: 0.5 }}
              maximumDate
              editable={formatDate(startDate) !== formatDate(new Date())}
              label="To date"
              isDateInput
              dateValue={endDate}
              onDateChange={(e) => setEndDate(e)}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 20 }}>
            <PrimaryButton title={"Clear"} onPress={clearDates} style={{ flex: 0.5 }} />
            <PrimaryButton title={"Apply"} onPress={applyFilters} style={{ flex: 0.5 }} darkMode />
          </View>
        </View>
      </Modal>

      <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <Text style={{ fontSize: 16 }}>
          {formatDate(startDate, true)} {formatDate(startDate) === formatDate(endDate) && !filtering ? "" : `to ${formatDate(endDate, true)}`}
        </Text>
      </View>

      <FlatList
        data={userData}
        renderItem={({ item, i }) => <UserCard item={item} users={userData} />}
        onRefresh={() => {
          clearDates();
          getData();
        }}
        refreshing={loading}
        ListHeaderComponent={<>{message && <Text style={{ textAlign: "center" }}>{message}</Text>}</>}
      />

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default UserPerfomance;
