import { View, Text, SafeAreaView, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { BaseApiService } from "@utils/BaseApiService";
import TopHeader from "@components/TopHeader";
import Loader from "@components/Loader";
import Colors from "@constants/Colors";
import { MyDropDown } from "@components/DropdownComponents";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { BaseStyle } from "@utils/BaseStyle";
import Snackbar from "@components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedShop, getShops } from "reducers/selectors";
import { changeSelectedShop } from "actions/shopActions";

const ExpenseForm = () => {
  const [categories, setCategories] = useState([]);
  const [dob, setDOB] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const selectedShop = useSelector(getSelectedShop);
  const shops = useSelector(getShops);

  const snackRef = useRef(null);
  const navigation = useNavigation();

  const clearForm = () => {
    setAmount("");
    setRemarks("");
  };
  const fetchCategories = async () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      commaSeparatedTypeIds: [5],
    };

    await new BaseApiService("/lookups/lookup-values")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setCategories(response.records);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const saveExpense = () => {
    let payload = {
      id: 0,
      description: remarks,
      amount: Number(amount),
      categoryId: selectedCategory?.id,
      shopId: selectedShop?.id,
    };
    setLoading(true);

    new BaseApiService("/shop/expenses")
      .saveRequestWithJsonResponse(payload, false)
      .then((response) => {
        setLoading(false);
        clearForm();
        snackRef.current.show("Details saved", 4000);
      })
      .catch((e) => {
        setLoading(false);
        snackRef.current.show(e?.message, 4000);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <KeyboardAvoidingView enabled={true} behavior={"height"} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
        <TopHeader title="Enter Expense" />

        <Loader loading={loading} />
        <View
          style={{
            marginHorizontal: 5,
            marginVertical: 10,
            paddingHorizontal: 10,
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ gap: 8 }}>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
              }}
            >
              Expense Details
            </Text>
            <View style={{ gap: 5 }}>
              <Text>Shop</Text>
              <MyDropDown
                search={false}
                style={{
                  backgroundColor: Colors.light,
                  borderColor: Colors.dark,
                }}
                data={shops?.filter((shop) => !shop?.name?.includes("All"))}
                value={selectedShop}
                onChange={(e) => {
                  dispatch(changeSelectedShop(e));
                }}
                placeholder="Select "
                labelField="name"
                valueField="id"
              />
            </View>
            <View style={{ gap: 5 }}>
              <Text>Category</Text>
              <MyDropDown
                search={false}
                style={{
                  backgroundColor: Colors.light,
                  borderColor: Colors.dark,
                }}
                data={categories}
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e);
                }}
                placeholder="Select Category"
                labelField="value"
                valueField="id"
              />
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <MyInput label="Amount" inputMode="numeric" value={amount} onValueChange={(text) => setAmount(text)} style={{ flex: 1 }} />
              <MyInput label="Date " dateValue={dob} isDateInput onDateChange={(date) => setDOB(date)} maximumDate style={{ flex: 1 }} />
            </View>
            <View style={{ flexDirection: "row" }}>
              <MyInput label="Desciprition" multiline value={remarks} onValueChange={(text) => setRemarks(text)} />
            </View>
          </View>

          <View style={BaseStyle.bottomContent}>
            <PrimaryButton title={"Save"} onPress={saveExpense} />
          </View>
        </View>
      </SafeAreaView>
      <Snackbar ref={snackRef} />
    </KeyboardAvoidingView>
  );
};

export default ExpenseForm;
