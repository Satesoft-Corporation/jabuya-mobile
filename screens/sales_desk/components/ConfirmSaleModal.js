import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "context/UserContext";
import { SaleEntryContext } from "context/SaleEntryContext";
import { useNetInfo } from "@react-native-community/netinfo";
import {
  convertToServerDate,
  formatDate,
  formatNumberWithCommas,
} from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import {
  saveClientSalesOnDevice,
  saveShopProductsOnDevice,
} from "@controllers/OfflineControllers";
import SalesTable from "./SalesTable";
import PaymentMethodComponent from "./PaymentMethodComponent";
import PrimaryButton from "@components/buttons/PrimaryButton";
import ModalContent from "@components/ModalContent";
import Colors from "@constants/Colors";
import { UserSessionUtils } from "@utils/UserSessionUtils";

const ConfirmSaleModal = ({ setVisible, snackbarRef, visible, clients }) => {
  const [submitted, setSubmitted] = useState(false);
  const [soldOnDate, setSoldOnDate] = useState(new Date());
  const [amountPaid, setAmountPaid] = useState("");
  const [serverError, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const { userParams, selectedShop } = useContext(UserContext);

  const netinfo = useNetInfo();

  const {
    selections,
    recievedAmount,
    totalCost,
    clearEverything,
    totalQty,
    selectedPaymentMethod,
    setLoading,
  } = useContext(SaleEntryContext);

  const { isShopAttendant, attendantShopId, isShopOwner, shopOwnerId } =
    userParams;

  const clearForm = () => {
    setAmountPaid("");
    setSelectedClient(null);
    setError(null);
  };

  const postSales = async () => {
    setSubmitted(true);
    setError(null);

    const searchParameters = {
      offset: 0,
      limit: 10000,
      ...(isShopAttendant && { shopId: attendantShopId }),
      ...(isShopOwner && { shopOwnerId }),
    };

    const onCredit = selectedPaymentMethod?.id === 1;

    let payLoad = {
      id: null,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      amountPaid: onCredit ? Number(amountPaid) : Number(recievedAmount),
      lineItems: selections,
      paymentMode: selectedPaymentMethod?.id,
      onCredit: onCredit,
      soldOnDate: convertToServerDate(soldOnDate),
      ...(onCredit && { clientPhoneNumber: selectedClient?.phoneNumber }),
      ...(onCredit && { clientId: selectedClient?.id }),
    };

    setLoading(true);

    if (netinfo?.isConnected === true) {
      await new BaseApiService("/shop-sales")
        .postRequest(payLoad)
        .then(async (response) => {
          let d = { info: await response.json(), status: response.status };
          return d;
        })
        .then(async (d) => {
          let { info, status } = d;
          let id = info?.id;

          if (status === 200) {
            await new BaseApiService(`/shop-sales/${id}/confirm`)
              .postRequest()
              .then((d) => d.json())
              .then(async (response) => {
                if (response.status === "Success") {
                  setLoading(false);
                  setVisible(false);
                  clearEverything();
                  clearForm();
                  snackbarRef.current.show("Sale confirmed successfully", 4000);
                  await saveShopProductsOnDevice(searchParameters, true); // updating offline products
                  if (onCredit) {
                    await saveClientSalesOnDevice(searchParameters);
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
      await UserSessionUtils.addPendingSale(payLoad);
      setTimeout(() => setLoading(false), 1000);
      clearEverything();
      clearForm();
      snackbarRef.current.show("Sale record will be saved when online.", 4000);
    }
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
          Confirm sale
        </Text>
      </View>

      {serverError && (
        <View style={{ marginVertical: 5 }}>
          <Text
            numberOfLines={4}
            style={{
              color: Colors.error,
              fontWeight: 500,
            }}
          >
            {serverError}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: 12,
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {formatDate(new Date())}
        </Text>
        <Text>Currency : {selectedShop?.currency}</Text>
      </View>

      <SalesTable sales={selections} fixHeight={false} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Recieved </Text>
        <Text
          style={{
            alignSelf: "flex-end",
            fontWeight: "bold",
            marginEnd: 4,
          }}
        >
          {formatNumberWithCommas(recievedAmount)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 3,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>
          Sold{" "}
          <Text style={{ fontWeight: "400" }}>
            {totalQty >= 1 && (
              <Text>
                {totalQty}
                {totalQty > 1 ? <Text> items</Text> : <Text> item</Text>}
              </Text>
            )}
          </Text>
        </Text>

        <Text
          style={{
            alignSelf: "flex-end",
            fontWeight: "bold",
            marginEnd: 4,
          }}
        >
          {formatNumberWithCommas(totalCost)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Balance</Text>
        <Text
          style={{
            alignSelf: "flex-end",
            fontWeight: "bold",
            marginEnd: 4,
            fontSize: 15,
          }}
        >
          {formatNumberWithCommas(recievedAmount - totalCost)}
        </Text>
      </View>

      <PaymentMethodComponent
        submitted={submitted}
        soldOnDate={soldOnDate}
        setSoldOnDate={setSoldOnDate}
        amountPaid={amountPaid}
        setAmountPaid={setAmountPaid}
        clients={clients}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />

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
          onPress={() => {
            setLoading(false);
            setVisible();
            setError(null);
            setSelectedClient(null);
            setAmountPaid(null);
          }}
        />
        <PrimaryButton title={"Save"} onPress={postSales} />
      </View>
    </ModalContent>
  );
};

export default ConfirmSaleModal;
