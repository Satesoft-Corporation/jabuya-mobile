import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageParams from "../constants/StorageParams";
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
  static async clearLocalStorageAndLogout(pageContext) {
    // remove all
    await AsyncStorage.clear();
    pageContext?.pageDispatch({ page: "appTour" });
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
  static async setUserSettings(settings) {
    await AsyncStorage.setItem(StorageParams.USER_SETTINGS, JSON.stringify(settings));
  }
  /**
   * This method is use to set the user's bearer token.
   *
   * @param bearerToken
   */
  static async setCountry(country) {
    await AsyncStorage.setItem(StorageParams.COUNTRY, JSON.stringify(country));
  }

  /**
   * This method is use to set the user's app settings.
   *
   */
  static async getCountry() {
    const value = await AsyncStorage.getItem(StorageParams.COUNTRY);
    return JSON.parse(value);
  }

  /**
   * This method is use to set the user's app settings.
   *
   */
  static async getUserSettings() {
    const value = await AsyncStorage.getItem(StorageParams.USER_SETTINGS);
    return JSON.parse(value);
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
   * This method is used to get the stored expo device Id.
   */
  static async getDeviceId() {
    return await AsyncStorage.getItem(StorageParams.EXPO_DEVICE_ID);
  }

  /**
   * This method is used to store the expo device Id.
   */
  static async setDeviceId(token) {
    await AsyncStorage.setItem(StorageParams.EXPO_DEVICE_ID, token);
  }

  /**
   * This method is used to save a JSON object containing country details.
   *
   * @param country
   */
  static async setUserCountry(country) {
    await AsyncStorage.setItem(StorageParams.COUNTRY, JSON.stringify(country));
  }

  /**
   * This method is used to get user country details
   * @returns
   */
  static async getUserCountry() {
    return await AsyncStorage.getItem(StorageParams.COUNTRY);
  }

  /**
   * This method is used to save a JSON object containing language.
   *
   * @param language
   */
  static async setUserLanguage(language) {
    await AsyncStorage.setItem(StorageParams.LANGUAGE, JSON.stringify(language));
  }

  /**
   * This method is used to get a JSON object containing user country details
   * @returns
   */
  static async getUserLanguage() {
    return await AsyncStorage.getItem(StorageParams.LANGUAGE);
  }
  /*
   * This method is used to check whether a user is a church member
   * @returns
   */
  static async isChurchMember() {
    const churchMember = await AsyncStorage.getItem(StorageParams.IS_CHURCH_MEMBER);
    console.log("isChurchMember=========" + churchMember);
    if (churchMember !== null && churchMember == "true") {
      return true;
    }
    return false;
  }

  /**
   * This method is used to set a user as a church member
   * @returns
   */
  static async setChurchMember(churchMember) {
    if (churchMember) {
      await AsyncStorage.setItem(StorageParams.IS_CHURCH_MEMBER, "true");
    } else {
      await AsyncStorage.setItem(StorageParams.IS_CHURCH_MEMBER, "false");
    }
  }
}
