import { View, FlatList, Pressable, Text } from "react-native";
import React from "react";
import { CANCELED_SALES, USER_PERFOMANCE } from "@navigation/ScreenNames";
import Colors from "@constants/Colors";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import { useSelector } from "react-redux";
import { getIsAdmin, getOffersDebt } from "duqactStore/selectors";
import { useNavigation } from "@react-navigation/native";
import Icon from "@components/Icon";
import { screenWidth } from "@constants/Constants";
import { getCanViewSales } from "duqactStore/selectors/permissionSelectors";

const ReportsMenu = () => {
  const offersDebt = useSelector(getOffersDebt);
  const isAdmin = useSelector(getIsAdmin);
  const navigation = useNavigation();
  const canViewSales = useSelector(getCanViewSales);

  const list = [
    { title: "User sales", target: USER_PERFOMANCE, icon: "hospital-user" },
    { title: "Returned Items", target: CANCELED_SALES, icon: "truck-check", group: "MaterialCommunityIcons" },
  ];

  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: Colors.light_2 }}>
      <AppStatusBar content="light-content" bgColor="black" />

      <TopHeader title="Reports" />
      <FlatList
        style={{ flex: 1, marginTop: 10, paddingHorizontal: 10 }}
        data={list}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={{
                backgroundColor: Colors.light,
                borderRadius: 6,
                maxWidth: screenWidth / 2 - 30,
                margin: 10,
                elevation: 2,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                flex: 1,
              }}
              onPress={() => navigation.navigate(item.target)}
            >
              <View style={{ paddingVertical: 10, paddingHorizontal: 10, alignItems: "center", gap: 10 }}>
                <Icon name={item?.icon} size={25} groupName={item?.group} />
                <Text style={{ fontSize: 15 }}>{item?.title}</Text>
              </View>
            </Pressable>
          );
        }}
        numColumns={2}
      />
    </View>
  );
};

export default ReportsMenu;
