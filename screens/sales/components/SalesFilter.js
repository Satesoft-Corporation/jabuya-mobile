import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { getSelectedShop, getShops } from "duqactStore/selectors";
import Colors from "@constants/Colors";
import { MyDropDown } from "@components/DropdownComponents";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { convertDateFormat, formatDate } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import { UserSessionUtils } from "@utils/UserSessionUtils";

const SalesFilter = ({ showFilters, setShowFilters, getSales }) => {
  const shops = useSelector(getShops) ?? [];
  const selectedShop = useSelector(getSelectedShop);

  const [filterShop, setFiletrShop] = useState(selectedShop);
  const [filterProduct, setFiletrProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shopUsers, setShopUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const getClients = async () => {
    const shopClients = await UserSessionUtils.getShopClients();
    setClients(shopClients);
  };

  const hideModal = () => {
    setShowFilters(false);
  };

  const applyFilter = () => {
    const startDateMatch = formatDate(startDate, true) === formatDate(new Date(), true);

    const searchParameters = {
      ...(!startDateMatch && { startDate: convertDateFormat(startDate), endDate: convertDateFormat(endDate) }),
      ...(filterProduct && filterShop && { shopProductId: filterProduct?.id }),
      ...(filterShop && { shopId: filterShop?.id }),
      ...(selectedUser && { userId: selectedUser?.id }),
      ...(selectedClient && { clientId: selectedClient?.id }),
    };

    getSales(searchParameters);
    hideModal();
  };

  const getShopUsers = async () => {
    if (selectedShop) {
      await new BaseApiService(`/shops/${selectedShop?.id}/user-accounts`)
        .getRequestWithJsonResponse({ offset: 0, limit: 0 })
        .then((response) => {
          setShopUsers(response?.records);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const loadProducts = async () => {
    const data = await UserSessionUtils.getShopProducts();
    setProducts(data);
  };
  useEffect(() => {
    getShopUsers();
    loadProducts();
    getClients();
  }, [selectedShop]);

  const clearFilters = () => {
    setFiletrProduct(null);
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedUser(null);
    setSelectedClient(null);
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

          <View style={{ gap: 10, marginTop: 10 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <MyInput
                placeholder={"From date"}
                isDateInput
                label="From date"
                dateValue={startDate}
                maximumDate
                onDateChange={(date) => setStartDate(date)}
                style={{ flex: 0.5 }}
              />
              <MyInput
                style={{ flex: 0.5 }}
                placeholder={"To date"}
                isDateInput
                label="To date"
                dateValue={endDate}
                maximumDate
                onDateChange={(date) => setEndDate(date)}
              />
            </View>

            {shops?.length > 1 && (
              <MyDropDown data={shops} labelField={"name"} valueField={"id"} onChange={(e) => setFiletrShop(e)} value={filterShop} label={"Shop"} />
            )}

            {shopUsers?.length > 1 && (
              <MyDropDown
                data={shopUsers}
                labelField={"fullName"}
                valueField={"id"}
                onChange={(e) => setSelectedUser(e)}
                value={selectedUser}
                label={"Shop user"}
                placeholder="Select shop user"
              />
            )}

            {clients?.length > 0 && (
              <MyDropDown
                style={{ backgroundColor: Colors.light, borderColor: Colors.dark, marginTop: 5 }}
                data={clients}
                onChange={(e) => setSelectedClient(e)}
                value={selectedClient}
                placeholder="Select client"
                labelField="fullName"
                valueField="id"
                label={"Client"}
              />
            )}

            <MyDropDown
              data={products}
              labelField={"productName"}
              valueField={"id"}
              onChange={(e) => setFiletrProduct(e)}
              value={filterProduct}
              label={"Product"}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PrimaryButton title={"Clear"} onPress={clearFilters} style={{ flex: 0.5 }} darkMode={false} />
          <PrimaryButton darkMode title={"Apply "} onPress={applyFilter} style={{ flex: 0.5 }} />
        </View>
      </View>
    </Modal>
  );
};

export default SalesFilter;
