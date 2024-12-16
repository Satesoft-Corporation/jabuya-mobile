import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { convertToServerDate, formatDate, formatNumberWithCommas } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import { saveClientSalesOnDevice } from "@controllers/OfflineControllers";
import SalesTable from "./SalesTable";
import PaymentMethodComponent from "./PaymentMethodComponent";
import PrimaryButton from "@components/buttons/PrimaryButton";
import ModalContent from "@components/ModalContent";
import Colors from "@constants/Colors";
import DataRow from "@components/card_components/DataRow";
import { useDispatch, useSelector } from "react-redux";
import { getAttendantShopId, getCart, getOfflineParams, getSelectedShop, getShopClients, getUserType } from "reducers/selectors";
import { addOfflineSale, clearCart, setClientSales } from "actions/shopActions";
import { paymentMethods, userTypes } from "@constants/Constants";
import { SHOP_SALES_ENDPOINT } from "@utils/EndPointUtils";
import { hasInternetConnection } from "@utils/NetWork";

const ConfirmSaleModal = ({ setVisible, snackbarRef, visible, onComplete, setLoading }) => {
  const dispatch = useDispatch();
  const selectedShop = useSelector(getSelectedShop);
  const cart = useSelector(getCart);
  const offlineParams = useSelector(getOfflineParams);
  const attendantShopId = useSelector(getAttendantShopId);
  const prevClients = useSelector(getShopClients);

  const userType = useSelector(getUserType);

  const isShopAttendant = userType === userTypes.isShopAttendant;
  const isSuperAdmin = userType === userTypes.isSuperAdmin;

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

  const clearForm = () => {
    setAmountPaid("");
    setSelectedClient(null);
    setError(null);
    setClientName("");
    setClientNumber("");
  };

  const postSales = async () => {
    setSubmitted(true);
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
      ...(selectedClient && { clientPhoneNumber: selectedClient?.phoneNumber, clientId: selectedClient?.id, clientName: selectedClient?.fullName }),
      ...(!onCredit && clientNumber && { clientPhoneNumber: clientNumber }),
      ...(!onCredit && clientName && { clientName: clientName }),
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
                  setVisible(false);
                  clearEverything();
                  clearForm();
                  snackbarRef.current.show("Sale confirmed successfully", 4000);
                  onComplete();
                  if (onCredit && !isSuperAdmin) {
                    const c = await saveClientSalesOnDevice(offlineParams, prevClients);
                    dispatch(setClientSales(c));
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
      setVisible(false);
      dispatch(addOfflineSale(payLoad));
      setTimeout(() => setLoading(false), 1000);
      clearEverything();
      clearForm();
      snackbarRef.current.show("Sale record will be saved when online.", 4000);
    }
  };

  const validate = () => {
    setError(null);
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
  }, [visible]);

  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 18, marginBottom: 12, marginStart: 1 }}>Confirm sale</Text>
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

      <SalesTable sales={cartItems} fixHeight={false} disableSwipe />

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
        visible={visible}
        clientName={clientName}
        clientNumber={clientNumber}
        setClientName={setClientName}
        setClientNumber={setClientNumber}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 10, marginBottom: 10 }}>
        <PrimaryButton
          darkMode={false}
          title={"Cancel"}
          style={{ flex: 0.5 }}
          onPress={() => {
            setLoading(false);
            setVisible();
            setError(null);
            setSelectedClient(null);
            setAmountPaid(null);
            setSelectedPaymentMethod(null);
          }}
        />
        <PrimaryButton title={"Save"} onPress={validate} style={{ flex: 0.5 }} />
      </View>
    </ModalContent>
  );
};

export default ConfirmSaleModal;
