import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import TopHeader from "@components/TopHeader";
import Loader from "@components/Loader";
import Colors from "@constants/Colors";
import { MyDropDown } from "@components/DropdownComponents";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Snackbar from "@components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { getLookUps, getSelectedShop, getShops } from "duqactStore/selectors";
import { changeSelectedShop } from "actions/shopActions";

const ExpenseForm = () => {
  const [categories, setCategories] = useState([]);
  const [dob, setDOB] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const selectedShop = useSelector(getSelectedShop);
  const shops = useSelector(getShops);
  const lookups = useSelector(getLookUps);

  const snackRef = useRef(null);

  const clearForm = () => {
    setAmount("");
    setRemarks("");
  };
  const fetchCategories = async () => {
    setCategories(lookups?.filter((item) => item.typeId === 5));
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
      <TopHeader title="Enter Expense" />

      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 5,
          marginVertical: 10,
          paddingHorizontal: 10,
          gap: 8,
        }}
      >
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
        <MyInput label="Desciprition" multiline value={remarks} onValueChange={(text) => setRemarks(text)} />

        <View style={{ marginTop: 20 }}>
          <PrimaryButton title={"Save"} darkMode onPress={saveExpense} />
        </View>
      </ScrollView>
      <Snackbar ref={snackRef} />
    </SafeAreaView>
  );
};

export default ExpenseForm;
