import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";
import MaterialButton from "../components/MaterialButton";
import { BaseApiService } from "../utils/BaseApiService";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import ModalContent from "../components/ModalContent";
import Card from "../components/Card";
import ConfirmSalesDialog from "../components/ConfirmSalesDialog";
import { Ionicons } from "@expo/vector-icons";
import BlackAndWhiteScreen from "../components/BlackAndWhiteScreen";

const tableHead = ["Item", "Price", "Qnty", "Amount"];

function SalesEntry({ route, navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]); //unfiltered selections array
  const [quantity, setQuantity] = useState(null);
  const [selections, setSelections] = useState([]); // products in the table(filtered)
  const [showMoodal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [recievedAmount, setRecievedAmount] = useState("");
  const [showMoodal_1, setShowModal_1] = useState(false);
  const [shopId, setShopId] = useState(route.params.shopOwnerId);
  const [attendantShopId, setAttendantShopId] = useState(
    route.params.attendantShopId
  );
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [postedPdts, setPostedPdts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [returnCost, setReturnedCost] = useState(0);
  const [qntyList, setQntyList] = useState([]);
  const [a, b] = useState(0); // responsible for updating the total items in a cart
  const [returnedList, setReturnedList] = useState([]);
  const [returnedId, setReturnedId] = useState(null);
  const [length, setLength] = useState(null);
  const [amountPaid, setAmountPaid] = useState(null);
  const [balanceGivenOut, setBalanceGivenOut] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    let searchParameters = { offset: 0, limit: limit, shopId: attendantShopId };
    // if (query != undefined && query != null) {
    //   searchParameters.searchTerm = query;
    // }

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setProducts(response.records);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const postSales = () => {
    let payLoad = {
      id: shopId,
      shopId: attendantShopId,
      amountPaid: totalCost,
      lineItems: selectedProducts,
    };
    new BaseApiService("/shop-sales")
      .postRequest(payLoad)
      .then(async (response) => {
        let d = { info: await response.json(), status: response.status };
        return d;
      })
      .then(async (d) => {
        let { info, status } = d;
        let items = info.lineItems;
        let id = info.id;
        let totalCost_1 = info.totalCost;
        setReturnedCost(totalCost_1);
        setReturnedList(items);
        setReturnedId(id);
        setLength(items.length);
        setAmountPaid(info.amountPaid);
        setBalanceGivenOut(info.balanceGivenOut);
        for (let item of items) {
          lineItems.push([
            item.shopProductName,
            item.quantity,
            item.unitCost,
            item.totalCost,
          ]);
        }
        setShowConfirmed(true);
        setTimeout(() => setLoading(false), 1000);

      })
      .catch((error) => {
        Alert.alert("Failed to confirm purchases!", error?.message);
        setLoading(false);
      });
  };

  const saveSales = (items, id) => {
    setLoading(true);
    postedPdts.push(items);
    new BaseApiService(`/shop-sales/${id}/confirm`)
      .postRequest()
      .then((d) => d.json())
      .then((d) => {
        if (d.status === "Success") {
          setShowConfirmed(false)
          Alert.alert("Sale Confirmed Successfully");
          setLoading(false);
          clearEverything();
        }
      })
      .catch((error) => {
        Alert.alert("Failed to confirm purchases!", error?.message);
        setLoading(false);
      });
  };

  const handleChange = (value) => {
    fetchProducts(value);
  };

  const makeSelection = (item) => {
    setShowModal(true);
    setSelection(item);
  };

  const clearEverything = () => {
    setSelectedProducts([]);
    setQuantity(null);
    setSelection(null);
    setTotalCost(0);
    setRecievedAmount(0);
    setShowConfirmed(false);
    setSelections([]);
    setLineItems([]);
    setQntyList([]);
  };

  const getTotalItems = () => {
    b(qntyList.reduce((a, b) => a + b, 0));
  };

  useEffect(() => getTotalItems(), [qntyList]);
  return (
    <BlackAndWhiteScreen flex={1.15}>
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

      <OrientationLoadingOverlay
        visible={loading}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
      <ConfirmSalesDialog
        visible={showConfirmed}
        addSale={() => {
          saveSales(returnedList, returnedId);
        }}
        sales={lineItems}
        total={returnCost}
        setVisible={() => setShowConfirmed(false)}
        clear={clearEverything}
        transID={returnedId}
        amountPaid={amountPaid}
        balanceGivenOut={balanceGivenOut}
        length={length}
        resetList={() => setLineItems([])}
      />
<View style={{paddingHorizontal:10}}>
      <DropdownComponent
        products={products}
        handleChange={(t) => handleChange(t)}
        setLoading={() => setLoading(false)}
        makeSelection={makeSelection}
      />
      <View
        style={{
          backgroundColor: Colors.light,
          borderRadius: 5,
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            elevation: 10,
            shadowOffset: { width: 0, height: 25 },
            shadowOpacity: 0.8,
          }}
        >
          <FontAwesome5 name="money-bill" size={24} color="black" />
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Recieved Amt</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: Colors.gray,
                fontSize: 17,
                marginEnd: 5,
              }}
            >
              UGX
            </Text>
            <TextInput
              value={recievedAmount}
              inputMode="numeric"
              onChangeText={(text) => setRecievedAmount(text)}
              style={{
                backgroundColor: Colors.light,
                borderRadius: 8,
                padding: 5,
                width: 120,
                fontSize: 17,
              }}
              placeholder="Enter Amount"
            />
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.light,
          borderRadius: 5,
          padding: 10,
          marginTop: 10,
        }}
      >
        <Table>
          <Row
            data={tableHead}
            style={{ height: 40 }}
            textStyle={{
              fontWeight: 600,
            }}
            flexArr={[2.5, 1.3, 0.6, 1]}
          />

          <TableWrapper style={{ flexDirection: "row" }}>
            <ScrollView
              style={{ height: 150 }}
              showsVerticalScrollIndicator={false}
            >
              <Rows
                style={{
                  borderTopColor: Colors.gray,
                  borderTopWidth: 0.3,
                }}
                data={selections}
                textStyle={{
                  margin: 5,
                  textAlign: "left",
                }}
                flexArr={[2.5, 1.3, 0.6, 1]}
              />
            </ScrollView>
          </TableWrapper>
        </Table>
        <View
          style={{
            backgroundColor: Colors.light,
            borderRadius: 5,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold", marginTop: 5, fontSize: 17 }}>
              Purchased{" "}
              {a >= 1 && (
                <Text>
                  {a}
                  {a > 1 ? <Text> items</Text> : <Text> item</Text>}
                </Text>
              )}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              UGX {totalCost}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.light,
          borderRadius: 5,
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="money-bill" size={24} color="black" />
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Balance</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontWeight: 700,
            }}
          >
            UGX {recievedAmount === 0 ? 0 : recievedAmount - totalCost}
          </Text>
        </View>
      </View>

      <IconsComponent clear={clearEverything} />

      <TouchableOpacity
        style={{
          backgroundColor: Colors.dark,
          borderRadius: 3,
          height: 40,
          justifyContent: "center",
          marginTop: 8,
        }}
        onPress={() => {
          if (recievedAmount !== 0 && selections.length > 0) {
            setLoading(true);
            postSales();
          }
        }}
      >
        <Text
          style={{
            color: Colors.primary,
            alignSelf: "center",
            fontSize: 17,
          }}
        >
          Confirm Purchase
        </Text>
      </TouchableOpacity>

      <ModalContent visible={showMoodal} style={{ padding: 35 }}>
        <Card
          style={{
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 2,
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontWeight: "500",
                fontSize: 18,
                marginBottom: 5,
                marginStart: 10,
                marginTop: 20,
              }}
            >
              Input quantity
            </Text>

            <TextInput
              inputMode="numeric"
              onChangeText={(text) => setQuantity(text)}
              maxLength={3}
              style={{
                backgroundColor: Colors.light_3,
                borderRadius: 8,
                padding: 6,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <MaterialButton
                title="Cancel"
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.dark,
                  marginStart: -2,
                  margin: 10,
                  height: 40,
                }}
                titleStyle={{
                  fontWeight: "bold",
                  color: Colors.dark,
                }}
                buttonPress={() => {
                  setShowModal(false);
                }}
              />
              <MaterialButton
                title="Confirm"
                style={{
                  backgroundColor: Colors.dark,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.dark,
                  marginStart: 2,
                  marginEnd: -2,
                  margin: 10,
                  height: 40,
                }}
                titleStyle={{
                  fontWeight: "bold",
                  color: Colors.primary,
                }}
                buttonPress={() => {
                  const parsedQuantity = parseInt(quantity, 10);

                  if (isNaN(parsedQuantity)) {
                    Alert.alert("Quantity is not a valid number");
                    return;
                  }

                  let cost = selection.salesPrice * parsedQuantity;
                  setTotalCost(totalCost + cost);

                  setQntyList((prev) => [...prev, parsedQuantity]);

                  selectedProducts.push({
                    id: selection.id,
                    shopProductId: selection.id,
                    quantity: parsedQuantity, // Use the parsed quantity
                  });
                  setSelections((prev) => [
                    ...prev,
                    [
                      selection.productName,
                      selection.salesPrice,
                      parsedQuantity, // Use the parsed quantity
                      cost,
                    ],
                  ]);

                  setShowModal(false);
                  setLoading(true);
                  setQuantity(null);
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                }}
              />
            </View>
          </View>
        </Card>
      </ModalContent>
      </View>
    </BlackAndWhiteScreen>
  );
}
const DropdownComponent = ({
  products,
  handleChange,
  setLoading,
  makeSelection,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.primary }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={products}
        search
        maxHeight={300}
        labelField="productName"
        valueField="productName"
        placeholder={!isFocus ? "Select Product" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          setLoading(false);
          makeSelection(item);
          setValue(null);
        }}
        onChangeText={(text) => handleChange(text)}
      />
    </View>
  );
};

const IconsComponent = ({ clear }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <FontAwesome name="credit-card" size={30} color="black" />
        <Text style={{ alignSelf: "center" }}>Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <FontAwesome name="mobile" size={30} color="black" />
        <Text style={{ alignSelf: "center" }}>Mobile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <FontAwesome name="wechat" size={30} color="black" />
        <Text style={{ alignSelf: "center" }}>Fap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <FontAwesome name="credit-card" size={30} color="black" />
        <Text style={{ alignSelf: "center" }}>Credit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.primary,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="broom"
          size={30}
          color="black"
          onPress={() => {
            clear();
          }}
        />
        <Text style={{ alignSelf: "center" }}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};
export default SalesEntry;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
  },
  dropdown: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.primary,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },

  label: {
    position: "absolute",
    // backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
