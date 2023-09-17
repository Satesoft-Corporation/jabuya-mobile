import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
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

const tableHead = ["No", "Product", "Qnty", "Amount"];

function SalesEntry() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]); //unfiltered selections array
  const [quantity, setQuantity] = useState(null);
  const [selections, setSelections] = useState([]); // products in the table(filtered)
  const [showMoodal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    let searchParameters = { searchTerm: searchTerm, offset: 0, limit: limit };
    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setProducts(response.records);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const handleChange = (value) => {
    setLoading(true);
    setSearchTerm(value);
  };

  const makeSelection = (item) => {
    setShowModal(true);
    setSelection(item);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.light_2,
          paddingHorizontal: 15,
          paddingBottom: 30,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <AppStatusBar />
          <OrientationLoadingOverlay
            visible={loading}
            color="white"
            indicatorSize="large"
            messageFontSize={24}
            message="Loading..."
          />

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
              }}
            >
              <FontAwesome5 name="money-bill" size={24} color="black" />
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Recieved</Text>
                <Text>Amount paid</Text>
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
                  fontWeight: 500,
                }}
              >
                UGX 10,000
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
              marginTop: 15,
            }}
          >
            <Table>
              <Row
                data={tableHead}
                style={{ height: 40 }}
                textStyle={{
                  // margin: 5,
                  fontWeight: 600,
                }}
                flexArr={[0.8, 2, 0.8, 1]}
              />

              <TableWrapper style={{ flexDirection: "row" }}>
                <Rows
                  style={{ borderTopColor: Colors.dark, borderTopWidth: 0.5 }}
                  data={selections}
                  textStyle={{
                    margin: 5,
                    textAlign: "left",
                  }}
                  flexArr={[0.8, 2, 0.8, 1]}
                />
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
                <Text style={{ fontWeight: "bold" }}>Purchased Amount</Text>
                <Text>
                  Payment for {selections.length}{" "}
                  {selections.length > 1 ? (
                    <Text>items</Text>
                  ) : (
                    <Text>item</Text>
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
                    fontWeight: 500,
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
                <Text>Cash less purchase</Text>
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
                  fontWeight: 500,
                }}
              >
                UGX 500
              </Text>
            </View>
          </View>

          <IconsComponent
            setSelectedProducts={() => setSelectedProducts([])}
            setSelections={() => setSelections([])}
            setTotalCost={() => setTotalCost(0)}
          />
          <MaterialButton
            title="Confirm Purchase"
            style={{
              backgroundColor: Colors.dark,
              marginTop: 10,
              borderRadius: 5,
            }}
            titleStyle={{
              fontWeight: "bold",
              color: Colors.primary,
            }}
            buttonPress={() => {
              console.log(selections);
              setShowModal(true);
            }}
          />
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
                <MaterialButton
                  title="Confirm"
                  style={{
                    backgroundColor: Colors.dark,
                    marginTop: 10,
                    borderRadius: 5,
                    width: 150,
                    alignSelf: "center",
                    marginBottom: 20,
                  }}
                  titleStyle={{
                    fontWeight: "bold",
                    color: Colors.primary,
                  }}
                  buttonPress={() => {
                    let cost = selection.salesPrice * quantity;
                    setLoading(true);
                    setTotalCost(totalCost + cost);
                    selectedProducts.push(selection);
                    setSelections((prev) => [
                      ...prev,
                      [
                        selections.length + 1,
                        selection.productName,
                        quantity,
                        selection.salesPrice,
                      ],
                    ]);
                    setLoading(false);
                    setShowModal(false);
                  }}
                />
              </View>
            </Card>
          </ModalContent>
        </ScrollView>
      </View>
    </SafeAreaView>
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
          setValue(item.productName);
          setIsFocus(false);
          setLoading(false);
          makeSelection(item);
        }}
        onChangeText={(text) => handleChange(text)}
      />
      {/* <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
        }}
      >
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={30}
          color="black"
          style={{}}
        />
      </TouchableOpacity> */}
    </View>
  );
};

const IconsComponent = ({
  setSelectedProducts,
  setSelections,
  setTotalCost,
}) => {
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
            setSelections();
            setSelectedProducts();
            setTotalCost();
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
    marginTop: 20,
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
