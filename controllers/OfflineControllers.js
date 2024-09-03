import { BaseApiService } from "@utils/BaseApiService";
import {
  CLIENTS_ENDPOINT,
  CLIENT_SALES_ENDPOINT,
  CURRENCIES_ENDPOINT,
  SHOP_ENDPOINT,
  SHOP_PRODUCTS_ENDPOINT,
  SHOP_SALES_ENDPOINT,
} from "@utils/EndPointUtils";
import { UserSessionUtils } from "@utils/UserSessionUtils";

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

export const resolveUnsavedSales = async () => {
  const pendingSales = await UserSessionUtils.getPendingSales();

  if (pendingSales.length > 0) {
    let errors = [];

    // Use map to create an array of promises
    await Promise.all(
      pendingSales.map(async (cart, index) => {
        console.log("Saving sale", index + 1);
        try {
          const response = await new BaseApiService(
            SHOP_SALES_ENDPOINT
          ).postRequest(cart);
          const info = await response.json();
          const status = response.status;

          if (status === 200) {
            try {
              const confirmResponse = await new BaseApiService(
                `/shop-sales/${info?.id}/confirm`
              ).postRequest();
              await confirmResponse.json();

              await UserSessionUtils.removePendingSale(index);
            } catch (error) {
              errors.push(error?.message);
            }
          } else {
            errors.push(info?.message);
          }
        } catch (error) {
          errors.push(error?.message);
        }
      })
    );

    return errors;
  }
};

export const saveShopProductsOnDevice = async (searchParameters) => {
  let pdts = [];

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
    });

  return pdts;
};

export const saveShopClients = async (searchParameters) => {
  let clients = [];

  await new BaseApiService(CLIENTS_ENDPOINT)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      await UserSessionUtils.setShopClients(response.records);
      clients = [...response.records];
    })
    .catch((error) => {
      console.log("Unknown Error", error?.message);
    });

  return clients;
};

export const saveShopDetails = async (searchParameters) => {
  let shopsArray = [];
  console.log("Saving shops");
  const currencyList = await saveCurrencies();
  await new BaseApiService(SHOP_ENDPOINT)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      await UserSessionUtils.setShopCount(String(response.totalItems));
      await UserSessionUtils.setShops(response.records);

      const finalList = response.records?.map((item) => {
        const currency = currencyList?.find(
          (cur) => cur?.id === item?.currencyId
        );

        return {
          ...item,
          currency: currency?.symbol || "",
        };
      });
      if (finalList.length > 1) {
        const allShops = {
          name: "All shops",
          id: searchParameters?.shopOwnerId || 0,
        };

        shopsArray = [allShops, ...finalList];
      } else {
        shopsArray = [...finalList];
      }
    })
    .catch(async (error) => {
      console.log(error);
      shopsArray = await UserSessionUtils.getShops();
    });

  // return saved;
  return shopsArray;
};

export const saveClientSalesOnDevice = async (searchParameters) => {
  let clientSales = [];
  console.log("Saving credit sales");
  await new BaseApiService(CLIENT_SALES_ENDPOINT)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      const modified = response?.records?.map((item) => {
        const {
          amountLoaned,
          amountRepaid,
          balance,
          changedByFullName,
          createdByFullName,
          createdByUsername,
          currency,
          dateCreated,
          id,
          lineItems,
          shopClient,
          serialNumber,
          sale,
        } = item;

        return {
          amountLoaned,
          amountRepaid,
          balance,
          changedByFullName,
          createdByFullName,
          createdByUsername,
          currency,
          dateCreated,
          id,
          lineItems,
          client_id: shopClient?.id,
          client_name: shopClient?.fullName,
          serialNumber,
          creditSaleId: sale?.id,
        };
      });
      clientSales = [...modified];
    })
    .catch((error) => {
      console.log("Unknown Error", error?.message);
    });

  return clientSales;
};
