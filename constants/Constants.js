import { Dimensions } from "react-native";
import Constants from "expo-constants";

export const packageOptions = [
  { value: "Packed", type: true },
  { value: "Unpacked", type: false },
];

export const MAXIMUM_RECORDS_PER_FETCH = 20;

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const paymentMethods = [
  { name: "Cash", id: 0 },
  { name: "Debt", id: 1 },
];

export const userTypes = {
  isShopOwner: "Shop Owner",
  isShopAttendant: "Shop Attendant",
  isSuperAdmin: "Super Admin",
};

export const ALL_SHOPS_LABEL = "All Shops";

export const APP_VERSION = `v ${Constants.expoConfig.version}`;
