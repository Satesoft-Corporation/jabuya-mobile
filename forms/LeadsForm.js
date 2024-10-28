import {
  LEADS_STAGES_ENDPOINT,
  LEADS_STATUS_ENDPOINT,
  LEADS_ENDPOINT,
} from "@utils/EndPointUtils";
import { useEffect, useRef, useState } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
} from "react-native";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Loader from "@components/Loader";
import MyInput from "@components/MyInput";
import { MyDropDown } from "@components/DropdownComponents";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { PermissionsAndroid } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { hasNull } from "@utils/Utils";
import Snackbar from "@components/Snackbar";
import { useNavigation } from "@react-navigation/native";
import { LEADS } from "@navigation/ScreenNames";

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

  const snackBarRef = useRef(null);
  const snackBarERef = useRef(null);
  const navigate = useNavigation();

  const requestLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getLocation = () => {
    const NO_LOCATION_PROVIDER_AVAILABLE = 2;
    requestLocation()
      .then((result) => {
        if (result) {
          snackBarRef.current.show("Getting Coordinates", 4000);
          Geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                log: position.coords.longitude,
                visible: true,
              });
            },
            (error) => {
              if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
                snackBarERef.current.show("Please Enable Your Location", 9000);
              } else {
                console.log(error);
              }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      })
      .catch((err) => {
        console.error("Unhandled error in getLocation:", err);
      });
  };

  const fetchStatus = async () => {
    await new BaseApiService(LEADS_STATUS_ENDPOINT)
      .getRequestWithJsonResponse()
      .then((response) => {
        setStatus(response.records);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchStages = async () => {
    await new BaseApiService(LEADS_STAGES_ENDPOINT)
      .getRequestWithJsonResponse()
      .then((response) => {
        setStages(response.records);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onStatusChange = (value) => {
    setStatus(value);
  };

  const onStageChange = (value) => {
    setStages(value);
  };

  const onSourceChange = (value) => {
    setSource(value);
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
    console.log(payload);

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

  const Source = [
    { id: 1, name: "Referral" },
    { id: 2, name: "Email" },
    { id: 3, name: "Telephone" },
    { id: 4, name: "Website" },
    { id: 5, name: "Social Partnership" },
    { id: 6, name: "Exhibition" },
    { id: 7, name: "Offline Marketing" },
    { id: 8, name: "Other" },
    { id: 9, name: "Unknown" },
  ];

  const Stages = [
    { id: 1, name: "Database" },
    { id: 2, name: "Contact Established" },
    { id: 3, name: "Needs Identification" },
    { id: 4, name: "Proposal Presented" },
    { id: 5, name: "Negotiation" },
    { id: 6, name: "Won" },
    { id: 7, name: "Lost" },
    { id: 8, name: "On Hold" },
  ];

  const Status = [
    { id: 1, name: "Hot" },
    { id: 2, name: "Warm" },
    { id: 3, name: "Cold" },
  ];

  useEffect(() => {
    populateForm();
  }, []);

  return (
    <KeyboardAvoidingView enabled={true} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
        <Snackbar ref={snackBarRef} />
        <Snackbar ref={snackBarERef} />
        <TopHeader
          title={edit ? "Edit Lead" : "Add Lead"}
          showMenuDots
          menuItems={[
            { name: "Leads", onClick: () => navigate.navigate(LEADS) },
          ]}
        />
        <Loader loading={loading} />
        <ScrollView
          contentContainerStyle={{ gap: 8, paddingBottom: 30 }}
          style={{
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.headerText}>
            {edit ? "Edit" : "Enter"} lead details
          </Text>
          <View style={{ flex: 1 }}>
            <MyInput
              label={"Shop Name"}
              value={shopName}
              cursorColor={Colors.dark}
              onValueChange={(e) => {
                setShopName(e);
              }}
            />
            {submitted && !shopName && (
              <Text style={styles.errorText}> Shop name is required.</Text>
            )}
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
              <MyInput
                value={physicalAddress}
                onValueChange={(e) => {
                  setPhysicalAddress(e);
                }}
                label="Physical Address"
              />
              {submitted && !physicalAddress && (
                <Text style={styles.errorText}>
                  Physical Address is required.
                </Text>
              )}
            </View>
          </View>

          <View>
            <PrimaryButton
              round
              style={{}}
              title={"Get Location"}
              onPress={getLocation}
            />
          </View>
          {location?.visible && (
            <View style={styles.rowGap}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontSize: 17 }}>
                  Longitude: {location.log}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontSize: 17 }}>
                  Latitude:{location.lat}
                </Text>
              </View>
            </View>
          )}
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
            <PrimaryButton
              darkMode={false}
              onPress={clearForm}
              title={"Clear"}
            />
            <PrimaryButton onPress={saveLead} title={"Save"} />
          </View>
        </ScrollView>
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
