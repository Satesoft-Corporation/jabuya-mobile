import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageParams from "../constants/StorageParams";
import { CommonActions } from "@react-navigation/native";
import { LOGIN } from "../navigation/ScreenNames";
export class UserSessionUtils {
  /**
   * This is used to get the user's bearer token.
   *
   * @returns
   */
  static async getBearerToken() {
    return await AsyncStorage.getItem(StorageParams.ACCESS_TOKEN);
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
  static async clearLocalStorageAndLogout(navigation) {
    // remove all
    await AsyncStorage.clear();
    navigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: LOGIN }],
      })
    );
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
    await AsyncStorage.setItem(
      StorageParams.FULL_LOGIN_DETAILS_JSON,
      JSON.stringify(fullObject)
    );
  }

  /**
   * This method is use to set the user's bearer token.
   *
   * @param bearerToken
   */
  static async getFullSessionObject() {
    const value = await AsyncStorage.getItem(
      StorageParams.FULL_LOGIN_DETAILS_JSON
    );
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
    await AsyncStorage.setItem(
      StorageParams.USER_DETAILS_JSON,
      JSON.stringify(userDetails)
    );
  }

  /**
   * This method is used to get a JSON object containing user details
   * @returns
   */
  static async getUserDetails() {
    const value = await AsyncStorage.getItem(StorageParams.USER_DETAILS_JSON);
    return JSON.parse(value);
  }

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
   * This method is used to set the number shops for a shop owner
   * @param {count} count
   */
  static async setShopCount(count) {
    await AsyncStorage.setItem(StorageParams.SHOP_COUNT, count);
  }

  /**
   * This method is used to get the number of shops an owner has
   * @returns shopcount
   */
  static async getShopCount() {
    let count = await AsyncStorage.getItem(StorageParams.SHOP_COUNT);
    return count;
  }

  /**
   * This method is used to set the number shops for a shop owner
   * @param {count} count
   */
  static async setShops(shops) {
    await AsyncStorage.setItem(StorageParams.SHOPS, JSON.stringify(shops));
  }

  /**
   * This method is used to get the number of shops an owner has
   * @returns shopcount
   */
  static async getShops() {
    let currencyList = await this.getCurrencies();
    let shops = await AsyncStorage.getItem(StorageParams.SHOPS);
    let parsed = JSON.parse(shops);

    let finalList = parsed?.map((item) => {
      const currency = currencyList?.find(
        (cur) => cur?.id === item?.currencyId
      );

      return {
        ...item,
        currency: currency?.symbol || "",
      };
    });
    return finalList;
  }

  /**
   * This method is used to set the login timestamp
   * @param {time} time
   */
  static async setLoginTime(time) {
    await AsyncStorage.setItem(StorageParams.LOGIN_TIME, time);
  }

  /**
   * This method is used to get the login timestamp
   * @returns
   */
  static async getLoginTime() {
    let time = await AsyncStorage.getItem(StorageParams.LOGIN_TIME);
    return new Date(time);
  }

  static async setShopProducts(productList) {
    await AsyncStorage.setItem(
      StorageParams.SHOP_PRODUCTS,
      JSON.stringify(productList)
    );
  }

  static async getShopProducts(shopId = null) {
    let productList = await AsyncStorage.getItem(StorageParams.SHOP_PRODUCTS);
    if (shopId !== null) {
      let newList = [...JSON.parse(productList)];
      let filtered = newList.filter((item) => item.shopId === shopId);
      return filtered;
    } else {
      return productList ? JSON.parse(productList) : [];
    }
  }

  static async getProductByBarcode(barcode) {
    let productList = await this.getShopProducts();

    let item = productList.find((item) => item.barcode === barcode);

    return item;
  }

  /**
   *
   * @param {*} salePayLoad
   * stores a sale record when the user is offline
   */
  static async addPendingSale(salePayLoad) {
    let pendingSales = await this.getPendingSales();

    await AsyncStorage.setItem(
      StorageParams.PENDING_SALES,
      JSON.stringify([...pendingSales, salePayLoad])
    );
  }

  static async removePendingSale(index) {
    let pendingSales = await this.getPendingSales();
    pendingSales.splice(index, 1); // Removes the sale record at the specified index

    await AsyncStorage.setItem(
      StorageParams.PENDING_SALES,
      JSON.stringify([...pendingSales])
    );
  }

  /**
   *
   * @returns returns a list of sales made offline
   */
  static async getPendingSales() {
    let list = await AsyncStorage.getItem(StorageParams.PENDING_SALES);
    return list ? JSON.parse(list) : [];
  }

  static async resetPendingSales() {
    //to clear the list
    await AsyncStorage.setItem(StorageParams.PENDING_SALES, JSON.stringify([]));
  }

  static async setUserPinCode(code) {
    await AsyncStorage.setItem(StorageParams.PIN_CODE, code);
  }

  static async getUserPinCode() {
    return await AsyncStorage.getItem(StorageParams.PIN_CODE);
  }

  static async removeUserPinCode() {
    await AsyncStorage.removeItem(StorageParams.PIN_CODE);
    await AsyncStorage.removeItem(StorageParams.PIN_LOGIN);
  }

  static async setPinLoginTime(time) {
    if (time === null) {
      await AsyncStorage.removeItem(StorageParams.PIN_LOGIN);
    } else {
      await AsyncStorage.setItem(StorageParams.PIN_LOGIN, time);
    }
  }

  static async getPinLoginTime() {
    let time = await AsyncStorage.getItem(StorageParams.PIN_LOGIN);
    return time ? new Date(time) : null;
  }

  static async setShopClients(clients) {
    let data = JSON.stringify(clients);
    await AsyncStorage.setItem(StorageParams.SHOP_CLIENTS, data);
  }

  static async getShopClients(shopId = null, withNumber = false) {
    let list = await AsyncStorage.getItem(StorageParams.SHOP_CLIENTS);

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
    await AsyncStorage.setItem(
      StorageParams.LOGIN_DETAILS,
      JSON.stringify(data)
    );
  }

  static async getLoginDetails() {
    let data = await AsyncStorage.getItem(StorageParams.LOGIN_DETAILS);

    return JSON.parse(data);
  }

  //

  /**
   * sets time when The app was last opened
   * @param {*} time
   */
  static async setLastOpenTime(time) {
    await AsyncStorage.setItem("@last_usage_time", time);
  }

  /**
   * returns the time when the app was last used
   * @returns
   */
  static async getLastOpenTime() {
    const time = await AsyncStorage.getItem("@last_usage_time");
    return time ? new Date(time) : null;
  }

  /**
   * saves currencies locally
   * @param {*} currencies
   */
  static async setCurrencies(currencies) {
    const data = JSON.stringify(currencies);
    await AsyncStorage.setItem(StorageParams.CURRENCIES, data);
  }

  /**
   * returns the list of currencies saved locally
   * @returns
   */
  static async getCurrencies(currencyId = null) {
    const list = await AsyncStorage.getItem(StorageParams.CURRENCIES);

    if (currencyId !== null) {
      let newList = [...JSON.parse(list)];
      let filtered = newList.filter((item) => item?.id === currencyId);
      return filtered;
    } else {
      return list ? JSON.parse(list) : [];
    }
  }

  static async setClientSales(list) {
    await AsyncStorage.setItem(
      StorageParams.CLIENT_SALES,
      JSON.stringify(list)
    );
  }

  static async getClientSales(client_id = null) {
    let creditList = await AsyncStorage.getItem(StorageParams.CLIENT_SALES);
    if (client_id !== null) {
      const list = [...JSON.parse(creditList)];
      let filtered = list.filter((sale) => sale?.client_id === client_id);
      return filtered;
    } else {
      return creditList ? [...JSON.parse(creditList)] : [];
    }
  }
}
