import { View, Text, Linking, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import TopHeader from "@components/TopHeader";
import Colors from "@constants/Colors";
import Icon from "@components/Icon";
import { CLIENT_FORM } from "@navigation/ScreenNames";

const ContactDetails = ({ route }) => {
  const client = route?.params;

  const navigation = useNavigation();

  const openWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=+${client?.phoneNumber}`);
  };

  const makePhoneCall = () => {
    Linking.openURL(`tel:+${client?.phoneNumber}`);
  };

  const openSmsUrl = () => {
    Linking.openURL(`sms:+${client?.phoneNumber}`);
  };

  const editContact = () => {
    navigation.navigate(CLIENT_FORM, client);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="" showShopName={false} />
      <View style={{ backgroundColor: "#000", height: 90 }} />

      <View
        style={{
          backgroundColor: Colors.gray,
          height: 100,
          width: 100,
          borderWidth: 1,
          borderRadius: 100,
          borderColor: Colors.gray,
          justifyContent: "center",
          alignSelf: "center",
          alignItems: "center",
          marginTop: -50,
          borderColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 60, fontWeight: 600, textAlign: "center" }}>{String(client?.fullName).charAt(0).toUpperCase()}</Text>
      </View>

      <View style={{ paddingHorizontal: 10 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 30 }}>{client?.fullName}</Text>
          <Text style={{ fontSize: 16 }}>+{client?.phoneNumber}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 20 }}>
          <View style={styles.iconBox}>
            <Icon name="call-outline" size={25} onPress={makePhoneCall} groupName="Ionicons" />
          </View>

          <View style={styles.iconBox}>
            <Icon name="whatsapp" size={25} onPress={openWhatsApp} />
          </View>

          <View style={styles.iconBox}>
            <Icon name="android-messages" size={25} onPress={openSmsUrl} groupName="MaterialCommunityIcons" />
          </View>

          <View style={styles.iconBox}>
            <Icon name="edit" size={25} onPress={editContact} groupName="AntDesign" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContactDetails;

const styles = StyleSheet.create({
  iconBox: {
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
