import * as actionTypes from "./actionTypes";

export const setShops = (shops) => {
  return {
    type: actionTypes.SET_SHOPS,
    payload: shops,
  };
};

export const changeSelectedShop = (shop) => {
  return {
    type: actionTypes.CHANGE_SELECTED_SHOP,
    payload: shop,
  };
};

export const setShopProducts = (products) => {
  return {
    type: actionTypes.SET_SHOP_PRODUCTS,
    payload: products,
  };
};

export const addOfflineSale = (sale) => {
  return {
    type: actionTypes.ADD_OFFLINE_SALE,
    payload: sale,
  };
};
export const removeOfflineSale = (index) => {
  return {
    type: actionTypes.REMOVE_OFFLINE_SALE,
    payload: index,
  };
};

export const addShopClients = (clients) => {
  return {
    type: actionTypes.ADD_SHOP_CLIENTS,
    payload: clients,
  };
};

export const addClientSales = (clientSales) => {
  return {
    type: actionTypes.ADD_CLIENT_SALES,
    payload: clientSales,
  };
};
