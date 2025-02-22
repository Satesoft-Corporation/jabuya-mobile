import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageParams from "../constants/StorageParams";
import { CommonActions } from "@react-navigation/native";
import { LOGIN } from "../navigation/ScreenNames";
import { navigatorRef } from "@navigation/index";
import { APP_VERSION } from "@constants/Constants";
export class UserSessionUtils {
  /**
   * This method is used to get user logged in status
   * @returns
   */
  static async isLoggedIn() {
    try {
      const loggedIn = await AsyncStorage.getItem(StorageParams.IS_LOGGED_IN);
      if (loggedIn == "true") {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * This method is used to set user logged in status
   * @returns
   */
  static async setLoggedIn(loggedIn) {
    if (loggedIn) {
      await AsyncStorage.setItem(StorageParams.IS_LOGGED_IN, "true");
    } else {
      await AsyncStorage.setItem(StorageParams.IS_LOGGED_IN, "false");
    }
  }

  /**
   * This is used to get the user's bearer token.
   *
   * @returns
   */
  static async getBearerToken() {
    return await AsyncStorage.getItem(StorageParams.ACCESS_TOKEN);
  }

  static setFirstTimeInsatll() {
    return AsyncStorage.setItem(APP_VERSION, APP_VERSION);
  }

  static getFirstTimeInstall() {
    return AsyncStorage.getItem(APP_VERSION);
  }

  /**
   * This is used to get the user's refresh token.
   *
   * @returns
   */
  static async getRefreshToken() {
    return await AsyncStorage.getItem(StorageParams.REFRESH_TOKEN);
  }
  /**
   * This method is used to clear the localstorage and redirect the user to the login screen
   */
  static async clearLocalStorageAndLogout() {
    // remove all
    navigatorRef?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: LOGIN }] }));
  }

  /**
   * This method is use to set the user's bearer token.
   *
   * @param bearerToken
   */
  static async setUserAuthToken(bearerToken) {
    await AsyncStorage.setItem(StorageParams.ACCESS_TOKEN, bearerToken);
  }

  /**
   * This method is use to set the user's bearer token.
   *
   * @param bearerToken
   */
  static async setFullSessionObject(fullObject) {
    await AsyncStorage.setItem(StorageParams.FULL_LOGIN_DETAILS_JSON, JSON.stringify(fullObject));
  }

  /**
   * This method is use to set the user's bearer token.
   *
   * @param bearerToken
   */
  static async getFullSessionObject() {
    const value = await AsyncStorage.getItem(StorageParams.FULL_LOGIN_DETAILS_JSON);
    return JSON.parse(value);
  }
  /**
   * This method is used to set the user's refresh token.
   *
   * @param refreshToken
   */
  static async setUserRefreshToken(refreshToken) {
    await AsyncStorage.setItem(StorageParams.REFRESH_TOKEN, refreshToken);
  }

  /**
   * This method is used to save a JSON object containing user details to local storage.
   *
   * @param userDetails
   */
  static async setUserDetails(userDetails) {
    await AsyncStorage.setItem(StorageParams.USER_DETAILS_JSON, JSON.stringify(userDetails));
  }

  /**
   * This method is used to get a JSON object containing user details
   * @returns
   */
  static async getUserDetails() {
    const value = await AsyncStorage.getItem(StorageParams.USER_DETAILS_JSON);
    return JSON.parse(value);
  }

  static async setShopProducts(productList) {
    const user = await this.getUserDetails();
    const key = "pdts" + user?.username;
    await AsyncStorage.setItem(key, JSON.stringify(productList));
  }

  static async getShopProducts(shopId = null) {
    const user = await this.getUserDetails();
    const key = "pdts" + user?.username;

    const productList = await AsyncStorage.getItem(key);
    if (shopId !== null) {
      let newList = [...JSON.parse(productList)];
      let filtered = newList.filter((item) => item.shopId === shopId);
      return filtered;
    } else {
      return productList ? JSON.parse(productList) : [];
    }
  }

  static async setShopClients(clients) {
    const user = await this.getUserDetails();
    const key = "clts" + user?.username;

    const data = JSON.stringify(clients);
    await AsyncStorage.setItem(key, data);
  }

  static async getShopClients(shopId = null, withNumber = false) {
    const user = await this.getUserDetails();
    const key = "clts" + user?.username;

    const list = await AsyncStorage.getItem(key);

    if (shopId !== null) {
      let newList = [...JSON.parse(list)];
      let filtered = newList.filter((item) => item?.shop?.id === shopId);
      if (withNumber === true) {
        filtered = filtered.map((item) => {
          return {
            ...item,
            fullName: `${item?.fullName}  ${item?.phoneNumber}`,
          };
        });
      }
      return filtered;
    } else {
      return list ? JSON.parse(list) : [];
    }
  }

  static async setLoginDetails(data) {
    await AsyncStorage.setItem(StorageParams.LOGIN_DETAILS, JSON.stringify(data));
  }

  static async getLoginDetails() {
    let data = await AsyncStorage.getItem(StorageParams.LOGIN_DETAILS);

    return JSON.parse(data);
  }

  /**
   * saves currencies locally
   * @param {*} currencies
   */
  static async setCurrencies(currencies) {
    const data = JSON.stringify(currencies);
    await AsyncStorage.setItem(StorageParams.CURRENCIES, data);
  }
}
