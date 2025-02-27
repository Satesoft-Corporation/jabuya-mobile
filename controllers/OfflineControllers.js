import { MAXIMUM_CACHEPAGE_SIZE, MAXIMUM_RECORDS_PER_FETCH } from "@constants/Constants";
import { BaseApiService } from "@utils/BaseApiService";
import {
  CLIENTS_ENDPOINT,
  CURRENCIES_ENDPOINT,
  LOOK_UPS_ENDPOINT,
  MANUFACTURERS_ENDPOINT,
  SHOP_ENDPOINT,
  SHOP_PRODUCTS_ENDPOINT,
  SUPPLIERS_ENDPOINT,
} from "@utils/EndPointUtils";
import { UserSessionUtils } from "@utils/UserSessionUtils";

export const saveManufactures = async (prev = []) => {
  let manufacturers = [];
  await new BaseApiService(MANUFACTURERS_ENDPOINT)
    .getRequestWithJsonResponse({ limit: 0, offset: 0 })
    .then((response) => {
      manufacturers = [...response?.records];
    })
    .catch((error) => {
      console.error(error, "manufacturers");
      manufacturers = [...prev];
    });

  return manufacturers;
};

export const saveSuppliers = async (prev = []) => {
  let suppliers = [];
  await new BaseApiService(SUPPLIERS_ENDPOINT)
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
  const searchParameters = {
    limit: 0,
    offset: 0,
  };
  let currencies = [];
  await new BaseApiService(CURRENCIES_ENDPOINT)
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

export const saveShopProductsOnDevice = async (searchParameters, prev = []) => {
  let pdts = [];
  const totalRecords = 0;
  const offSet = 0;
  const limit = MAXIMUM_CACHEPAGE_SIZE;

  console.log("saving pdts offline");
  await new BaseApiService(SHOP_PRODUCTS_ENDPOINT)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      pdts = [...response.records];
      await UserSessionUtils.setShopProducts(response.records); //to keep updating the list locally
      console.log("products saved");
    })
    .catch((error) => {
      console.log("Unknown Error", error?.message);
      pdts = [...prev];
    });

  return pdts;
};

export const saveShopClients = async (searchParameters) => {
  console.log("saving clients");
  await new BaseApiService(CLIENTS_ENDPOINT)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      const sorted = response.records
        ?.map((i) => {
          const currency = i?.shop?.currency?.symbol;
          const shopId = i?.shop?.id;

          const newData = { ...i, currency: currency, shopId: shopId };
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

      await UserSessionUtils.setShopClients(sorted);
      console.log("clients saved");
    })
    .catch((error) => {
      console.log("Unknown Error", error?.message);
    });
};

export const saveLookUps = async (prev = []) => {
  let data = [];

  await new BaseApiService(LOOK_UPS_ENDPOINT)
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

  const apiUrl = isShopAttendant === false ? SHOP_ENDPOINT : `${SHOP_ENDPOINT}/${searchParameters?.shopId}`;

  await new BaseApiService(apiUrl)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      if (isShopAttendant === false) {
        const finalList = response?.records?.map((item) => {
          const currency = currencyList?.find((cur) => cur?.id === item?.currencyId);
          return {
            ...item,
            currency: currency?.symbol || "",
          };
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

  // return saved;
  return shopsArray;
};
