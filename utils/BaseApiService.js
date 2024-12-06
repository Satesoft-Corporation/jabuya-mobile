import { INTERNAL_SERVER_ERROR } from "../constants/ErrorMessages";
import { UserSessionUtils } from "./UserSessionUtils";
import { BASE_URL } from "./BaseUrl";
import { Platform } from "react-native";
import Constants from "expo-constants";

export class BaseApiService {
  apiEndpoint;
  authToken = UserSessionUtils.getBearerToken();

  /**
   * This is constructor is used to initialize the API service endpoint to be used for this call.
   *
   * @param apiEndpoint
   */
  constructor(apiEndpoint) {
    this.apiEndpoint = BASE_URL + apiEndpoint;
  }

  /**
   * This method is used to make a GET api request to the provided constructor API endpoint.
   *
   * @param queryParameters
   * @returns
   */
  async getRequest(queryParameters) {
    let token = await UserSessionUtils.getBearerToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      Version_code: Constants.expoConfig.version,
      Platform_type: Platform.OS,
    };
    return await fetch(this.apiEndpoint + "?" + new URLSearchParams(queryParameters), {
      method: "GET",
      headers: headers,
    });
  }

  /**
   * This method is used to make a GET api request to the provided constructor API endpoint.
   * This returns a JSON response or redirects to the login screen if a 401 is detected.
   *
   * @param queryParameters
   * @returns
   */
  async getRequestWithJsonResponse(queryParameters) {
    return this.getRequest(queryParameters).then(async (response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status == 400 || response.status == 500) {
        let data = await response.json();
        let errorMessage = data?.message ?? INTERNAL_SERVER_ERROR;
        throw new TypeError(errorMessage);
      } else if (response.status == 401 || response.status == 403) {
        UserSessionUtils.clearLocalStorageAndLogout();
      } else {
        throw new TypeError(INTERNAL_SERVER_ERROR);
      }
    });
  }

  /**
   * This method is used to make a POST API request to the provided constructor endpoint.
   *
   * @param requestBody
   * @returns
   */
  async postRequest(requestBody) {
    let token = await UserSessionUtils.getBearerToken();
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      Version_code: Constants.expoConfig.version,
      Platform_type: Platform.OS,
    };
    return await fetch(this.apiEndpoint, {
      method: "POST",
      headers: headers,
      body: requestBody !== null ? JSON.stringify(requestBody) : "",
    });
  }

  /**
   * This method is used to make a POST API request to the provided constructor endpoint.
   * This returns a JSON response or redirects to the login screen if a 401 is detected.
   *
   * @param requestBody
   * @returns
   */
  async postRequestWithJsonResponse(requestBody) {
    return this.postRequest(requestBody)
      .then((response) =>
        //{
        response.json()
      )
      .then((responseData) => {
        if (responseData?.status == 200) {
          return responseData;
        } else if (responseData?.status == 400 || responseData?.status == 403 || responseData?.status == 500) {
          let data = responseData;
          let errorMessage = data?.message ?? INTERNAL_SERVER_ERROR;
          throw new TypeError(errorMessage);
        } else if (responseData?.status == 401) {
          UserSessionUtils.clearLocalStorageAndLogout();
        } else {
          throw new TypeError(INTERNAL_SERVER_ERROR);
        }
      });
  }

  /**
   * This method is used to obtain a refresh token from the server
   */
  async refreshTokenRequest() {
    let token = await UserSessionUtils.getRefreshToken();

    const headers = {
      Authorization: "Bearer " + token,
    };
    return await fetch(this.apiEndpoint, {
      method: "POST",
      headers: headers,
    });
  }

  /**
   * This method is used to make a POST API request to the provided constructor endpoint.
   *
   * @param requestBody
   * @returns
   */
  async putRequest(requestBody) {
    let token = await UserSessionUtils.getBearerToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      Version_code: Constants.expoConfig.version,
      Platform_type: Platform.OS,
    };
    return fetch(this.apiEndpoint, {
      method: "PUT",
      headers: headers,
      body: requestBody !== null ? JSON.stringify(requestBody) : "",
    });
  }

  /**
   * This method is used to make a POST/PUT  API request to the provided constructor endpoint.
   * This returns a JSON response or redirects to the login screen if a 401 is detected.
   *
   * @param requestBody
   * @returns
   */
  async saveRequestWithJsonResponse(requestBody, update) {
    const response = update && update === true ? await this.putRequest(requestBody) : await this.postRequest(requestBody);
    if (response.ok) {
      return response.json();
    } else if (response.status === 400 || response.status === 403 || response.status === 500) {
      let data = await response.json();
      let errorMessage = data?.message ?? INTERNAL_SERVER_ERROR;
      throw new TypeError(errorMessage);
    } else if (response.status === 401) {
      UserSessionUtils.clearLocalStorageAndLogout();
    } else {
      throw new TypeError(INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRequest(requestBody) {
    let token = await UserSessionUtils.getBearerToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    return fetch(this.apiEndpoint, {
      method: "DELETE",
      headers: headers,
      body: requestBody !== null ? JSON.stringify(requestBody) : "",
    });
  }

  /**
   * This method is used to make a POST/PUT  API request to the provided constructor endpoint.
   * This returns a JSON response or redirects to the login screen if a 401 is detected.
   *
   * @param requestBody
   * @returns
   */
  async deleteRequestWithJsonResponse(requestBody) {
    const response = await this.deleteRequest(requestBody);
    if (response.ok) {
      return response.json();
    } else if (response.status === 400 || response.status === 403 || response.status === 500) {
      let data = await response.json();
      let errorMessage = data?.message ?? INTERNAL_SERVER_ERROR;
      throw new TypeError(errorMessage);
    } else if (response.status === 401) {
      UserSessionUtils.clearLocalStorageAndLogout();
    } else {
      throw new TypeError(INTERNAL_SERVER_ERROR);
    }
  }
}
