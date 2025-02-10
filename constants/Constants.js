import { Dimensions } from "react-native";
import Constants from "expo-constants";

export const packageOptions = [
  { value: "Packed", type: true },
  { value: "Unpacked", type: false },
];

export const MAXIMUM_RECORDS_PER_FETCH = 20;
export const MAXIMUM_CACHEPAGE_SIZE = 200;

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const paymentMethods = [
  { name: "Cash", id: 0 },
  { name: "Debt", id: 1 },
];

export const userTypes = { isShopOwner: "Shop Owner", isShopAttendant: "Shop Attendant", isSuperAdmin: "System Admin" };

export const ALL_SHOPS_LABEL = "All Shops";

export const APP_VERSION = `v ${Constants.expoConfig.version}`;

export const subscriptionPaymentMethods = [
  { id: 1, name: "CASH" },
  { id: 2, name: "MPESA" },
  { id: 3, name: "AIRTEL_MONEY" },
  { id: 4, name: "MTN_MOMO" },
  { id: 5, name: "SYSTEM" },
  { id: 6, name: "BANK" },
];

export const damageTypes = [
  { type: "EXPIRY", name: "Expiry" },
  { type: "SALE_TIME", name: "Sale Time" },
  { type: "FACTORY_ERROR", name: "Factory Error" },
  { type: "DELIVERY_ERROR", name: "Deliver Error" },
  { type: "OTHER", name: "Other" },
];
