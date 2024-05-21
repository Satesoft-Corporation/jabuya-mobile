import { View, StyleSheet } from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import CardHeader from "../../../components/cardComponents/CardHeader";
import { formatDate, formatNumberWithCommas } from "../../../utils/Utils";
import { useNavigation } from "@react-navigation/native";
import { BaseApiService } from "../../../utils/BaseApiService";
import CardFooter2 from "../../../components/cardComponents/CardFooter2";
import { SHOP_SALES_ENDPOINT } from "../../../utils/EndPointUtils";
import SalesTable from "../../sales_desk/components/SalesTable";
import DataRow from "../../../components/cardComponents/DataRow";
import CardFooter1 from "../../../components/cardComponents/CardFooter1";
import { CREDIT_PAYMENTS } from "../../../navigation/ScreenNames";
import Icon from "../../../components/Icon";
import { Text } from "react-native";
import Colors from "../../../constants/Colors";

const ClientDebtsCard = ({
  debt,
  snackbarRef,
  removeLoader,
  lastItem = false,
}) => {
  const navigation = useNavigation();

  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const isFullyPaid = Math.abs(debt?.amountLoaned - debt?.amountRepaid) <= 0;

  const fetchLineItems = async () => {
    await new BaseApiService(`${SHOP_SALES_ENDPOINT}/${debt?.sale?.id}`)
      .getRequestWithJsonResponse()
      .then((response) => {
        setItems(response?.lineItems);

        if (lastItem === true) {
          removeLoader();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderLeft = useCallback(() => {
    if (isFullyPaid) {
      return (
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Icon
            name="checkcircleo"
            groupName="AntDesign"
            color={Colors.green}
          />

          <Text style={{ color: Colors.green }}>Cleared</Text>
        </View>
      );
    }
  }, [isFullyPaid]);

  useEffect(() => {
    fetchLineItems();
  }, []);

  if (items.length > 0) {
    return (
      <View style={styles.container}>
        <CardHeader
          value1={`SN: ${debt?.serialNumber}`}
          value2={formatDate(debt?.dateCreated)}
        />

        <SalesTable sales={items} fixHeight={false} />
        {expanded && (
          <View style={{ flex: 1, marginTop: 10 }}>
            <DataRow
              key={1}
              label={"Total Debt"}
              value={formatNumberWithCommas(debt?.amountLoaned)}
              // style={{ marginTop: 5, marginBottom: 10 }}
              showCurrency
            />

            <DataRow
              key={2}
              label={"Paid"}
              value={formatNumberWithCommas(debt?.amountRepaid)}
              showCurrency
            />

            <DataRow
              key={4}
              label={"Balance"}
              value={formatNumberWithCommas(
                debt?.amountLoaned - debt?.amountRepaid
              )}
              showCurrency
            />

            <DataRow
              key={5}
              label={"Served by"}
              value={debt?.createdByFullName}
            />

            <CardFooter1
              btnTitle2="Hide"
              btnTitle1="Pay"
              onClick1={() => {
                if (!isFullyPaid) {
                  navigation?.navigate(CREDIT_PAYMENTS, debt);
                } else {
                  snackbarRef?.current?.show("Sale is fully paid");
                }
              }}
              onClick2={toggleExpand}
              style={{ marginTop: 15 }}
            />
          </View>
        )}

        {!expanded && (
          <CardFooter2
            btnTitle="More"
            onBtnPress={toggleExpand}
            renderLeft={renderLeft}
          />
        )}
      </View>
    );
  }
};

export default memo(ClientDebtsCard);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 3,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 5,
    elevation: 1,
  },
  content: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
});
