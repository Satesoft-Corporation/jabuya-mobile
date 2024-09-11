import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRef } from "react";
import {
  BARCODE_SCREEN,
  CREDIT_SALES,
  SALES_REPORTS,
} from "@navigation/ScreenNames";
import Colors from "@constants/Colors";
import ConfirmSaleModal from "./components/ConfirmSaleModal";
import EnterSaleQtyModal from "./components/EnterSaleQtyModal";
import { BlackScreen } from "@components/BlackAndWhiteScreen";
import UserProfile from "@components/UserProfile";
import {
  MyDropDown,
  SalesDropdownComponent,
} from "@components/DropdownComponents";
import { formatNumberWithCommas } from "@utils/Utils";
import PrimaryButton from "@components/buttons/PrimaryButton";
import SalesTable from "./components/SalesTable";
import Snackbar from "@components/Snackbar";
import DataRow from "@components/card_components/DataRow";
import { scale } from "react-native-size-matters";
import { ALL_SHOPS_LABEL, screenWidth, userTypes } from "@constants/Constants";
import { SHOP_PRODUCTS_ENDPOINT } from "@utils/EndPointUtils";
import { BaseApiService } from "@utils/BaseApiService";
import { saveShopProductsOnDevice } from "@controllers/OfflineControllers";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  getCartSelection,
  getFilterParams,
  getOffersDebt,
  getOfflineParams,
  getSelectedShop,
  getShopClients,
  getShopProducts,
  getShops,
  getUserType,
} from "reducers/selectors";
import {
  changeSelectedShop,
  clearCart,
  makeProductSelection,
  setShopProducts,
  updateRecievedAmount,
} from "actions/shopActions";
import Loader from "@components/Loader";

function SalesDesk({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [clients, setClients] = useState([]);
  const [showMoodal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const snackbarRef = useRef(null);

  const dispatch = useDispatch();

  const selectedShop = useSelector(getSelectedShop);
  const offlineParams = useSelector(getOfflineParams);
  const shopProducts = useSelector(getShopProducts);
  const shopClients = useSelector(getShopClients);
  const userType = useSelector(getUserType);
  const filterParams = useSelector(getFilterParams);
  const shops = useSelector(getShops);
  const selection = useSelector(getCartSelection);
  // const offersDebt = false;
  const offersDebt = useSelector(getOffersDebt);

  const cart = useSelector(getCart);

  const clearEverything = () => dispatch(clearCart());

  const { cartItems, totalCartCost, recievedAmount, totalQty } = cart;

  const isSuperAdmin = userType === userTypes.isSuperAdmin;
  const isShopAttendant = userType === userTypes.isShopAttendant;

  const menuItems = [
    {
      name: "Daily sales",
      onClick: () => navigation.navigate(SALES_REPORTS),
    },
    {
      name: "Debts",
      onClick: () => navigation.navigate(CREDIT_SALES),
    },
  ];

  const fetchProducts = async () => {
    if (isSuperAdmin) {
      await fetchProductsFromServer();
      return;
    } else {
      const pdtList = shopProducts.filter((p) => p.shopId === selectedShop?.id);

      const clist = shopClients.filter((i) => i?.shop?.id === selectedShop?.id);

      const inStock = pdtList
        ?.filter((pdt) => pdt?.performanceSummary)
        .filter((pdt) => {
          const { totalQuantityStocked, totalQuantitySold } =
            pdt?.performanceSummary;
          const qtyInStock = totalQuantityStocked - totalQuantitySold;
          return qtyInStock > 0;
        });
      setProducts(inStock);
      setClients(clist);
    }
  };

  const fetchProductsFromServer = async () => {
    if (selectedShop?.name !== ALL_SHOPS_LABEL) {
      const searchParameters = {
        ...filterParams,
        ...(searchTerm && { searchTerm: searchTerm }),
        offset: 0,
        limit: 20,
      };
      await new BaseApiService(SHOP_PRODUCTS_ENDPOINT)
        .getRequestWithJsonResponse(searchParameters)
        .then(async (response) => {
          setProducts(response.records);
        })
        .catch((error) => {
          Alert.alert(error?.message);
        });
    }
  };

  const onComplete = async () => {
    setLoading(false);

    if (isSuperAdmin === false) {
      setTimeout(async () => {
        const pdts = await saveShopProductsOnDevice(
          offlineParams,
          shopProducts
        );
        dispatch(setShopProducts(pdts));
      }, 10000);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedShop]);

  useEffect(() => {
    clearEverything();
  }, [selectedShop]);

  const handleChange = (value) => {
    setSearchTerm(value);
  };

  const makeSelection = (item) => {
    dispatch(makeProductSelection(item));
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (cartItems.length > 0) {
      if (offersDebt === true) {
        setShowConfirmed(true);
        return;
      } else {
        if (isNaN(recievedAmount)) {
          snackbarRef.current.show("Please Enter a valid amount.", 4000);
          return;
        }

        if (Number(recievedAmount) < totalCartCost) {
          snackbarRef.current.show(
            `Recieved amount should not be less than ${
              selectedShop?.currency
            } ${formatNumberWithCommas(totalCartCost)}`,
            4000
          );
          return;
        }

        setShowConfirmed(true);
      }
    } else {
      snackbarRef.current.show("Product selection is required.");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <Loader loading={loading} />
      <ConfirmSaleModal
        visible={showConfirmed}
        setVisible={() => setShowConfirmed(false)}
        snackbarRef={snackbarRef}
        clients={clients}
        onComplete={onComplete}
        setLoading={setLoading}
      />

      <EnterSaleQtyModal showMoodal={showMoodal} setShowModal={setShowModal} />

      <BlackScreen flex={isShopAttendant ? 12 : 10}>
        <UserProfile renderMenu renderNtnIcon={false} menuItems={menuItems} />

        <View style={{ marginTop: 15 }}>
          {!isShopAttendant && shops?.length > 1 && (
            <View style={{ paddingHorizontal: 10 }}>
              <MyDropDown
                data={shops?.filter((s) => s?.name !== ALL_SHOPS_LABEL)}
                labelField={"name"}
                valueField="id"
                onChange={(e) => dispatch(changeSelectedShop(e))}
                value={selectedShop}
                search={shops?.length > 4}
                placeholder="Select a shop"
              />
            </View>
          )}

          <SalesDropdownComponent
            disable={!isShopAttendant && selectedShop?.name === ALL_SHOPS_LABEL}
            value={selection}
            products={products}
            handleChange={(t) => handleChange(t)}
            makeSelection={makeSelection}
            setScanned={() =>
              navigation.navigate(BARCODE_SCREEN, {
                products,
              })
            }
          />
        </View>
      </BlackScreen>

      <ScrollView
        style={{ backgroundColor: Colors.light_2, flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 10, marginTop: 7, gap: 10 }}>
          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <SalesTable sales={cartItems} />
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#000",
              alignItems: "baseline",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: scale(14) }}>
              Recieved amount
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                maxWidth: screenWidth / 2.5,
                gap: 10,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: Colors.gray,
                  fontSize: scale(14),
                  marginEnd: 5,
                }}
              >
                {selectedShop?.currency}
              </Text>
              <TextInput
                textAlign="right"
                value={recievedAmount}
                inputMode="numeric"
                onChangeText={(text) => {
                  dispatch(updateRecievedAmount(text));
                }}
                style={{
                  backgroundColor: Colors.light,
                  borderRadius: 5,
                  fontSize: scale(15),
                  marginEnd: 5,
                }}
                placeholder="Enter amount"
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <DataRow
              label={`Sold ${
                totalQty > 1
                  ? `${totalQty} items`
                  : totalQty === 1
                  ? `${totalQty} item`
                  : ""
              }`}
              value={formatNumberWithCommas(totalCartCost)}
              currency={selectedShop?.currency}
              labelTextStyle={{ fontWeight: 600 }}
            />
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <DataRow
              label={"Balance"}
              value={formatNumberWithCommas(recievedAmount - totalCartCost)}
              currency={selectedShop?.currency}
            />
          </View>

          <View
            style={{
              marginTop: 8,
              height: 40,
              marginBottom: 20,
              flexDirection: "row",
              gap: 5,
            }}
          >
            <View style={{ flex: 0.3 }}>
              <PrimaryButton
                title={"Clear"}
                onPress={clearEverything}
                darkMode={false}
              />
            </View>
            <View style={{ flex: 0.7 }}>
              <PrimaryButton
                title={"Confirm purchase"}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <Snackbar ref={snackbarRef} />
    </SafeAreaView>
  );
}

export default SalesDesk;
