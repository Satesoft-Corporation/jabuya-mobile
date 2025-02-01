import { LEADS_ENDPOINT } from "@utils/EndPointUtils";
import { useEffect, useRef, useState } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, StyleSheet, View } from "react-native";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Loader from "@components/Loader";
import MyInput from "@components/MyInput";
import { MyDropDown } from "@components/DropdownComponents";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { hasNull } from "@utils/Utils";
import Snackbar from "@components/Snackbar";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LEADS } from "@navigation/ScreenNames";
import * as Location from "expo-location";

const LeadsForm = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState(null);
  const [stage, setStages] = useState(null);
  const [source, setSource] = useState(null);
  const [shopName, setShopName] = useState("");
  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [remark, setRemark] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [location, setLocation] = useState({ lat: 0, log: 0, visible: false });
  const [submitted, setSubmitted] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(null);

  const snackBarRef = useRef(null);
  const navigate = useNavigation();
  const isFocused = useIsFocused();

  const checkLocationStatus = async () => {
    try {
      const gpsEnabled = await Location.hasServicesEnabledAsync();
      setLocationEnabled(gpsEnabled);

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ lat: latitude, log: longitude, visible: true });
    } catch (e) {
      console.log(e);
    }
  };

  const requestLocation = async () => {
    let resf = await Location.requestForegroundPermissionsAsync();
    let resb = await Location.requestBackgroundPermissionsAsync();

    if (resf.status != "granted" && resb.status !== "granted") {
      console.log("Permission to access location was denied");
    } else {
      console.log("Permission to access location granted");
      checkLocationStatus();
    }
  };

  const onStatusChange = (value) => {
    setStatus(value);
  };

  const clearForm = () => {
    setLocation({ lat: 0, log: 0 });
    setRemark("");
    setShopName("");
    setSource(null);
    setStages(null);
    setStatus(null);
    setPhysicalAddress("");
    setEmail("");
    setPhone("");
    setName({ firstName: "", lastName: "" });
    setSubmitted(false);
    setEdit(false);
  };

  const saveLead = async () => {
    setSubmitted(true);
    setLoading(true);

    let payload = {
      id: route.params?.id || 0,
      statusID: status?.id,
      stageID: 2,
      source: "One on One",
      shopName: shopName,
      firstName: name?.firstName,
      lastName: name?.lastName,
      phone: phone,
      email: email,
      remark: remark,
      locationLatitude: location?.lat,
      locationLongitude: location?.log,
      physicalAddress: physicalAddress,
    };

    let isValidPayload = !hasNull(payload);

    if (isValidPayload === false) {
      setLoading(false);
    }

    if (isValidPayload === true) {
      let url = edit ? LEADS_ENDPOINT + "/" + route.params.id : LEADS_ENDPOINT;
      console.log(url);
      await new BaseApiService(url)
        .saveRequestWithJsonResponse(payload, edit)
        .then(async (response) => {
          snackBarRef.current.show("Lead Save successfully", 4000);
          setLoading(false);
          setSubmitted(false);
          clearForm();
        })
        .catch((error) => {
          snackBarRef.current.show(error?.message, 5000);
          setSubmitted(false);
          setLoading(false);
        });
    }
  };

  const populateForm = () => {
    if (route.params) {
      const record = { ...route.params };
      setEdit(true);
      setLocation({
        lat: record?.locationLatitude,
        log: record?.locationLongitude,
        visible: true,
      });
      setRemark(record?.remark);
      setShopName(record?.shopName);
      setSource({ name: record?.source });
      setStages({ id: record?.stageID, name: record?.stageName });
      setStatus({ id: record?.statusID, name: record?.statusName });
      setEmail(record?.email);
      setPhone(record?.phone);
      setName({ firstName: record?.firstName, lastName: record?.lastName });
      setPhysicalAddress(record?.physicalAddress);
    }
  };

  const Status = [
    { id: 1, name: "Hot" },
    { id: 2, name: "Warm" },
    { id: 3, name: "Cold" },
  ];
  useEffect(() => {
    if (isFocused === true) {
      // Check if location is enabled every 5 seconds if leads screen is open
      const intervalId = setInterval(checkLocationStatus, 5000);
      return () => clearInterval(intervalId);
    }
  }, [locationEnabled, isFocused]);

  useEffect(() => {
    populateForm();
    requestLocation();
  }, []);

  return (
    <KeyboardAvoidingView enabled={true} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
        <TopHeader title={edit ? "Edit Lead" : "Add Lead"} showMenuDots menuItems={[{ name: "Leads", onClick: () => navigate.navigate(LEADS) }]} />
        <Loader loading={loading} />
        {locationEnabled === true && (
          <ScrollView
            contentContainerStyle={{ gap: 8, paddingBottom: 30 }}
            style={{
              paddingHorizontal: 10,
            }}
          >
            <Text style={styles.headerText}>{edit ? "Edit" : "Enter"} lead details</Text>
            <View style={{ flex: 1 }}>
              <MyInput
                label={"Shop Name"}
                value={shopName}
                cursorColor={Colors.dark}
                onValueChange={(e) => {
                  setShopName(e);
                }}
              />
              {submitted && !shopName && <Text style={styles.errorText}> Shop name is required.</Text>}
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <MyInput
                  label={"First Name"}
                  value={name.firstName}
                  cursorColor={Colors.dark}
                  onValueChange={(e) => {
                    setName({ firstName: e, lastName: name?.lastName });
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <MyInput
                  label={"Last Name"}
                  value={name.lastName}
                  cursorColor={Colors.dark}
                  onValueChange={(e) => {
                    setName({ firstName: name?.firstName, lastName: e });
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <MyInput
                  label={"Email"}
                  value={email}
                  cursorColor={Colors.dark}
                  onValueChange={(e) => {
                    setEmail(e);
                  }}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1, gap: 5 }}>
                <Text>Status</Text>
                <MyDropDown
                  style={styles.dropDown}
                  data={Status}
                  onChange={onStatusChange}
                  value={status}
                  placeholder="Select Status"
                  labelField="name"
                  valueField="id"
                  search={false}
                />
              </View>
              <View style={{ flex: 1 }}>
                <MyInput
                  label={"Phone Number"}
                  value={phone}
                  cursorColor={Colors.dark}
                  onValueChange={(e) => {
                    setPhone(e);
                  }}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <MyInput value={physicalAddress} onValueChange={(e) => setPhysicalAddress(e)} label="Physical Address" />
                {submitted && !physicalAddress && <Text style={styles.errorText}>Physical Address is required.</Text>}
              </View>
            </View>

            <View>
              <MyInput
                value={remark}
                onValueChange={(e) => {
                  setRemark(e);
                }}
                label="Remark"
              />
            </View>

            <View style={styles.rowGap}>
              <PrimaryButton onPress={clearForm} title={"Clear"} style={{ flex: 0.5 }} />
              <PrimaryButton darkMode onPress={saveLead} title={"Save"} style={{ flex: 0.5 }} />
            </View>
          </ScrollView>
        )}

        {locationEnabled === false && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontWeight: 500,
                textAlign: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              Please enable devie location.
            </Text>
          </View>
        )}

        <Snackbar ref={snackBarRef} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LeadsForm;

const styles = StyleSheet.create({
  headerText: {
    marginVertical: 10,
    fontWeight: "500",
    fontSize: 16,
    marginStart: 5,
  },
  dropDown: {
    backgroundColor: Colors.light,
    borderColor: Colors.dark,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  errorText: {
    fontSize: 12,
    marginStart: 6,
    color: Colors.error,
  },
});
