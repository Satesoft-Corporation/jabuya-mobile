import { View, Text } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { getSelectedShop, getShopProducts, getShops } from "reducers/selectors";
import Colors from "@constants/Colors";
import { MyDropDown } from "@components/DropdownComponents";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { convertDateFormat, formatDate } from "@utils/Utils";
import { screenHeight } from "@constants/Constants";

const SalesFilter = ({ showFilters, setShowFilters, getSales, setDate }) => {
  const shops = useSelector(getShops) ?? [];
  const products = useSelector(getShopProducts) ?? [];
  const selectedShop = useSelector(getSelectedShop);

  const [filterShop, setFiletrShop] = useState(selectedShop);
  const [filterProduct, setFiletrProduct] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date());

  const hideModal = () => {
    setShowFilters(false);
  };
  const applyFilter = () => {
    const datesMatch = formatDate(filterDate, true) === formatDate(new Date(), true);

    const searchParameters = {
      ...(!datesMatch && {
        startDate: convertDateFormat(filterDate),
        endDate: convertDateFormat(filterDate, true),
      }),
      ...(filterProduct && filterShop && { shopProductId: filterProduct?.id }),
      ...(filterShop && { shopId: filterShop?.id }),
    };

    if (!datesMatch) {
      setDate(filterDate);
    }
    getSales(searchParameters);
    hideModal();
  };

  const clearFilters = () => {
    setFiletrProduct(null);
    setFilterDate(new Date());
  };
  return (
    <Modal
      isVisible={showFilters}
      style={{ width: "95%", alignSelf: "center", justifyContent: "center" }}
      onBackdropPress={hideModal}
      onBackButtonPress={hideModal}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationOutTiming={0.1}
    >
      <View style={{ backgroundColor: Colors.light, borderRadius: 5, justifyContent: "space-between", padding: 10, paddingVertical: 15 }}>
        <View style={{ paddingBottom: 15 }}>
          <Text style={{ fontSize: 18, textAlign: "center" }}>Filter Sales</Text>

          <View style={{ gap: 10 }}>
            {shops?.length > 1 && (
              <MyDropDown data={shops} labelField={"name"} valueField={"id"} onChange={(e) => setFiletrShop(e)} value={filterShop} label={"Shop"} />
            )}
            <MyDropDown
              data={products}
              labelField={"productName"}
              valueField={"id"}
              onChange={(e) => setFiletrProduct(e)}
              value={filterProduct}
              label={"Product"}
            />

            <MyInput
              placeholder={"Select a date"}
              isDateInput
              label="Date"
              dateValue={filterDate}
              maximumDate
              onDateChange={(date) => setFilterDate(date)}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PrimaryButton title={"Clear"} onPress={clearFilters} style={{ flex: 0.5 }} darkMode={false} />
          <PrimaryButton title={"Apply "} onPress={applyFilter} style={{ flex: 0.5 }} />
        </View>
      </View>
    </Modal>
  );
};

export default SalesFilter;
