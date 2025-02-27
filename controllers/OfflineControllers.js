import { BaseApiService } from "@utils/BaseApiService";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { CLIENT_ENDPOINT, CURRENCY_ENDPOINT, LOOKUP_ENDPOINT, SHOP_ENDPOINT, SHOP_PRODUCT_ENDPOINT, SUPPLIER_ENDPOINT } from "api";

export const saveSuppliers = async (prev = []) => {
  let suppliers = [];
  await new BaseApiService(SUPPLIER_ENDPOINT.GET_ALL)
    .getRequestWithJsonResponse({ limit: 0, offset: 0 })
    .then((response) => {
      suppliers = [...response?.records];
    })
    .catch((error) => {
      console.error(error, "manufacturers");
      suppliers = [...prev];
    });

  return suppliers;
};

export const saveCurrencies = async () => {
  const searchParameters = { limit: 0, offset: 0 };
  let currencies = [];
  await new BaseApiService(CURRENCY_ENDPOINT.GET_ALL)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      await UserSessionUtils.setCurrencies(response?.records);
      currencies = [...response?.records];
    })
    .catch((error) => {
      console.error(error, "currencies");
    });

  return currencies;
};

export const saveShopProductsOnDevice = async (searchParameters) => {
  console.log("saving pdts offline");
  await new BaseApiService(SHOP_PRODUCT_ENDPOINT.GET_ALL)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      await UserSessionUtils.setShopProducts(response.records); //to keep updating the list locally
      console.log("products saved");
    })
    .catch((error) => {
      console.log("Unknown Error", error?.message);
    });
};

export const saveShopClients = async (searchParameters) => {
  console.log("saving clients");

  await new BaseApiService(CLIENT_ENDPOINT.GET_ALL)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      const sorted = response.records
        ?.map((i) => {
          const currency = i?.shop?.currency?.symbol;
          const shopId = i?.shop?.id;

          const newData = { ...i, currency: currency, shopId: shopId, displayName: `${i?.fullName} ${i?.phoneNumber}` };
          delete newData?.shop;
          return newData;
        })
        ?.sort((a, b) => {
          if (a?.fullName < b?.fullName) {
            return -1;
          }
          if (a?.fullName > b?.fullName) {
            return 1;
          }
          return 0;
        });

      const shopDebtors = sorted?.filter((i) => i?.balance > 0);

      await UserSessionUtils.setShopDebtors(shopDebtors);
      await UserSessionUtils.setShopClients(sorted);
      console.log("clients saved");
    })
    .catch((error) => {
      console.log("Error saving client", error?.message);
    });
};

export const saveLookUps = async (prev = []) => {
  let data = [];

  await new BaseApiService(LOOKUP_ENDPOINT.GET_LOOKUP_VALUES)
    .getRequestWithJsonResponse({ limit: 0, offset: 0 })
    .then(async (response) => {
      data = [...response.records];
    })
    .catch((error) => {
      data = [...prev];
    });

  return data;
};

export const saveShopDetails = async (searchParameters, isShopAttendant = false) => {
  let shopsArray = [];
  console.log("Saving shops");
  const currencyList = await saveCurrencies();

  const apiUrl = isShopAttendant === false ? SHOP_ENDPOINT.GET_ALL : SHOP_ENDPOINT.GET_BY_ID(searchParameters?.shopId);

  await new BaseApiService(apiUrl)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      if (isShopAttendant === false) {
        const finalList = response?.records?.map((item) => {
          const currency = currencyList?.find((cur) => cur?.id === item?.currencyId);
          return { ...item, currency: currency?.symbol || "" };
        });
        shopsArray = [...finalList];
      }

      if (isShopAttendant === true) {
        const currency = currencyList?.find((cur) => cur?.id === response?.data?.currencyId);

        shopsArray = [{ ...response?.data, currency: currency?.symbol || "" }];

        console.log("shops saved");
      }
    })
    .catch(async (error) => {
      console.log(error);
    });

  getShopUsers(shopsArray);

  // return saved;
  return shopsArray;
};

export const getShopUsers = async (shopsList = []) => {
  let data = [];
  shopsList?.forEach(async (shop) => {
    if (shop) {
      console.log("Saving users", shop?.name);
      await new BaseApiService(`/shops/${shop?.id}/user-accounts`)
        .getRequestWithJsonResponse({ offset: 0, limit: 0 })
        .then((response) => {
          data.push(...response?.records);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
  console.log("Users saved");
  return data;
};
