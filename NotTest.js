import { View, Text } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";
import { Button } from "react-native";
import { SALES_REPORTS, STOCK_LEVELS } from "@navigation/ScreenNames";
import { sendLocalNotification } from "@utils/Utils";

const NotTest = () => {
  // First, set the handler that will cause the notification
  // to show the alert

  // Second, call the method
  const sendNotification = async () => {
    await sendLocalNotification("Hey", "Sale has been made", SALES_REPORTS);
  };

  return (
    <View>
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
};

export default NotTest;
