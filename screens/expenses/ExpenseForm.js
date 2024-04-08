import { View, Text, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import { BaseStyle } from "../../utils/BaseStyle";
import MyInput from "../../components/MyInput";
import ChipButton from "../../components/buttons/ChipButton";
import { MyDropDown } from "../../components/DropdownComponents";
import Colors from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { BaseApiService } from "../../utils/BaseApiService";

const ExpenseForm = () => {
  const [categories, setCategories] = useState([]);
  const [dob, setDOB] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);

  const { selectedShop, setSelectedShop, shops } = useContext(UserContext);

  const navigation = useNavigation();
  const fetchCategories = async () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      commaSeparatedTypeIds: [5],
    };
    new BaseApiService("/lookups/lookup-values")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setCategories(response.records);
        console.log(response.records)
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

    new BaseApiService("/shops/expenses")
      .saveRequestWithJsonResponse(payload, false)
      .then((response) => {
        setLoading(false);
        // clearForm();
        // snackRef.current.show("Client details saved", 4000);
      })
      .catch((e) => {
        setLoading(false);

        // snackRef.current.show(e?.message, 4000);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader title="Enter Expense" />

      <Loader loading={loading} />
      <View style={BaseStyle.shadowedContainer}>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
          }}
        >
          Expense Details
        </Text>

        <View style={{ marginTop: 20, gap: 5 }}>
          <Text>Shop</Text>
          <MyDropDown
            search={false}
            style={{
              backgroundColor: Colors.light,
              borderColor: Colors.dark,
            }}
            data={shops}
            value={selectedShop}
            onChange={(e) => {
              setSelectedShop(e);
            }}
            placeholder="Select "
            labelField="name"
            valueField="id"
          />
        </View>

        <View style={{ marginTop: 10, gap: 5 }}>
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
        <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <MyInput
              label="Amount"
              inputMode="numeric"
              value={amount}
              onValueChange={(text) => setAmount(text)}
            />
          </View>
          <MyInput
            label="Date "
            value={dob}
            isDateInput
            onValueChange={(date) => setDOB(date)}
          />
        </View>

        <MyInput
          label="Remarks"
          multiline
          value={remarks}
          onValueChange={(text) => setRemarks(text)}
        />

        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            marginBottom: 10,
          }}
        >
          <ChipButton title={"Cancel"} onPress={() => navigation.goBack()} />
          <ChipButton darkMode title={"Save"} onPress={saveExpense} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExpenseForm;
