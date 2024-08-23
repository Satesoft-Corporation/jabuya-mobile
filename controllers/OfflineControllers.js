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

  await new BaseApiService(CURRENCIES_ENDPOINT)
    .getRequestWithJsonResponse(searchParameters)
    .then(async (response) => {
      await UserSessionUtils.setCurrencies(response?.records);
    })
    .catch((error) => {
      console.error(error, "currencies");
    });
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

export const saveShopProductsOnDevice = async (
  searchParameters,
  refresh = false //to get updated data
) => {
  let saved = false;
  const currentPdts = await UserSessionUtils.getShopProducts();

  if (currentPdts.length === 0 || refresh === true) {
    //only hit the api if no product is stored
    console.log("saving pdts offline");
    await new BaseApiService(SHOP_PRODUCTS_ENDPOINT)
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        await UserSessionUtils.setShopProducts(response.records); //to keep updating the list locally
        saved = true;
        console.log("products saved");
      })
      .catch((error) => {
        console.log("Unknown Error", error?.message);
        if (currentPdts.length === 0) {
          saved = false;
        }
      });
  }

  if (currentPdts.length > 0) {
    saved = true;
  }
  return saved;
};

export const saveShopClients = async (params, refresh = false) => {
  let saved = false;

  const currentClients = await UserSessionUtils.getShopClients();

  if (currentClients.length === 0 || refresh === true) {
    await saveClientSalesOnDevice(params);
    await new BaseApiService(CLIENTS_ENDPOINT)
      .getRequestWithJsonResponse(params)
      .then(async (response) => {
        await UserSessionUtils.setShopClients(response.records); //to keep updating the list locally
        saved = true;
      })
      .catch((error) => {
        console.log("Unknown Error", error?.message);
        if (currentClients.length === 0) {
          saved = false;
        }
      });
  }

  if (currentClients.length > 0) {
    saved = true;
  }

  return saved;
};

export const saveShopDetails = async (
  isShopOwner,
  shopOwnerId,
  refresh = false
) => {
  let saved = false;

  const searchParameters = {
    limit: 0,
    offset: 0,
    ...(isShopOwner === true && { shopOwnerId: shopOwnerId }),
  };
  const shops = await UserSessionUtils.getShopCount();

  if (!shops || refresh === true) {
    console.log("Saving shops");
    await new BaseApiService(SHOP_ENDPOINT)
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        await UserSessionUtils.setShopCount(String(response.totalItems));
        await UserSessionUtils.setShops(response.records);
        saved = true;
      })
      .catch((error) => {
        saved = false;
      });
  }

  return saved;
};

export const saveClientSalesOnDevice = async (searchParameters) => {
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
      await UserSessionUtils.setClientSales(modified);
    })
    .catch((error) => {
      console.log("Unknown Error", error?.message);
    });
};
