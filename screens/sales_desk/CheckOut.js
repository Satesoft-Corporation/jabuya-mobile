import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { convertToServerDate, formatDate, formatNumberWithCommas } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Colors from "@constants/Colors";
import DataRow from "@components/card_components/DataRow";
import { useDispatch, useSelector } from "react-redux";
import { getAttendantShopId, getCart, getIsAdmin, getIsShopAttendant, getOfflineParams, getSelectedShop } from "duqactStore/selectors";
import { addOfflineSale, clearCart } from "actions/shopActions";
import { paymentMethods, screenHeight } from "@constants/Constants";
import { SHOP_SALES_ENDPOINT } from "@utils/EndPointUtils";
import { hasInternetConnection } from "@utils/NetWork";
import { saveShopClients, saveShopProductsOnDevice } from "@controllers/OfflineControllers";
import TopHeader from "@components/TopHeader";
import SalesTable from "./components/SalesTable";
import PaymentMethodComponent from "./components/PaymentMethodComponent";
import Loader from "@components/Loader";
import SuccessDialog from "@components/SuccessDialog";
import { StackActions, useNavigation } from "@react-navigation/native";
import { OFFLINE_SALES, SALES_REPORTS } from "@navigation/ScreenNames";

const CheckOut = () => {
  const dispatch = useDispatch();
  const selectedShop = useSelector(getSelectedShop);
  const cart = useSelector(getCart);
  const offlineParams = useSelector(getOfflineParams);
  const attendantShopId = useSelector(getAttendantShopId);

  const isShopAttendant = useSelector(getIsShopAttendant);

  const clearEverything = () => dispatch(clearCart());

  const { cartItems, totalCartCost, recievedAmount, totalQty } = cart;

  const [submitted, setSubmitted] = useState(false);
  const [soldOnDate, setSoldOnDate] = useState(new Date());
  const [amountPaid, setAmountPaid] = useState("");
  const [serverError, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingClient, setExistingClient] = useState(false);

  const [offline, setOffline] = useState(false);

  const isSuperAdmin = useSelector(getIsAdmin);

  const clearForm = () => {
    setAmountPaid("");
    setSelectedClient(null);
    setError(null);
    setClientName("");
    setClientNumber("");
    setSubmitted(false);
  };
  useEffect(() => {
    if (selectedClient) {
      setError(null);
    }
    setExistingClient(selectedShop?.clientDetailsAreMandatoryOnAllSales === true);
  }, []);

  useEffect(() => {
    setSubmitted(false);
  }, [selectedPaymentMethod]);

  const postSales = async () => {
    setError(null);

    const onCredit = selectedPaymentMethod?.id === 1;

    const payLoad = {
      id: null,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      amountPaid: onCredit ? Number(amountPaid) : Number(recievedAmount),
      lineItems: cartItems,
      paymentMode: selectedPaymentMethod?.id,
      onCredit: onCredit,
      soldOnDate: convertToServerDate(soldOnDate),
      clientId: selectedClient?.id,
      clientPhoneNumber: clientNumber,
      clientName: clientName,
    };
    setLoading(true);

    const hasNet = await hasInternetConnection();

    if (hasNet === true) {
      await new BaseApiService(SHOP_SALES_ENDPOINT)
        .postRequest(payLoad)
        .then(async (response) => {
          let d = { info: await response.json(), status: response.status };
          return d;
        })
        .then(async (d) => {
          let { info, status } = d;
          let id = info?.id;

          if (status === 200) {
            await new BaseApiService(`${SHOP_SALES_ENDPOINT}/${id}/confirm`)
              .postRequest()
              .then((d) => d.json())
              .then(async (response) => {
                if (response.status === "Success") {
                  setLoading(false);
                  clearEverything();
                  clearForm();
                  setSuccess(true);
                  if (isSuperAdmin === false) {
                    setTimeout(async () => {
                      await saveShopProductsOnDevice(offlineParams);
                    }, 10000);
                  }

                  if (onCredit) {
                    setTimeout(async () => {
                      await saveShopClients(offlineParams);
                    }, 10000);
                  }
                }
              })
              .catch((error) => {
                setLoading(false);
                setError(`Failed to confirm sale!, ${error?.message}`);
              });
          } else {
            setLoading(false);

            setError(`Failed to confirm sale!, ${info?.message}`);
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(`Failed to confirm sale!,${error?.message}`);
        });
    } else {
      setOffline(true);
      setLoading(false);
      dispatch(addOfflineSale(payLoad));
      setSuccess(true);
      clearEverything();
      clearForm();
    }
  };

  const validate = () => {
    setError(null);
    setSubmitted(true);

    const isValidAmount = Number(recievedAmount) >= totalCartCost;
    let isValid = true;

    if (selectedPaymentMethod?.id === 0) {
      if (isNaN(recievedAmount)) {
        setError("Invalid input for recieved amount.");
        isValid = false;
        return;
      }
      if (!isValidAmount) {
        setError(`Recieved amount should not be less than ${selectedShop?.currency}${formatNumberWithCommas(totalCartCost)}`);
        isValid = false;
        return;
      }

      if (!selectedClient && existingClient) {
        setError("Client selection is required for this sale");
        isValid = false;
        return;
      }
    }

    if (selectedPaymentMethod?.id === 1) {
      if (isNaN(amountPaid)) {
        setError("Please enter a valid amount.");
        isValid = false;
        return;
      }

      if (!selectedClient) {
        setError("Client selection is required for debt sales.");
        isValid = false;
        return;
      }
    }

    if (isValid === true) {
      postSales();
    }
  };

  useEffect(() => {
    setSelectedPaymentMethod(recievedAmount < totalCartCost ? paymentMethods[1] : paymentMethods[0]);
  }, []);

  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
      <Loader loading={loading} />

      <SuccessDialog
        text={offline ? "Sale saved offline" : "Sale confirmed successfully"}
        onAgree={() => navigation.dispatch(StackActions.replace(offline ? OFFLINE_SALES : SALES_REPORTS))}
        agreeText={offline ? "Offline sales" : "View sales"}
        cancelText={"Add new Sale"}
        hide={() => navigation.goBack()}
        visible={success}
      />

      <TopHeader title="Confirm sale" />
      <ScrollView style={{ paddingHorizontal: 10 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              marginTop: 10,
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 12,
              marginStart: 1,
            }}
          >
            Confirm sale
          </Text>
        </View>

        {serverError && (
          <View style={{ marginVertical: 3 }}>
            <Text numberOfLines={4} style={{ color: Colors.error, fontWeight: 500 }}>
              {serverError}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: Colors.gray, alignSelf: "flex-end" }}>{formatDate(new Date())}</Text>
        </View>

        <View style={{ height: screenHeight / 3 }}>
          <SalesTable sales={cartItems} disableSwipe />
        </View>

        <DataRow label={"Recieved"} value={formatNumberWithCommas(recievedAmount)} currency={selectedShop?.currency} />

        <DataRow
          label={`Sold ${totalQty > 1 ? `${totalQty} items` : `${totalQty} item`}`}
          value={formatNumberWithCommas(totalCartCost)}
          currency={selectedShop?.currency}
        />

        <DataRow label={"Balance"} value={formatNumberWithCommas(recievedAmount - totalCartCost)} currency={selectedShop?.currency} />

        <PaymentMethodComponent
          submitted={submitted}
          soldOnDate={soldOnDate}
          setSoldOnDate={setSoldOnDate}
          amountPaid={amountPaid}
          setAmountPaid={setAmountPaid}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          clientName={clientName}
          clientNumber={clientNumber}
          setClientName={setClientName}
          setClientNumber={setClientNumber}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          existingClient={existingClient}
          setExistingClient={setExistingClient}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            gap: 10,
            marginBottom: 10,
          }}
        >
          <PrimaryButton
            title={"Cancel"}
            style={{ flex: 0.5 }}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <PrimaryButton title={"Save"} onPress={validate} style={{ flex: 0.5 }} darkMode />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOut;
