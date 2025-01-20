import { View, Text, SafeAreaView, FlatList, Linking, Pressable } from "react-native";
import React, { useEffect } from "react";
import TopHeader from "@components/TopHeader";
import Colors from "@constants/Colors";
import { useState } from "react";
import Icon from "@components/Icon";
import { useNavigation } from "@react-navigation/native";
import { CONTACT_DETAILS } from "@navigation/ScreenNames";
import { UserSessionUtils } from "@utils/UserSessionUtils";

const ContactBook = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const filterClients = async (searchParam = "") => {
    const clients = await UserSessionUtils.getShopClients();

    const list = clients?.filter((item) => item?.fullName?.toLowerCase()?.includes(searchParam.toLowerCase().trim()));
    setFiltered(list);
    setLoading(false);
    if (list?.length == 0) {
      setMessage("No records found");
    }
  };

  useEffect(() => {
    filterClients();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader
        title="Contact List"
        showSearch
        searchTerm={searchTerm}
        setSearchTerm={(e) => {
          filterClients(e);
          setSearchTerm(e);
        }}
        onSearch={() => {}}
      />
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        {message && <Text style={{ textAlign: "center" }}>{message}</Text>}
        <FlatList
          data={filtered}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <Card client={item} />}
          onRefresh={() => {
            setLoading(true);
            filterClients();
          }}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

function Card({ client }) {
  const makePhoneCall = () => {
    Linking.openURL(`tel:+${client?.phoneNumber}`);
  };

  const openWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=+${client?.phoneNumber}`);
  };

  const navigation = useNavigation();
  return (
    <View
      style={{
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Pressable
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        onPress={() => {
          navigation.navigate(CONTACT_DETAILS, client);
        }}
      >
        <View
          style={{
            backgroundColor: Colors.gray,
            height: 45,
            width: 45,
            borderWidth: 1,
            borderRadius: 50,
            borderColor: Colors.gray,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: 600 }}>{String(client?.fullName).charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 500 }}>{client?.fullName}</Text>
          <Text style={{ fontSize: 12 }}>Mob: {client?.phoneNumber}</Text>
        </View>
      </Pressable>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Icon name="call-outline" size={25} onPress={makePhoneCall} groupName="Ionicons" />
        <Icon name="android-messages" size={25} onPress={openWhatsApp} groupName="MaterialCommunityIcons" />
      </View>
    </View>
  );
}
export default ContactBook;
