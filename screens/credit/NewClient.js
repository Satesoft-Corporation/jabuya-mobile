import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import TopHeader from "@components/TopHeader";
import Loader from "@components/Loader";
import Colors from "@constants/Colors";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Snackbar from "@components/Snackbar";
import { saveShopClients } from "@controllers/OfflineControllers";
import { useDispatch, useSelector } from "react-redux";
import { getOfflineParams, getSelectedShop } from "duqactStore/selectors";
import { getCanAddDebt } from "duqactStore/selectors/permissionSelectors";
import NoAuth from "@screens/Unauthorised";

const NewClient = ({ route }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(null);
  const [dob, setDOB] = useState(new Date());
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedShop = useSelector(getSelectedShop);
  const offlineParams = useSelector(getOfflineParams);
  const addDebt = useSelector(getCanAddDebt);

  const dispatch = useDispatch();
  const snackRef = useRef(null);

  const fillFields = (client) => {
    const first = client?.fullName?.split(" ")[0] || "";
    setFirstName(first || "");
    setLastName(client?.fullName?.split(first)[1] || "");
    setPhone1(client?.phoneNumber);
    setEmail(client?.email);
    setAddress(client?.address);
    setGender(client?.gender);
    setDOB(client?.dateOfBirth);
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setPhone1("");
    setPhone2("");
    setEmail("");
    setGender(null);
    setAddress("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      id: route?.params?.id || 0,
      phoneNumber: phone1,
      fullName: firstName?.trim() + " " + lastName?.trim(),
      shopId: route?.params ? route?.params?.shopId : selectedShop?.id,
      email: email,
    };

    console.log(payload);
    await new BaseApiService("/clients-controller")
      .postRequestWithJsonResponse(payload)
      .then(async (response) => {
        await saveShopClients(offlineParams);
        await saveShopClients(offlineParams);

        setLoading(false);
        snackRef.current.show("Client details saved successfully.", 8000);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        snackRef.current.show(e?.message, 4000);
      });
  };

  useEffect(() => {
    if (route?.params) {
      fillFields(route?.params);
    }
  }, []);

  if (!addDebt) {
    return <NoAuth />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
      <TopHeader title={route?.params ? "Edit Client" : "New Client"} />
      <Loader loading={loading} />
      <ScrollView contentContainerStyle={{ marginVertical: 10, paddingHorizontal: 10, justifyContent: "space-between" }}>
        <View style={{ gap: 10 }}>
          <Text style={{ marginTop: 10, fontSize: 16 }}>Client Details</Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <MyInput required label="First name" value={firstName} style={{ flex: 1 }} onValueChange={(text) => setFirstName(text)} />
            <MyInput label="Last name" value={lastName} style={{ flex: 1 }} onValueChange={(text) => setLastName(text)} />
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <MyInput required inputMode="numeric" label="Phone number" value={phone1} style={{ flex: 1 }} onValueChange={(text) => setPhone1(text)} />
            <MyInput label="Alternate number" value={phone2} style={{ flex: 1 }} inputMode="numeric" onValueChange={(text) => setPhone2(text)} />
          </View>

          <MyInput required label="Email" value={email} inputMode="email" onValueChange={(text) => setEmail(text)} />
          <MyInput label="Physical address" value={address} onValueChange={(text) => setAddress(text)} />
        </View>

        <PrimaryButton darkMode title={"Save"} onPress={handleSubmit} style={{ marginTop: 20 }} />
      </ScrollView>

      <Snackbar ref={snackRef} />
    </SafeAreaView>
  );
};

export default NewClient;
