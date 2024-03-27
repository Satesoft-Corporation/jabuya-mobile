import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import ModalContent from "../ModalContent";
import Card from "../Card";
import {
  convertToServerDate,
  formatDate,
  formatNumberWithCommas,
  hasNull,
} from "../../utils/Utils";
import Colors from "../../constants/Colors";
import SalesTable from "./SalesTable";
import PrimaryButton from "../buttons/PrimaryButton";
import PaymentMethodComponent from "./PaymentMethodComponent";
import { SaleEntryContext } from "../../context/SaleEntryContext";
import { BaseApiService } from "../../utils/BaseApiService";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import NetInfo from "@react-native-community/netinfo";
import { UserContext } from "../../context/UserContext";
import { paymentMethods } from "../../constants/Constants";

const ConfirmSaleModal = ({ setVisible, setLoading, snackbarRef, visible }) => {
  const [submitted, setSubmitted] = useState(false);
  const [soldOnDate, setSoldOnDate] = useState(new Date());
  const [clientName, setClientName] = useState("");
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [serverError, setError] = useState(null);

  const { userParams, selectedShop } = useContext(UserContext);

  const {
    selections,
    recievedAmount,
    totalCost,
    clearEverything,
    totalQty,
    selectedPaymentMethod,
  } = useContext(SaleEntryContext);

  const { isShopAttendant, attendantShopId } = userParams;

  const clearForm = () => {
    setClientName("");
    setAmountPaid("");
    setClientPhoneNumber("");
    setError(null);
  };

  const postSales = () => {
    setSubmitted(true);
    setError(null);
    const onCredit = selectedPaymentMethod?.id === 1;

    let payLoad = {
      id: null,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      amountPaid: onCredit ? Number(amountPaid) : Number(recievedAmount),
      lineItems: selections,
      paymentMode: selectedPaymentMethod?.id,
      onCredit: onCredit,
      soldOnDate: convertToServerDate(soldOnDate),
      ...(onCredit && { clientPhoneNumber: clientPhoneNumber }),
      ...(onCredit && { clientName: clientName }),
    };

    setLoading(true);

    NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        new BaseApiService("/shop-sales")
          .postRequest(payLoad)
          .then(async (response) => {
            let d = { info: await response.json(), status: response.status };
            return d;
          })
          .then(async (d) => {
            let { info, status } = d;
            let id = info?.id;

            if (status === 200) {
              new BaseApiService(`/shop-sales/${id}/confirm`)
                .postRequest()
                .then((d) => d.json())
                .then((d) => {
                  if (d.status === "Success") {
                    setVisible(false);
                    setLoading(false);
                    clearEverything();
                    clearForm();
                    snackbarRef.current.show(
                      "Sale confirmed successfully",
                      4000
                    );
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
        await UserSessionUtils.addPendingSale(payLoad);
        setVisible(false);
        setTimeout(() => setLoading(false), 1000);
        clearEverything();
        clearForm();
        snackbarRef.current.show(
          "Sale record will be saved when online.",
          4000
        );
      }
    });
  };

  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <Card
        style={{
          alignSelf: "center",
          minHeight: 120,
          maxHeight: 490,
          width: 315,
          paddingBottom: 7,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.light,
            padding: 2,
          }}
        >
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
            <TouchableOpacity
              onPress={() => {
                setVisible();
                setError(null);
              }}
            >
              <Image
                source={require("../../assets/icons/ic_close.png")}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: "contain",
                  marginStart: 15,
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 12,
                color: Colors.gray,
                alignSelf: "flex-end",
              }}
            >
              {formatDate(new Date())}
            </Text>
            <Text>Currency : UGX</Text>
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
            clientName={clientName}
            setClientName={setClientName}
            clientPhoneNumber={clientPhoneNumber}
            setClientPhoneNumber={setClientPhoneNumber}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
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
                setVisible();
              }}
            />
            <PrimaryButton title={"Save"} onPress={postSales} />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
};

export default ConfirmSaleModal;
