import { Dimensions } from "react-native";

export const packageOptions = [
  { value: "Packed", type: true },
  { value: "Unpacked", type: false },
];

export const categoryIcons = [
  // landing screen icons
  {
    id: 1,
    icon: require("../assets/icons/icons8-cash-register-50.png"),
    title: "Sales Desk",
    target: "salesEntry",
  },
  {
    id: 2,
    icon: require("../assets/icons/icons8-report-50.png"),
    title: "Reports",
    target: "viewSales",
  },
  {
    id: 3,
    icon: require("../assets/icons/icons8-box-50.png"),
    title: "Stocking",
    target: "stocking",
  },
  {
    id: 4,
    icon: require("../assets/icons/icons8-chat-50.png"),
    title: "Chat",
  },
  {
    id: 5,
    icon: require("../assets/icons/icons8-box-50.png"),
    title: "Contact Book",
  },
  {
    id: 6,
    icon: require("../assets/icons/icons8-chat-50.png"),
    title: "Credit/Debit",
    target: "credit_menu",
  },
];

export const MAXIMUM_RECORDS_PER_FETCH = 20;

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const paymentMethods = [
  { name: "Cash", id: 0 },
  { name: "Credit", id: 1 },
];
